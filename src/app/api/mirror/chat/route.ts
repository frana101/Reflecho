import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOpenAI, MIRROR_MODEL, temperatureParam } from "@/lib/ai/openai";
import { buildAdvisorSystemPrompt } from "@/lib/ai/mirror-prompt";
import { loadAdvisorRelationshipContext } from "@/lib/advisor/load-context";
import {
  initializeAdvisorEvolution,
  processExchangeForRelationship,
} from "@/lib/advisor/update-relationship";
import { dbRowToDossier } from "@/lib/types/dossier";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatBody {
  conversationId?: string;
  message: string;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const message = (body.message ?? "").trim();
  if (!message)
    return NextResponse.json({ error: "Empty message" }, { status: 400 });

  let conversationId = body.conversationId;
  if (!conversationId) {
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title: message.slice(0, 60),
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    conversationId = conv.id;
  } else {
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId)
      .eq("user_id", user.id);
  }

  if (!conversationId) {
    return NextResponse.json({ error: "Conversation missing" }, { status: 500 });
  }

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    user_id: user.id,
    role: "user",
    content: message,
  });

  const [{ data: profile }, { data: dossierRow }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("cognitive_dossiers")
      .select("*")
      .eq("user_id", user.id)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const dossier = dossierRow ? dbRowToDossier(dossierRow) : null;

  const relationshipContext = await loadAdvisorRelationshipContext(
    supabase,
    user.id,
    conversationId,
  );

  if (dossier && !relationshipContext.evolution) {
    void initializeAdvisorEvolution(supabase, user.id, dossier).catch(
      console.error,
    );
  }

  const { data: historyRows } = await supabase
    .from("messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(40);

  const systemPrompt = buildAdvisorSystemPrompt({
    displayName: profile?.display_name ?? "Subject",
    dossier,
    relationshipContext,
  });

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
    ...(historyRows ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  let assistantText = "";
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: MIRROR_MODEL,
      ...temperatureParam(MIRROR_MODEL, 0.55),
      messages,
    });
    assistantText = completion.choices[0]?.message?.content?.trim() ?? "";
  } catch (e) {
    const m = e instanceof Error ? e.message : "Advisor failed.";
    return NextResponse.json({ error: m }, { status: 500 });
  }

  if (!assistantText) {
    return NextResponse.json(
      { error: "Advisor produced no response." },
      { status: 500 },
    );
  }

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    user_id: user.id,
    role: "assistant",
    content: assistantText,
  });

  const userMessageCount =
    (historyRows ?? []).filter((m) => m.role === "user").length + 1;

  void (async () => {
    try {
      await processExchangeForRelationship(
        supabase,
        user.id,
        conversationId,
        dossier,
        [
          { role: "user", content: message },
          { role: "assistant", content: assistantText },
        ],
        userMessageCount,
      );
    } catch (e) {
      console.error(e);
    }
  })();

  return NextResponse.json({
    conversationId: conversationId,
    assistant: assistantText,
  });
}

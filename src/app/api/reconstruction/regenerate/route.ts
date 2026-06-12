import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/data/questions";

export const runtime = "nodejs";

const ALLOWED_QUESTION_IDS = new Set(QUESTIONS.map((q) => q.id));

/** Delete dossier + analysis memory, keep quiz answers, re-run synthesis. */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: responses, error: rErr } = await supabase
    .from("reconstruction_responses")
    .select("question_id, answer_text, answer_choices")
    .eq("user_id", user.id);

  if (rErr)
    return NextResponse.json({ error: rErr.message }, { status: 500 });

  const validCount = (responses ?? []).filter((r) => {
    if (!ALLOWED_QUESTION_IDS.has(r.question_id)) return false;
    if (r.answer_text && r.answer_text.toString().trim().length > 0) return true;
    if (r.answer_choices && r.answer_choices.length > 0) return true;
    return false;
  }).length;

  if (validCount < TOTAL_QUESTIONS) {
    return NextResponse.json(
      {
        error: `Need all ${TOTAL_QUESTIONS} answers saved to regenerate. You have ${validCount}. Finish the quiz first.`,
      },
      { status: 400 },
    );
  }

  const { error: dossierErr } = await supabase
    .from("cognitive_dossiers")
    .delete()
    .eq("user_id", user.id);

  if (dossierErr)
    return NextResponse.json({ error: dossierErr.message }, { status: 500 });

  await supabase.from("cognitive_memory").delete().eq("user_id", user.id);

  const { error: profileErr } = await supabase
    .from("profiles")
    .update({
      onboarding_status: "analyzing",
      reconstruction_complete_at: null,
    })
    .eq("id", user.id);

  if (profileErr)
    return NextResponse.json({ error: profileErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

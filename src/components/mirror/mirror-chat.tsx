"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  initialConversationId?: string | null;
  initialMessages: ChatMessage[];
  displayName: string;
}

export function MirrorChat({
  initialConversationId,
  initialMessages,
  displayName,
}: Props) {
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async () => {
    const message = input.trim();
    if (!message || pending) return;

    setError(null);
    const tempUser: ChatMessage = {
      id: `tmp-${Date.now()}`,
      role: "user",
      content: message,
    };
    setMessages((m) => [...m, tempUser]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/mirror/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Mirror unavailable.");
      const newConversationId: string = data.conversationId;
      const assistant: string = data.assistant;
      const isNewConv = !conversationId;
      if (isNewConv) setConversationId(newConversationId);

      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: assistant,
        },
      ]);

      if (isNewConv) {
        router.replace(`/mirror/${newConversationId}`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Mirror unavailable.";
      setError(msg);
      setMessages((m) => m.filter((x) => x.id !== tempUser.id));
      setInput(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <header className="border-b border-line px-4 sm:px-8 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div className="flex items-center gap-3 text-[10px] tracking-[0.28em] uppercase text-bone/40 min-w-0">
          <span className="inline-flex items-center gap-2 shrink-0">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bone animate-pulse-slow" />
            Mirror
          </span>
          <span className="h-px w-6 bg-bone/20 shrink-0 hidden sm:block" />
          <span className="truncate">{displayName}</span>
        </div>
        {conversationId && (
          <span className="text-[10px] tracking-[0.24em] uppercase text-bone/30 shrink-0 hidden sm:inline">
            Session {conversationId.slice(0, 6)}
          </span>
        )}
      </header>

      <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
          {messages.length === 0 && !pending && (
            <div className="text-center py-12 sm:py-24">
              <h2 className="text-2xl sm:text-display-md font-light tracking-tight text-balance">
                Speak.
              </h2>
              <p className="mt-6 max-w-md mx-auto text-bone-muted leading-relaxed font-light">
                The mirror has your dossier. Start anywhere - a thought, a
                tension, a contradiction. It will read you against itself.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "flex flex-col gap-2",
                  m.role === "user" ? "items-end" : "items-start",
                )}
              >
                <span className="text-[10px] tracking-[0.32em] uppercase text-bone/30">
                  {m.role === "user" ? displayName : "Mirror"}
                </span>
                <div
                  className={cn(
                    "max-w-full md:max-w-[85%] text-[15px] leading-relaxed font-light",
                    m.role === "user"
                      ? "border border-line px-5 py-4 bg-ink-100/40 text-bone"
                      : "text-bone",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="prose-mirror">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {pending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-2 items-start"
            >
              <span className="text-[10px] tracking-[0.32em] uppercase text-bone/30">
                Mirror
              </span>
              <div className="text-[15px] font-light text-bone-muted">
                <span className="shimmer-text">
                  Reading you against the dossier...
                </span>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="border border-bone/20 bg-bone/5 px-4 py-3 text-[12px] text-bone/80 leading-relaxed">
              {error}
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-line bg-ink-0/70 backdrop-blur-xl shrink-0 pb-safe">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 py-4 sm:py-5">
          <Textarea
            ref={inputRef}
            placeholder="Type to the mirror..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.metaKey &&
                !e.ctrlKey
              ) {
                e.preventDefault();
                send();
              }
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            disabled={pending}
            className="text-[15px] leading-relaxed min-h-[56px] sm:min-h-[80px] font-light bg-transparent"
          />
          <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="hidden sm:inline text-[10px] tracking-[0.28em] uppercase text-bone/30">
              enter to send / shift+enter for newline
            </span>
            <Button
              size="md"
              onClick={send}
              disabled={pending || input.trim().length === 0}
              className="w-full sm:w-auto min-h-[48px]"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

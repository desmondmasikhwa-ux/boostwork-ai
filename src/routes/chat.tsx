import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SendHorizonal } from "lucide-react";
import { chatWithAssistant } from "@/lib/ai.functions";
import { Disclaimer, ErrorBlock, Panel, StatusBadge } from "@/components/tool-ui";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Copilot Chat — Motiondesk" },
      {
        name: "description",
        content: "Chat with your workplace copilot to draft, summarize, plan and research.",
      },
      { property: "og:title", content: "Copilot Chat — Motiondesk" },
      {
        property: "og:description",
        content: "Ask the workplace copilot anything about your day, drafts and priorities.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What should I prioritize today?",
  "Rewrite this update for an exec audience",
  "Turn these notes into action items",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const fn = useServerFn(chatWithAssistant);
  const mutation = useMutation({
    mutationFn: (history: Msg[]) => fn({ data: { messages: history } }),
    onSuccess: (reply) => setMessages((prev) => [...prev, { role: "assistant", content: reply }]),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
          Copilot Chat
        </span>
        <span className="text-xs text-mute">Ask anything about your work day</span>
      </div>

      <Panel
        title="Motiondesk Copilot"
        subtitle="Drafting · summarizing · prioritizing · research"
        badge={<StatusBadge label={mutation.isPending ? "THINKING" : "ONLINE"} />}
        className="min-h-[60vh]"
      >
        <div className="flex-1 space-y-3 overflow-y-auto">
          {messages.length === 0 && (
            <div className="border border-dashed border-line bg-ink p-6">
              <p className="text-sm text-mute">Start with one of these:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="-skew-x-6 border border-line px-3 py-1.5 text-xs text-mute transition-colors hover:border-volt/50 hover:text-foreground"
                  >
                    <span className="inline-block skew-x-6">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[80%] border border-brand/30 bg-brand/15 px-3 py-2 text-sm text-foreground">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="flex justify-start">
                <div className="ai-prose max-w-[85%] border border-line bg-ink px-3 py-2">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ),
          )}

          {mutation.isPending && (
            <div className="flex items-center gap-2 px-1 pt-1">
              <span className="size-2 -skew-x-12 animate-pulse bg-volt" />
              <span className="size-2 -skew-x-12 animate-pulse bg-volt [animation-delay:150ms]" />
              <span className="size-2 -skew-x-12 animate-pulse bg-volt [animation-delay:300ms]" />
              <span className="ml-1 text-[11px] uppercase tracking-widest text-mute">Thinking…</span>
            </div>
          )}

          {mutation.isError && <ErrorBlock message={(mutation.error as Error).message} />}
          <div ref={endRef} />
        </div>

        <form
          className="mt-4 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <div className="relative flex-1 overflow-hidden border border-line bg-ink">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              className="w-full bg-transparent px-4 py-2.5 text-sm placeholder:text-mute focus:outline-none"
            />
            {mutation.isPending && (
              <span className="sweep pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-volt/10 to-transparent" />
            )}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending || !input.trim()}
            className="font-display -skew-x-6 bg-volt px-4 py-2.5 text-xs font-bold text-ink disabled:opacity-60"
          >
            <span className="inline-flex skew-x-6 items-center gap-1.5">
              <SendHorizonal className="size-3.5" /> Send
            </span>
          </button>
        </form>
      </Panel>

      <Disclaimer />
    </div>
  );
}

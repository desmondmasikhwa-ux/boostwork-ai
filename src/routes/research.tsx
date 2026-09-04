import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { runResearch } from "@/lib/ai.functions";
import {
  ActionButton,
  AiOutput,
  ChipGroup,
  Disclaimer,
  EmptyState,
  ErrorBlock,
  Field,
  LoadingBlock,
  Panel,
  StatusBadge,
  inputClass,
} from "@/components/tool-ui";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Motiondesk" },
      {
        name: "description",
        content: "Get a decision-ready briefing with insights, risks and next steps on any topic.",
      },
      { property: "og:title", content: "AI Research Assistant — Motiondesk" },
      {
        property: "og:description",
        content: "Decision-ready briefings with insights, risks and recommended next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Brief", "Standard", "Deep"] as const;

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [depth, setDepth] = useState<string>("Standard");

  const fn = useServerFn(runResearch);
  const mutation = useMutation({
    mutationFn: (data: { topic: string; context: string; depth: string }) => fn({ data }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
          AI Research Assistant
        </span>
        <span className="text-xs text-mute">Insights · risks · next steps</span>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <Panel
          title="Research brief"
          subtitle="What do you need to understand?"
          badge={<StatusBadge label={mutation.isPending ? "WORKING" : "READY"} />}
          className="col-span-12 lg:col-span-5"
        >
          <div className="space-y-4">
            <Field label="Topic or question">
              <input
                className={inputClass}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Usage-based pricing for B2B SaaS"
              />
            </Field>
            <Field label="Context" hint="Optional — audience, market, constraints">
              <textarea
                rows={6}
                className={`${inputClass} resize-none`}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="We sell to mid-market ops teams and are considering a seat + usage hybrid."
              />
            </Field>
            <div>
              <span className="mb-1.5 block text-[10px] uppercase tracking-widest text-mute">
                Depth
              </span>
              <ChipGroup options={DEPTHS} value={depth} onChange={setDepth} accent="volt" />
            </div>
            <ActionButton
              loading={mutation.isPending}
              disabled={!topic.trim()}
              onClick={() => mutation.mutate({ topic, context, depth })}
            >
              RUN RESEARCH
            </ActionButton>
          </div>
        </Panel>

        <Panel
          title="Briefing"
          subtitle={`${depth} depth`}
          className="col-span-12 lg:col-span-7"
        >
          {mutation.isPending ? (
            <LoadingBlock label="Researching…" />
          ) : mutation.isError ? (
            <ErrorBlock message={(mutation.error as Error).message} />
          ) : mutation.data ? (
            <AiOutput label="Briefing ready" content={mutation.data} />
          ) : (
            <EmptyState text="Your research briefing will appear here." />
          )}
        </Panel>
      </div>

      <Disclaimer />
    </div>
  );
}

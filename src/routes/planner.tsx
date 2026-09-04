import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { planTasks } from "@/lib/ai.functions";
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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Motiondesk" },
      {
        name: "description",
        content: "Prioritize your task list and get a realistic hour-by-hour schedule.",
      },
      { property: "og:title", content: "AI Task Planner — Motiondesk" },
      {
        property: "og:description",
        content: "Prioritized tasks and a realistic schedule for your working day.",
      },
    ],
  }),
  component: PlannerPage,
});

const HOURS = ["4", "6", "8", "10"] as const;
const STYLES = ["Deep work first", "Balanced", "Meetings heavy"] as const;

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState<string>("8");
  const [focus, setFocus] = useState<string>("Balanced");

  const fn = useServerFn(planTasks);
  const mutation = useMutation({
    mutationFn: (data: { tasks: string; hours: string; focus: string }) => fn({ data }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
          AI Task Planner
        </span>
        <span className="text-xs text-mute">Auto-prioritized schedule</span>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <Panel
          title="Your task list"
          subtitle="One task per line — add deadlines if you have them"
          badge={<StatusBadge label={mutation.isPending ? "WORKING" : "READY"} />}
          className="col-span-12 lg:col-span-5"
        >
          <div className="space-y-4">
            <Field label="Tasks">
              <textarea
                rows={10}
                className={`${inputClass} resize-none`}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"Present renewal deck to Meridian (today 09:30)\nReview Q3 pipeline forecast\nSync with design on onboarding flow"}
              />
            </Field>
            <div>
              <span className="mb-1.5 block text-[10px] uppercase tracking-widest text-mute">
                Available hours
              </span>
              <ChipGroup options={HOURS} value={hours} onChange={setHours} accent="volt" />
            </div>
            <div>
              <span className="mb-1.5 block text-[10px] uppercase tracking-widest text-mute">
                Work style
              </span>
              <ChipGroup options={STYLES} value={focus} onChange={setFocus} />
            </div>
            <ActionButton
              loading={mutation.isPending}
              disabled={!tasks.trim()}
              onClick={() => mutation.mutate({ tasks, hours, focus })}
            >
              BUILD MY PLAN
            </ActionButton>
          </div>
        </Panel>

        <Panel
          title="Prioritized plan"
          subtitle={`${hours} hours · ${focus}`}
          className="col-span-12 lg:col-span-7"
        >
          {mutation.isPending ? (
            <LoadingBlock label="Prioritizing…" />
          ) : mutation.isError ? (
            <ErrorBlock message={(mutation.error as Error).message} />
          ) : mutation.data ? (
            <AiOutput label="Plan ready" content={mutation.data} />
          ) : (
            <EmptyState text="Your prioritized schedule will appear here." />
          )}
        </Panel>
      </div>

      <Disclaimer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { summarizeNotes } from "@/lib/ai.functions";
import {
  ActionButton,
  AiOutput,
  Disclaimer,
  EmptyState,
  ErrorBlock,
  Field,
  LoadingBlock,
  Panel,
  StatusBadge,
  inputClass,
} from "@/components/tool-ui";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Motiondesk" },
      {
        name: "description",
        content: "Turn messy meeting notes into key points, owners, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Motiondesk" },
      {
        property: "og:description",
        content: "Key points, action items and deadlines extracted from raw meeting notes.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [notes, setNotes] = useState("");

  const fn = useServerFn(summarizeNotes);
  const mutation = useMutation({
    mutationFn: (data: { notes: string; meetingTitle: string }) => fn({ data }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
          Meeting Notes Summarizer
        </span>
        <span className="text-xs text-mute">Key points · actions · deadlines</span>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <Panel
          title="Raw notes"
          subtitle="Paste your notes or transcript"
          badge={<StatusBadge label={mutation.isPending ? "WORKING" : "READY"} />}
          className="col-span-12 lg:col-span-5"
        >
          <div className="space-y-4">
            <Field label="Meeting">
              <input
                className={inputClass}
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Pricing sync — Tuesday"
              />
            </Field>
            <Field label="Notes / transcript">
              <textarea
                rows={12}
                className={`${inputClass} resize-none`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Maya: we agreed to ship the pricing page to 20% of traffic… legal needs to clear the copy by Friday…"
              />
            </Field>
            <ActionButton
              loading={mutation.isPending}
              disabled={!notes.trim()}
              onClick={() => mutation.mutate({ notes, meetingTitle })}
            >
              SUMMARIZE MEETING
            </ActionButton>
          </div>
        </Panel>

        <Panel
          title="Structured summary"
          subtitle="Decisions, owners and dates"
          className="col-span-12 lg:col-span-7"
        >
          {mutation.isPending ? (
            <LoadingBlock label="Summarizing…" />
          ) : mutation.isError ? (
            <ErrorBlock message={(mutation.error as Error).message} />
          ) : mutation.data ? (
            <AiOutput label="Summary ready" content={mutation.data} />
          ) : (
            <EmptyState text="Your meeting summary will appear here." />
          )}
        </Panel>
      </div>

      <Disclaimer />
    </div>
  );
}

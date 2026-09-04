import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { generateEmail } from "@/lib/ai.functions";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Motiondesk" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with tone and audience controls.",
      },
      { property: "og:title", content: "Smart Email Generator — Motiondesk" },
      {
        property: "og:description",
        content: "Draft professional workplace emails with tone and audience controls.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Assertive", "Warm", "Formal", "Concise"] as const;
const AUDIENCES = ["Client", "Team", "Exec", "Vendor"] as const;
const LENGTHS = ["Short", "Medium", "Detailed"] as const;

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<string>("Assertive");
  const [audience, setAudience] = useState<string>("Client");
  const [length, setLength] = useState<string>("Medium");

  const fn = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: (data: {
      purpose: string;
      recipient: string;
      tone: string;
      audience: string;
      length: string;
    }) => fn({ data }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
          Smart Email Generator
        </span>
        <span className="text-xs text-mute">Tone + audience structured prompt engine</span>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <Panel
          title="Compose brief"
          subtitle="Tell the copilot what the email must achieve"
          badge={<StatusBadge label={mutation.isPending ? "WORKING" : "READY"} />}
          className="col-span-12 lg:col-span-5"
        >
          <div className="space-y-4">
            <Field label="Recipient">
              <input
                className={inputClass}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Jordan at Meridian Co."
              />
            </Field>
            <Field label="Purpose & key points">
              <textarea
                rows={5}
                className={`${inputClass} resize-none`}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Confirm the Q3 renewal terms, flag the new reporting module, ask for sign-off by Thursday."
              />
            </Field>
            <div>
              <span className="mb-1.5 block text-[10px] uppercase tracking-widest text-mute">
                Tone
              </span>
              <ChipGroup options={TONES} value={tone} onChange={setTone} />
            </div>
            <div>
              <span className="mb-1.5 block text-[10px] uppercase tracking-widest text-mute">
                Audience
              </span>
              <ChipGroup options={AUDIENCES} value={audience} onChange={setAudience} accent="volt" />
            </div>
            <div>
              <span className="mb-1.5 block text-[10px] uppercase tracking-widest text-mute">
                Length
              </span>
              <ChipGroup options={LENGTHS} value={length} onChange={setLength} accent="volt" />
            </div>
            <ActionButton
              loading={mutation.isPending}
              disabled={!purpose.trim()}
              onClick={() => mutation.mutate({ purpose, recipient, tone, audience, length })}
            >
              GENERATE EMAIL
            </ActionButton>
          </div>
        </Panel>

        <Panel
          title="Drafted email"
          subtitle={`${tone} · ${audience} · ${length}`}
          className="col-span-12 lg:col-span-7"
        >
          {mutation.isPending ? (
            <LoadingBlock label="Drafting…" />
          ) : mutation.isError ? (
            <ErrorBlock message={(mutation.error as Error).message} />
          ) : mutation.data ? (
            <AiOutput label="Draft ready" content={mutation.data} />
          ) : (
            <EmptyState text="Your generated email will appear here." />
          )}
        </Panel>
      </div>

      <Disclaimer />
    </div>
  );
}

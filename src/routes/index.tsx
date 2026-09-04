import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, Telescope, MessagesSquare } from "lucide-react";
import { Disclaimer, Panel } from "@/components/tool-ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Motiondesk — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, prioritize tasks and research topics with one AI workspace built for professionals.",
      },
      { property: "og:title", content: "Motiondesk — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One AI workspace for drafting emails, summarizing meetings, planning tasks and research.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Tone + audience structured prompt engine",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Summarizer",
    desc: "Key points · actions · deadlines",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    desc: "Prioritization and realistic scheduling",
  },
  {
    to: "/research",
    icon: Telescope,
    title: "Research Assistant",
    desc: "Insights, risks and next steps",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "Copilot Chat",
    desc: "Ask anything about your work day",
  },
] as const;

function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
            Live Session
          </span>
          <h1 className="font-display mt-1 text-2xl font-extrabold leading-none -skew-x-6">
            <span className="inline-block skew-x-6">Your AI workplace</span>
          </h1>
        </div>
        <div className="flex -skew-x-6 gap-6">
          <div className="skew-x-6">
            <div className="text-[10px] uppercase tracking-wider text-mute">Tasks Done</div>
            <div className="font-black text-2xl leading-none text-volt">47</div>
          </div>
          <div className="skew-x-6">
            <div className="text-[10px] uppercase tracking-wider text-mute">Hours Saved</div>
            <div className="font-black text-2xl leading-none">12.5</div>
          </div>
          <div className="skew-x-6">
            <div className="text-[10px] uppercase tracking-wider text-mute">Focus</div>
            <div className="font-black text-2xl leading-none text-brand">92%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-4">
        {TOOLS.map((tool, i) => (
          <Link
            key={tool.to}
            to={tool.to}
            className={`group col-span-12 flex flex-col border border-line bg-ink2 p-5 transition-colors hover:border-volt/50 sm:col-span-6 ${
              i < 2 ? "lg:col-span-6" : "lg:col-span-4"
            }`}
          >
            <tool.icon className="size-5 text-brand" />
            <h2 className="font-display mt-4 -skew-x-6 text-lg font-extrabold leading-none">
              <span className="inline-block skew-x-6">{tool.title}</span>
            </h2>
            <p className="mt-1 text-xs text-mute">{tool.desc}</p>
            <span className="mt-6 text-[10px] font-bold uppercase tracking-widest text-volt opacity-0 transition-opacity group-hover:opacity-100">
              Open tool →
            </span>
          </Link>
        ))}
      </div>

      <Panel title="Today" subtitle="Auto-prioritized from your planner">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 border-l-2 border-brand bg-ink px-3 py-2.5">
            <span className="w-10 text-[10px] font-bold tracking-widest text-brand">P1</span>
            <span className="flex-1 text-sm text-foreground/90">
              Present renewal deck to Meridian
            </span>
            <span className="text-[11px] font-semibold text-volt">09:30</span>
          </div>
          <div className="flex items-center gap-3 border-l-2 border-volt bg-ink px-3 py-2.5">
            <span className="w-10 text-[10px] font-bold tracking-widest text-volt">P2</span>
            <span className="flex-1 text-sm text-foreground/90">Review Q3 pipeline forecast</span>
            <span className="text-[11px] font-semibold text-mute">11:00</span>
          </div>
          <div className="flex items-center gap-3 border-l-2 border-foreground/20 bg-ink px-3 py-2.5">
            <span className="w-10 text-[10px] font-bold tracking-widest text-mute">P3</span>
            <span className="flex-1 text-sm text-foreground/70">
              Sync with design on onboarding flow
            </span>
            <span className="text-[11px] font-semibold text-mute">14:00</span>
          </div>
        </div>
      </Panel>

      <Disclaimer />
    </div>
  );
}

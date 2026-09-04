import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Telescope,
  MessagesSquare,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Note Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research", icon: Telescope },
  { to: "/chat", label: "Copilot Chat", icon: MessagesSquare },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="space-y-1 text-sm">
      {NAV.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={
              active
                ? "flex items-center gap-3 border-l-2 border-brand bg-brand/10 px-3 py-2.5 font-semibold text-foreground"
                : "flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-mute transition-colors hover:text-foreground"
            }
          >
            <item.icon className={active ? "size-4 text-brand" : "size-4"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2.5 pb-6">
        <div className="font-black grid size-9 -skew-x-6 place-items-center bg-brand text-lg text-ink">
          M
        </div>
        <div className="-skew-x-6">
          <div className="font-black text-sm leading-none tracking-tight">
            MOTION<span className="text-brand">DESK</span>
          </div>
          <div className="text-[10px] tracking-[0.2em] text-mute">AI WORKSPACE</div>
        </div>
      </div>

      <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-mute">Studio</div>
      <NavList onNavigate={onNavigate} />

      <div className="mt-auto pt-6">
        <div className="border border-line bg-ink2 p-3">
          <div className="mb-2 flex justify-between text-[11px]">
            <span className="text-mute">AI CREDITS</span>
            <span className="font-bold text-volt">68 / 100</span>
          </div>
          <div className="h-1.5 overflow-hidden bg-foreground/10">
            <div className="h-full w-[68%] -skew-x-12 bg-volt" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-full bg-ink2 text-[11px] font-semibold text-mute outline-1 -outline-offset-1 outline-foreground/10">
            DO
          </div>
          <div className="text-xs leading-tight">
            <div className="font-semibold">Dana Okafor</div>
            <div className="text-mute">Growth Lead</div>
          </div>
        </div>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-ink font-sans text-foreground antialiased">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line p-5 lg:flex">
        <SidebarInner />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-ink/80"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col border-r border-line bg-ink p-5">
            <SidebarInner onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line px-4 py-4 md:px-6">
          <button
            aria-label="Open navigation"
            className="border border-line p-2 text-mute lg:hidden"
            onClick={() => setOpen(true)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <div className="relative max-w-md flex-1">
            <input
              placeholder="Ask the copilot to draft, plan, or summarize…"
              className="w-full border border-line bg-ink2 px-4 py-2.5 text-sm placeholder:text-mute focus:border-volt/60 focus:outline-none"
            />
          </div>
          <Link
            to="/planner"
            className="font-display hidden -skew-x-12 bg-volt px-4 py-2.5 text-xs font-bold tracking-wide text-ink hover:brightness-95 sm:block"
          >
            <span className="inline-block skew-x-12">+ NEW TASK</span>
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

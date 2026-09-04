import ReactMarkdown from "react-markdown";
import type { ReactNode } from "react";
import { AlertTriangle, Copy, RefreshCw } from "lucide-react";

export function Panel({
  title,
  subtitle,
  badge,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex flex-col border border-line bg-ink2 p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="-skew-x-6">
          <h2 className="font-display text-lg font-extrabold leading-none">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-mute">{subtitle}</p>}
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

export function StatusBadge({ label, tone = "volt" }: { label: string; tone?: "volt" | "mute" }) {
  return (
    <span
      className={`-skew-x-6 border px-2 py-1 text-[10px] font-bold tracking-widest ${
        tone === "volt" ? "border-volt/40 text-volt" : "border-line text-mute"
      }`}
    >
      <span className="inline-block skew-x-6">{label}</span>
    </span>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] uppercase tracking-widest text-mute">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-mute">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full border border-line bg-ink px-3 py-2.5 text-sm text-foreground placeholder:text-mute focus:border-volt/60 focus:outline-none";

export function ChipGroup({
  options,
  value,
  onChange,
  accent = "brand",
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  accent?: "brand" | "volt";
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`-skew-x-6 px-2.5 py-1 text-[11px] transition-colors ${
              active
                ? accent === "brand"
                  ? "bg-brand font-bold text-ink"
                  : "bg-volt font-bold text-ink"
                : "border border-line bg-foreground/5 text-mute hover:text-foreground"
            }`}
          >
            <span className="inline-block skew-x-6">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ActionButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="font-display w-full -skew-x-6 bg-volt py-2.5 text-xs font-bold tracking-wide text-ink transition-[filter] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="inline-flex skew-x-6 items-center justify-center gap-2">
        {loading && <RefreshCw className="size-3.5 animate-spin" />}
        {loading ? "GENERATING…" : children}
      </span>
    </button>
  );
}

export function LoadingBlock({ label = "Thinking…" }: { label?: string }) {
  return (
    <div className="border border-line bg-ink p-4">
      <div className="flex items-center gap-2">
        <span className="size-2 -skew-x-12 animate-pulse bg-volt" />
        <span className="size-2 -skew-x-12 animate-pulse bg-volt [animation-delay:150ms]" />
        <span className="size-2 -skew-x-12 animate-pulse bg-volt [animation-delay:300ms]" />
        <span className="ml-1 text-[11px] uppercase tracking-widest text-mute">{label}</span>
      </div>
      <div className="mt-4 space-y-2">
        {[100, 92, 78, 96, 64].map((w, i) => (
          <div
            key={i}
            className="h-2.5 animate-pulse bg-foreground/10"
            style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-line bg-ink p-6 text-center text-sm text-mute">
      {text}
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 border border-brand/40 bg-brand/10 p-4 text-sm">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-brand" />
      <p className="text-foreground/85">{message}</p>
    </div>
  );
}

export function AiOutput({ label, content }: { label: string; content: string }) {
  return (
    <div className="border border-line bg-ink p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="size-2 -skew-x-12 bg-volt" />
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(content)}
          className="ml-auto -skew-x-6 border border-line px-3 py-1 text-[11px] font-bold text-mute hover:text-foreground"
        >
          <span className="inline-flex skew-x-6 items-center gap-1.5">
            <Copy className="size-3" /> Copy
          </span>
        </button>
      </div>
      <div className="ai-prose">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <div className="flex items-center gap-3 border border-line bg-ink px-4 py-3">
      <span className="font-black grid size-6 -skew-x-6 place-items-center bg-brand/15 text-sm text-brand">
        !
      </span>
      <p className="text-xs text-mute">
        <span className="font-semibold text-foreground/80">
          AI-generated content may require human review.
        </span>{" "}
        Verify names, dates and figures before sending or publishing.
      </p>
    </div>
  );
}

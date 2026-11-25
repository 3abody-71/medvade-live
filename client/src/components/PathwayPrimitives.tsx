import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";

export function PathwayContents({
  ariaLabel,
  items,
}: {
  ariaLabel: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <nav className="mt-4 grid gap-2 text-sm" aria-label={ariaLabel}>
      {items.map(({ href, label }) => (
        <a
          key={href}
          href={`#${href}`}
          className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 font-bold hover:border-primary/40 hover:bg-secondary/50"
        >
          <span>{label}</span>
          <ArrowRight size={14} className="text-primary" />
        </a>
      ))}
    </nav>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
      ) : null}
    </div>
  );
}

export function IconBox({
  icon: Icon,
  className = "",
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary ${className}`}
    >
      <Icon size={19} />
    </div>
  );
}

export function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
    >
      {label} <ArrowUpRight size={13} />
    </a>
  );
}

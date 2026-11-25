import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  ExternalLink,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import {
  READINESS_STATUS_LABELS,
  readinessFactorsFor,
  readinessScore,
  type ReadinessFactor,
  type ReadinessStatus,
} from "../data/residencyReadiness";

function statusFor(
  profile: ReturnType<typeof useApp>["profile"],
  factor: ReadinessFactor
): ReadinessStatus {
  return profile.residencyEvidenceStatuses[factor.key] || "unknown";
}

export default function ResidencyReadiness() {
  const { profile, setProfile } = useApp();
  const factors = useMemo(() => readinessFactorsFor(profile), [profile]);
  const score = useMemo(
    () => readinessScore(profile, factors),
    [profile, factors]
  );

  if (!factors.length) return null;

  const updateAnswer = (factor: ReadinessFactor, value: string) => {
    setProfile(current => ({
      ...current,
      residencyEvidence: { ...current.residencyEvidence, [factor.key]: value },
      residencyEvidenceStatuses: {
        ...current.residencyEvidenceStatuses,
        [factor.key]:
          current.residencyEvidenceStatuses[factor.key] === "verified"
            ? "verified"
            : value.trim()
              ? "in-progress"
              : "unknown",
      },
    }));
  };

  const updateStatus = (factorKey: string, status: ReadinessStatus) => {
    setProfile(current => ({
      ...current,
      residencyEvidenceStatuses: {
        ...current.residencyEvidenceStatuses,
        [factorKey]: status,
      },
    }));
  };

  return (
    <section
      className="mt-6 border-t border-border pt-6"
      aria-labelledby="residency-readiness-heading"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="eyebrow">Residency readiness interview</div>
          <h3
            id="residency-readiness-heading"
            className="mt-2 text-xl font-extrabold tracking-tight"
          >
            Answer the questions that determine how prepared your application
            is.
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Tell us about your exams, research, electives, documents,
            experience, and programme fit. The index measures documented
            preparation for your selected country and cycle; it is not a match
            probability.
          </p>
        </div>
        <div className="flex min-w-[220px] items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-primary/20 border-t-primary text-lg font-extrabold text-primary">
            {score.percentage}%
          </div>
          <div>
            <p className="text-xs font-extrabold">Readiness index</p>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
              {score.verified} verified · {score.inProgress} in progress ·{" "}
              {score.total} checks
            </p>
            <p className="mt-1 text-[10px] font-bold text-primary">
              Not a guaranteed match score
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="rounded-lg border border-border bg-background/55 p-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Target cycle
          </span>
          <input
            value={profile.residencyCycle}
            onChange={event =>
              setProfile(current => ({
                ...current,
                residencyCycle: event.target.value,
              }))
            }
            placeholder="e.g. 2027"
            className="mt-2 h-9 w-full rounded-md border border-border bg-card px-2.5 text-xs outline-hidden focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
            aria-label="Target residency cycle"
          />
        </label>
        <div className="rounded-lg border border-border bg-background/55 p-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Official gates verified
          </span>
          <p className="mt-2 text-lg font-extrabold">
            {score.gatesMet}/{score.gatesTotal}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Gates cannot be replaced by research or electives.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background/55 p-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Competitive evidence
          </span>
          <p className="mt-2 text-lg font-extrabold">
            {score.competitiveDocumented}/{score.competitiveTotal}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Documented context for the named programme.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] leading-5 text-muted-foreground">
        <Info size={15} className="mt-0.5 shrink-0 text-amber-600" />
        <p>
          <strong className="text-foreground">
            How to read this percentage:
          </strong>{" "}
          verified checks count fully and in-progress checks count halfway. This
          is a transparent product-defined preparation measure, not an official
          weighting, national ranking, interview prediction, or probability of
          matching.
        </p>
      </div>

      {score.blockers.length > 0 && (
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <p className="flex items-center gap-2 text-xs font-extrabold text-destructive">
            <AlertTriangle size={14} /> Official checks needing attention
          </p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            {score.blockers.join(" · ")}. Add verified evidence only after
            checking the linked authority and exact programme requirements.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {factors.map(factor => {
          const status = statusFor(profile, factor);
          const answer = profile.residencyEvidence[factor.key] || "";
          return (
            <article
              key={factor.key}
              className={`rounded-xl border p-4 ${status === "verified" ? "border-primary/30 bg-primary/5" : "border-border bg-background/45"}`}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-extrabold">{factor.label}</h4>
                    <span
                      className={`career-requirement-badge ${factor.official ? "mandatory" : "optional"}`}
                    >
                      {factor.official
                        ? "Official gate"
                        : "Competitive context"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold leading-5 text-foreground">
                    {factor.question}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    {factor.evidenceGuide}
                  </p>
                </div>
                <div className="flex items-center gap-2 lg:shrink-0">
                  <label
                    className="sr-only"
                    htmlFor={`readiness-status-${factor.key}`}
                  >
                    Status for {factor.label}
                  </label>
                  <select
                    id={`readiness-status-${factor.key}`}
                    value={status}
                    onChange={event =>
                      updateStatus(
                        factor.key,
                        event.target.value as ReadinessStatus
                      )
                    }
                    className="h-8 rounded-md border border-border bg-card px-2 text-[10px] font-bold"
                  >
                    {Object.entries(READINESS_STATUS_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                  {status === "verified" ? (
                    <CheckCircle2 size={16} className="text-primary" />
                  ) : status === "unknown" ? (
                    <CircleHelp size={16} className="text-muted-foreground" />
                  ) : (
                    <ShieldCheck size={16} className="text-amber-600" />
                  )}
                </div>
              </div>
              <textarea
                value={answer}
                onChange={event => updateAnswer(factor, event.target.value)}
                placeholder={factor.placeholder}
                rows={2}
                className="mt-3 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs leading-5 outline-hidden focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                aria-label={`Answer for ${factor.label}`}
              />
              <a
                href={factor.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
              >
                {factor.sourceLabel} <ExternalLink size={11} />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

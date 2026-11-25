import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, CircleAlert, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { readinessFactorsFor, readinessScore, READINESS_STATUS_LABELS } from "../data/residencyReadiness";
import {
  COMPETITIVENESS_LABELS,
  ELIGIBILITY_STATUS_LABELS,
  competitivenessBand,
  competitivenessFactorsFor,
  eligibilityRequirementsFor,
  eligibilityResult,
  type EligibilityStatus,
} from "../data/phaseOneAssessments";

const eligibilityStatusOptions: EligibilityStatus[] = [
  "verified",
  "completed",
  "in-progress",
  "missing",
  "not-applicable",
  "needs-verification",
];

function statusTone(status: string) {
  if (status === "verified" || status === "completed") return "text-emerald-700 bg-emerald-500/10 border-emerald-500/20";
  if (status === "missing" || status === "not-met") return "text-destructive bg-destructive/5 border-destructive/20";
  return "text-amber-700 bg-amber-500/10 border-amber-500/20";
}

export default function CareerDashboard() {
  const { profile, setProfile } = useApp();
  const eligibility = eligibilityResult(profile);
  const requirements = eligibilityRequirementsFor(profile);
  const readinessFactors = readinessFactorsFor(profile);
  const readiness = readinessScore(profile, readinessFactors);
  const competitivenessFactors = competitivenessFactorsFor(profile);
  const competitiveness = competitivenessBand(competitivenessFactors);
  const country = profile.targetCountries[0] || "No destination selected";

  const updateEligibility = (key: string, status: EligibilityStatus) => {
    setProfile(current => ({
      ...current,
      eligibilityStatuses: { ...current.eligibilityStatuses, [key]: status },
    }));
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="eyebrow">Personal career roadmap</div>
        <h3 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Know your route before you invest in it.</h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Your destination, specialty, and saved evidence now produce three separate views. Eligibility answers “Can I apply?”, readiness answers “Am I prepared?”, and competitiveness describes “How strong is my profile?” They are not one combined score.
        </p>
      </header>

      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary">Current pathway</p>
            <h2 className="mt-1 text-xl font-black">{country} · {profile.targetSpecialty || "Specialty not selected"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{profile.residencyCycle ? `Application cycle: ${profile.residencyCycle}` : "Add an application cycle in your profile to make the plan more precise."}</p>
          </div>
          <Link to="/profile" className="btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-extrabold">Edit profile <ArrowRight size={14} /></Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3" aria-label="Independent pathway assessments">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">01 · Eligibility</p><h2 className="mt-2 text-xl font-black">Can I apply?</h2></div><ShieldCheck className="text-primary" size={21} /></div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Mandatory pathway requirements are tracked separately from preparation and profile strength.</p>
          <p className="mt-5 text-2xl font-black">{eligibility.status === "eligible" ? "Eligible" : eligibility.status === "not-yet-eligible" ? "Not yet eligible" : eligibility.status === "not-assessed" ? "Not assessed" : "Eligibility uncertain"}</p>
          <p className="mt-1 text-xs text-muted-foreground">{eligibility.verified}/{eligibility.totalApplicable} requirements verified · {eligibility.blockers.length} confirmed blocker{eligibility.blockers.length === 1 ? "" : "s"}</p>
          <Link to="#eligibility-details" className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline">Review requirements <ArrowRight size={13} /></Link>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">02 · Readiness</p><h2 className="mt-2 text-xl font-black">Am I prepared?</h2></div><CheckCircle2 className="text-primary" size={21} /></div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Preparation coverage reflects recorded evidence and in-progress tasks. It is not a match probability.</p>
          <p className="mt-5 text-2xl font-black">{readiness.percentage}%</p>
          <p className="mt-1 text-xs text-muted-foreground">{readiness.verified} verified · {readiness.inProgress} in progress · {readiness.total} applicable areas</p>
          <a href="#readiness-interview" className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline">Open readiness interview <ArrowRight size={13} /></a>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">03 · Competitiveness</p><h2 className="mt-2 text-xl font-black">How strong is my profile?</h2></div><Sparkles className="text-primary" size={21} /></div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Profile strength is specialty-aware and descriptive. No invented interview or match probability is shown.</p>
          <p className="mt-5 text-2xl font-black">{COMPETITIVENESS_LABELS[competitiveness]}</p>
          <p className="mt-1 text-xs text-muted-foreground">{competitivenessFactors.filter(item => item.signal !== "missing").length}/{competitivenessFactors.length} profile signals documented</p>
          <Link to="#competitiveness-details" className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline">Review profile strength <ArrowRight size={13} /></Link>
        </article>
      </section>

      <section id="eligibility-details" className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><div className="eyebrow">Eligibility checker</div><h2 className="mt-2 text-xl font-black">Mandatory requirements for {country}</h2></div><span className="text-xs text-muted-foreground">Unanswered items remain “Needs verification”</span></div>
        {!requirements.length ? <p className="mt-5 rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground">Select one of the six supported roadmap destinations in your profile to assess eligibility.</p> : <div className="mt-5 space-y-3">{requirements.map(item => { const status = profile.eligibilityStatuses[item.key] || "needs-verification"; return <div key={item.key} className="rounded-xl border border-border p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex items-center gap-2"><p className="text-sm font-extrabold">{item.label}</p>{item.mandatory && <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Mandatory</span>}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">{item.sourceLabel} <ExternalLink size={11} /></a></div><select value={status} onChange={event => updateEligibility(item.key, event.target.value as EligibilityStatus)} className={`h-10 shrink-0 rounded-lg border px-3 text-xs font-bold outline-hidden ${statusTone(status)}`} aria-label={`${item.label} status`}>{eligibilityStatusOptions.map(option => <option key={option} value={option}>{ELIGIBILITY_STATUS_LABELS[option]}</option>)}</select></div></div>; })}</div>}
      </section>

      <section id="competitiveness-details" className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-end justify-between gap-3"><div><div className="eyebrow">Profile strength</div><h2 className="mt-2 text-xl font-black">Specialty-aware competitiveness signals</h2></div><CircleAlert className="text-amber-600" size={21} /></div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">These signals describe what is documented in your profile. They are not historical benchmarks, acceptance probabilities, or guarantees. Add evidence in your profile to make the assessment more useful.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">{competitivenessFactors.map(item => <div key={item.key} className="rounded-xl border border-border p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-extrabold">{item.label}</p><span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${statusTone(item.signal === "missing" ? "missing" : "in-progress")}`}>{item.signal === "missing" ? "Needs evidence" : "Documented"}</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p></div>)}</div>
      </section>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-muted-foreground"><strong className="text-amber-800">Important:</strong> MedVade provides a preliminary planning assessment. Only the responsible licensing authority, immigration authority, or named training programme can make an official eligibility decision.</div>
    </div>
  );
}

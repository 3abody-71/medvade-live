import { ArrowRight, MapPinned, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { ROADMAP_COUNTRIES } from "../data/roadmapReadiness";

export default function CareerRoadmap() {
  const { isArabic, profile } = useApp();
  const latestSaved = Object.entries(profile.roadmapResults).sort(([, first], [, second]) => second.savedAt.localeCompare(first.savedAt))[0];
  const latestCountry = latestSaved ? ROADMAP_COUNTRIES.find(country => country.id === latestSaved[0]) : undefined;
  return (
    <section className="career-roadmap-shell rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7" aria-labelledby="roadmap-heading">
      <div className="career-roadmap-intro flex flex-col gap-4 rounded-xl border border-primary/15 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div className="career-roadmap-intro-number" aria-hidden="true">01</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-extrabold tracking-tight sm:text-xl">
              {isArabic ? "خريطة مسارك المهني الشخصية" : "Personal Career Roadmap"}
            </p>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
              {isArabic ? "الخطوة الأولى" : "First step"}
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {isArabic
              ? "ابدأ هنا لاختيار وجهتك وتخصصك ودورتك."
              : "Start here to choose your destination, specialty, and cycle."}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="roadmap-heading" className="mt-2 text-2xl font-extrabold tracking-tight">
            {isArabic ? "اختر الدولة وأجب عن متطلبات الإقامة خطوة بخطوة" : "Choose a country and answer its residency requirements step by step."}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {isArabic
              ? "تدخل إلى صفحة مستقلة، تختار الدولة والتخصص والدورة، ثم نطرح عليك أسئلة خاصة بالنظام المختار ونوضح ما الذي ينقصك."
              : "Open the dedicated roadmap page, choose your destination, specialty and cycle, then answer country-specific questions to see your preparation gaps."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5"><MapPinned size={13} /> {isArabic ? "6 دول" : "6 countries"}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5"><Stethoscope size={13} /> {isArabic ? "أسئلة خاصة بكل دولة" : "Country-specific questions"}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5"><ShieldCheck size={13} /> {isArabic ? "نسبة جاهزية وليست ضمان قبول" : "Preparation score, not a guarantee"}</span>
          </div>
          {latestSaved && latestCountry && (
            <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-[7px] border-primary/15 border-t-primary text-xl font-black text-primary" aria-label={`${latestSaved[1].percentage}% pathway progress`}>{latestSaved[1].percentage}%</div>
              <div>
                <p className="text-xs font-extrabold">{isArabic ? `تقدمك في مسار ${latestCountry.name}` : `${latestCountry.name} pathway progress`}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{latestSaved[1].gatesMet}/{latestSaved[1].gatesTotal} {isArabic ? "بوابات أهلية مكتملة" : "eligibility gates complete"}{latestSaved[1].specialty ? ` · ${latestSaved[1].specialty}` : ""}</p>
                <p className="mt-2 text-[10px] font-bold text-primary">{isArabic ? "آخر نتيجة محفوظة — افتح Roadmap لتحديثها" : "Saved result — open Roadmap to update it"}</p>
              </div>
            </div>
          )}
        </div>
        <Link to="/roadmap" className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold">
          {isArabic ? "افتح Roadmap" : "Open Career Roadmap"} <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

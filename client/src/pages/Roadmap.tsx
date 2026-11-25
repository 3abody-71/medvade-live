import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Download,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  Save,
  ShieldAlert,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  GRADUATION_STATUSES,
  type Profile,
  useApp,
} from "../contexts/AppContext";
import specialties from "../data/specialties.json";
import {
  answerKey,
  calculateRoadmap,
  questionScore,
  ROADMAP_COUNTRIES,
  type RoadmapCountry,
  type RoadmapQuestion,
} from "../data/roadmapReadiness";
import CareerDashboard from "./CareerDashboard";
import { assetPath } from "../lib/assetPath";
import { countryName, uiText } from "../lib/i18n";

const FLAG_IMAGES: Record<string, string> = {
  usa: "/assets/flags/roadmap/usa-flag.png",
  uk: "/assets/flags/roadmap/uk.png",
  australia: "/assets/flags/roadmap/australia.png",
  canada: "/assets/flags/roadmap/canada.png",
  germany: "/assets/flags/roadmap/germany.png",
  ireland: "/assets/flags/roadmap/ireland.png",
};

const CARD_REVIEW_DATE = "18 Nov 2026";

function CountryCard({
  country,
  profile,
  selected,
  onClick,
}: {
  country: RoadmapCountry;
  profile: Profile;
  selected: boolean;
  onClick: () => void;
}) {
  const gates = country.questions.filter(question => question.gate);
  const profileReady = Boolean(
    profile.nationality.trim() &&
      profile.currentCountry.trim() &&
      profile.graduationStatus &&
      profile.languageProficiency
  );
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl border p-5 transition ${selected ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40"}`}
    >
      <div className="flex items-center justify-between">
        <span className="block h-7 w-10 overflow-hidden rounded-md border border-border bg-secondary shadow-sm">
          <img
            src={assetPath(FLAG_IMAGES[country.id])}
            alt={`${country.name} national flag`}
            className="h-full w-full object-cover"
            onError={event => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement?.setAttribute("aria-label", `${country.name} flag`);
              event.currentTarget.parentElement?.insertAdjacentText("afterbegin", country.flag);
            }}
          />
        </span>
        {selected && <CheckCircle2 size={19} className="text-primary" />}
      </div>
      <h3 className="mt-3 text-lg font-extrabold">{country.name}</h3>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {country.summary}
      </p>
      <div className="mt-4 space-y-2 text-[11px] leading-5 text-muted-foreground">
        <p>
          <span className="font-extrabold text-foreground">
            Requirements assessed:
          </span>{" "}
          {country.questions.length}
        </p>
        <p>
          <span className="font-extrabold text-foreground">Entry gates:</span>{" "}
          {gates
            .slice(0, 3)
            .map(question => question.label)
            .join(" · ")}
        </p>
        <p>
          <span className="font-extrabold text-foreground">Complexity:</span>{" "}
          Not rated — no validated complexity scale is used.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-extrabold">
        <span
          className={`rounded-full border px-2 py-1 ${profileReady ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700" : "border-amber-500/20 bg-amber-500/10 text-amber-700"}`}
        >
          {profileReady
            ? "Initial profile ready"
            : "Needs initial verification"}
        </span>
        <span className="text-muted-foreground">
          Reviewed {CARD_REVIEW_DATE}
        </span>
      </div>
      <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
        Initial status is not an eligibility decision. Confirm the linked
        official rules for your exact profile.
      </p>
    </button>
  );
}

function QuestionCard({
  country,
  question,
  value,
  onChange,
}: {
  country: RoadmapCountry;
  question: RoadmapQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-extrabold">{question.label}</h3>
            <span
              className={`career-requirement-badge ${question.gate ? "mandatory" : "optional"}`}
            >
              {question.gate ? "Eligibility gate" : "Competitive factor"}
            </span>
          </div>
          <p className="mt-2 text-sm font-bold leading-6">{question.prompt}</p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
          Weight {question.weight}
        </span>
      </div>
      {question.type === "select" ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {question.choices?.map(choice => (
            <button
              key={choice.value}
              type="button"
              onClick={() => onChange(choice.value)}
              className={`rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${value === choice.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-background/40 hover:border-primary/40"}`}
            >
              {choice.label}
            </button>
          ))}
        </div>
      ) : (
        <input
          type="number"
          min={question.min}
          max={question.max}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={question.placeholder}
          className="mt-4 h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-hidden focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
        />
      )}
      <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
        {question.advice}
      </p>
      <a
        href={question.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
      >
        {question.sourceLabel} <ExternalLink size={11} />
      </a>
    </article>
  );
}

export default function Roadmap() {
  const { profile, setProfile, isArabic } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [countryId, setCountryId] = useState(
    profile.targetCountries[0] &&
      ROADMAP_COUNTRIES.some(
        country => country.id === profile.targetCountries[0]
      )
      ? profile.targetCountries[0]
      : ""
  );
  const [resultShown, setResultShown] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const country = ROADMAP_COUNTRIES.find(item => item.id === countryId);
  const answers = useMemo(() => {
    if (!country) return {};
    return Object.fromEntries(
      country.questions.map(question => [
        question.key,
        profile.residencyEvidence[answerKey(country.id, question.key)] || "",
      ])
    );
  }, [country, profile.residencyEvidence]);
  const result = country ? calculateRoadmap(country, answers) : null;
  const savedResult = country ? profile.roadmapResults[country.id] : undefined;
  const nextGap = result?.gaps[0];

  const exportRoadmap = async () => {
    if (!country || isExporting) return;
    setIsExporting(true);
    try {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      if (document.fonts?.ready) await document.fonts.ready;
      const finish = () => setIsExporting(false);
      window.addEventListener("afterprint", finish, { once: true });
      window.print();
      // Some embedded browsers do not dispatch afterprint when the dialog is dismissed.
      window.setTimeout(finish, 120_000);
    } catch {
      setIsExporting(false);
      window.alert(
        uiText(isArabic, "The roadmap could not be prepared for printing. Please try again.", "تعذر إعداد خريطة المسار للطباعة. يرجى المحاولة مرة أخرى.")
      );
    }
  };

  const exportAnswers = country?.questions.map(question => {
    const raw = answers[question.key] || "";
    const score = questionScore(question, raw);
    const displayAnswer = raw
      ? question.type === "number"
        ? raw
        : question.choices?.find(choice => choice.value === raw)?.label || raw
      : "";
    return {
      question,
      raw,
      displayAnswer,
      completed: score >= 0.99,
      inProgress: score > 0 && score < 0.99,
    };
  }) ?? [];
  const exportGaps = result?.gaps ?? [];
  const exportDate = new Intl.DateTimeFormat(isArabic ? "ar" : "en", {
    dateStyle: "long",
  }).format(new Date());

  const updateAnswer = (question: RoadmapQuestion, value: string) => {
    if (!country) return;
    setProfile(current => ({
      ...current,
      residencyEvidence: {
        ...current.residencyEvidence,
        [answerKey(country.id, question.key)]: value,
      },
      targetCountries: current.targetCountries.includes(country.id)
        ? current.targetCountries
        : [...current.targetCountries, country.id],
    }));
  };

  const reset = () => {
    if (!country) return;
    setProfile(current => {
      const next = { ...current.residencyEvidence };
      country.questions.forEach(
        question => delete next[answerKey(country.id, question.key)]
      );
      return { ...current, residencyEvidence: next };
    });
    setResultShown(false);
    setStep(1);
  };

  const saveResult = () => {
    if (!country || !result) return;
    setProfile(current => ({
      ...current,
      roadmapResults: {
        ...current.roadmapResults,
        [country.id]: {
          percentage: result.percentage,
          gatesMet: result.gatesMet,
          gatesTotal: result.gatesTotal,
          specialty: current.targetSpecialty,
          cycle: current.residencyCycle,
          savedAt: new Date().toISOString(),
        },
      },
    }));
    navigate("/");
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Personal Career Roadmap</div>
          <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
            Build Your Medical Career Roadmap
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Choose your destination and specialty. We’ll map the requirements,
            identify your gaps, and build your personalized preparation plan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {country && (
            <button
              type="button"
              onClick={() => void exportRoadmap()}
              disabled={isExporting}
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-extrabold disabled:cursor-wait disabled:opacity-70"
              aria-live="polite"
            >
              {isExporting ? <LoaderCircle size={14} className="animate-spin" /> : <Download size={14} />}
              {isExporting
                ? uiText(isArabic, "Preparing PDF…", "جارٍ إعداد ملف PDF…")
                : uiText(isArabic, "Export PDF", "تصدير PDF")}
            </button>
          )}
          <Link
            to="/"
            className="btn-quiet inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
          >
            <ArrowLeft size={14} /> {uiText(isArabic, "Back home", "العودة للرئيسية")}
          </Link>
        </div>
      </div>

      {country && (
        <article
          id="roadmap-export"
          className="roadmap-export-document"
          dir={isArabic ? "rtl" : "ltr"}
          lang={isArabic ? "ar" : "en"}
        >
          <header className="export-brand">
            <div className="export-wordmark"><span className="export-mark">M</span> MedVade</div>
            <div className="export-date">{uiText(isArabic, "Exported", "تاريخ التصدير")}: {exportDate}</div>
          </header>
          <h1>{uiText(isArabic, "Personal Career Roadmap", "خريطة المسار المهني الشخصية")}</h1>
          <p className="export-subtitle">{uiText(isArabic, "A personalized overview of your selected destination, assessment answers, and next steps.", "ملخص مخصص لوجهتك المختارة وإجابات التقييم والخطوات التالية.")}</p>

          <section className="export-summary">
            <h2>{uiText(isArabic, "Your pathway", "مسارك المهني")}</h2>
            <dl>
              <div><dt>{uiText(isArabic, "Destination", "الوجهة")}</dt><dd>{countryName(country.id, country.name, isArabic)}</dd></div>
              {profile.targetSpecialty.trim() && <div><dt>{uiText(isArabic, "Specialty", "التخصص")}</dt><dd>{profile.targetSpecialty}</dd></div>}
              {profile.graduationStatus && <div><dt>{uiText(isArabic, "Current career stage", "المرحلة المهنية الحالية")}</dt><dd>{profile.graduationStatus}</dd></div>}
              {profile.residencyCycle.trim() && <div><dt>{uiText(isArabic, "Target cycle", "دورة التقديم المستهدفة")}</dt><dd>{profile.residencyCycle}</dd></div>}
              {result && <div><dt>{uiText(isArabic, "Preparation score", "نتيجة الاستعداد")}</dt><dd>{result.percentage}% · {result.gatesMet}/{result.gatesTotal} {uiText(isArabic, "eligibility gates met", "بوابات أهلية مستوفاة")}</dd></div>}
            </dl>
          </section>

          <section className="export-section">
            <h2>{uiText(isArabic, "Assessment steps", "خطوات التقييم")}</h2>
            <ol className="export-steps">
              {exportAnswers.map(({ question, displayAnswer, completed, inProgress }) => (
                <li key={question.key} className="export-step">
                  <div className="export-step-heading">
                    <strong>{question.label}</strong>
                    <span className={`export-status ${completed ? "done" : inProgress ? "progress" : "todo"}`}>
                      {completed
                        ? uiText(isArabic, "Completed", "مكتمل")
                        : inProgress
                          ? uiText(isArabic, "In progress", "قيد الإنجاز")
                          : uiText(isArabic, "Incomplete", "غير مكتمل")}
                    </span>
                  </div>
                  {displayAnswer && <p><b>{uiText(isArabic, "Your answer", "إجابتك")}:</b> {displayAnswer}</p>}
                  {question.advice && !completed && <p className="export-advice">{question.advice}</p>}
                </li>
              ))}
            </ol>
          </section>

          {exportGaps.length > 0 && (
            <section className="export-section">
              <h2>{uiText(isArabic, "Recommended next actions", "الخطوات التالية المقترحة")}</h2>
              <ol className="export-recommendations">
                {exportGaps.map(gap => (
                  <li key={gap.question.key}>
                    <strong>{gap.question.label}: </strong>
                    {gap.question.type === "number"
                      ? `${uiText(isArabic, "Reach", "الوصول إلى")} ${gap.target}`
                      : `${uiText(isArabic, "Target", "الهدف")}: ${gap.target}`}
                    {gap.question.advice && <p>{gap.question.advice}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}
          {exportGaps.length === 0 && result && (
            <section className="export-section">
              <h2>{uiText(isArabic, "Recommended next action", "الخطوة التالية المقترحة")}</h2>
              <p>{uiText(isArabic, "Verify the requirements with your named target programme before relying on this result.", "تحقق من المتطلبات لدى البرنامج المستهدف قبل الاعتماد على هذه النتيجة.")}</p>
            </section>
          )}
          <footer className="export-footer">MedVade · {uiText(isArabic, "Personal Career Roadmap", "خريطة المسار المهني الشخصية")}</footer>
        </article>
      )}

      <div className="mt-8 grid gap-2 sm:grid-cols-3">
        {["Build your profile", "Complete assessment", "Review your plan"].map(
          (label, index) => (
            <div
              key={label}
              className={`rounded-xl border px-4 py-3 text-xs font-extrabold ${step === index ? "border-primary bg-primary/10 text-primary" : step > index ? "border-primary/20 bg-primary/5" : "border-border bg-card text-muted-foreground"}`}
            >
              <span className="mr-2">{index + 1}</span>
              {label}
            </div>
          )
        )}
      </div>

      {step === 0 && (
        <section className="mt-8" aria-labelledby="country-choice-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                id="country-choice-heading"
                className="text-xl font-extrabold"
              >
                Start with your destination and career profile.
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your specialty and current stage determine which preparation
                steps matter now and which can wait.
              </p>
            </div>
            <Target className="hidden text-primary sm:block" />
          </div>
          <div className="mt-5 grid gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:grid-cols-3">
            <label className="rounded-xl border border-border bg-card p-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Destination country
              </span>
              <p className="mt-2 text-xs font-bold">
                {country?.name || "Choose a country below"}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Country-specific licensing and entry rules
              </p>
            </label>
            <label className="rounded-xl border border-border bg-card p-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Medical specialty
              </span>
              <input
                list="specialty-options"
                value={profile.targetSpecialty}
                onChange={event =>
                  setProfile(current => ({
                    ...current,
                    targetSpecialty: event.target.value,
                  }))
                }
                placeholder="e.g. Internal Medicine"
                className="mt-2 h-9 w-full rounded-lg border border-border bg-background/50 px-2.5 text-xs outline-hidden focus:border-primary/50"
              />
              <datalist id="specialty-options">
                {specialties.map(specialty => (
                  <option key={specialty.id} value={specialty.name} />
                ))}
              </datalist>
            </label>
            <label className="rounded-xl border border-border bg-card p-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Current academic / professional stage
              </span>
              <select
                value={profile.graduationStatus}
                onChange={event =>
                  setProfile(current => ({
                    ...current,
                    graduationStatus: event.target.value,
                  }))
                }
                className="mt-2 h-9 w-full rounded-lg border border-border bg-background/50 px-2.5 text-xs outline-hidden focus:border-primary/50"
              >
                <option value="">Select your current stage</option>
                {GRADUATION_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROADMAP_COUNTRIES.map(item => (
              <CountryCard
                key={item.id}
                country={item}
                profile={profile}
                selected={countryId === item.id}
                onClick={() => {
                  setCountryId(item.id);
                  setResultShown(false);
                }}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={
                !country ||
                !profile.targetSpecialty.trim() ||
                !profile.graduationStatus
              }
              onClick={() => setStep(1)}
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-xs font-extrabold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to assessment <ArrowRight size={14} />
            </button>
          </div>
        </section>
      )}

      {step === 1 && country && !resultShown && (
        <section
          id="readiness-interview"
          className="mt-8"
          aria-labelledby="requirements-heading"
        >
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
              {country.name} readiness interview
            </p>
            <h2 id="requirements-heading" className="mt-2 text-2xl font-black">
              Answer every requirement for this pathway.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Start with your target specialty and cycle, then answer the
              official eligibility gates and the competitive factors. Your
              answers save automatically on this device.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="rounded-xl border border-border bg-card p-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Target specialty
                </span>
                <input
                  value={profile.targetSpecialty}
                  onChange={event =>
                    setProfile(current => ({
                      ...current,
                      targetSpecialty: event.target.value,
                    }))
                  }
                  placeholder="e.g. Internal Medicine"
                  className="mt-2 h-10 w-full rounded-lg border border-border bg-background/50 px-3 text-xs outline-hidden focus:border-primary/50"
                />
              </label>
              <label className="rounded-xl border border-border bg-card p-3">
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
                  className="mt-2 h-10 w-full rounded-lg border border-border bg-background/50 px-3 text-xs outline-hidden focus:border-primary/50"
                />
              </label>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {country.questions.map(question => (
              <QuestionCard
                key={question.key}
                country={country}
                question={question}
                value={answers[question.key]}
                onChange={value => updateAnswer(question, value)}
              />
            ))}
          </div>
          <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap justify-between gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="btn-quiet inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold"
            >
              <ArrowLeft size={14} /> Change country
            </button>
            <button
              type="button"
              onClick={() => {
                setResultShown(true);
                setStep(2);
              }}
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-extrabold"
            >
              Calculate my readiness <ArrowRight size={14} />
            </button>
          </div>
        </section>
      )}

      {step === 2 && country && resultShown && result && (
        <section className="mt-8" aria-labelledby="result-heading">
          <div className="mb-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="eyebrow">Your Medical Career Roadmap</div>
                <h2 className="mt-2 text-2xl font-black">
                  {country.name} <span className="text-primary">→</span>{" "}
                  {profile.targetSpecialty || "Specialty not selected"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {profile.graduationStatus || "Current stage not selected"}
                  {profile.residencyCycle
                    ? ` · Target cycle ${profile.residencyCycle}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setResultShown(false);
                }}
                className="btn-quiet inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
              >
                Edit profile <ArrowRight size={13} />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-secondary/45 p-3">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Assessment progress
                </p>
                <p className="mt-1 text-xl font-black text-primary">
                  {result.percentage}%
                </p>
              </div>
              <div className="rounded-xl bg-secondary/45 p-3">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Eligibility checks
                </p>
                <p className="mt-1 text-xl font-black">
                  {result.gatesMet}/{result.gatesTotal}
                </p>
              </div>
              <div className="rounded-xl bg-primary/5 p-3">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  Next action
                </p>
                <p className="mt-1 text-xs font-black">
                  {nextGap
                    ? nextGap.question.label
                    : "Verify your target programme"}
                </p>
              </div>
            </div>
            {nextGap && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    Your next action
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {nextGap.question.type === "number"
                      ? `Reach ${nextGap.target} for ${nextGap.question.label}`
                      : `${nextGap.question.label}: ${nextGap.target}`}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    This is the largest current score gap. Fixing it could raise
                    the estimated result to {nextGap.projectedPercentage}%.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResultShown(false);
                    setStep(1);
                  }}
                  className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-extrabold"
                >
                  Continue assessment <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
          <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
                {country.name} preparation result
              </p>
              <h2 id="result-heading" className="mt-2 text-2xl font-black">
                You are {result.percentage}% prepared.
              </h2>
              <div className="mt-6 grid place-items-center">
                <div className="grid h-40 w-40 place-items-center rounded-full border-[14px] border-primary/15 border-t-primary text-4xl font-black text-primary">
                  {result.percentage}%
                </div>
              </div>
              <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
                {result.gatesMet}/{result.gatesTotal} official eligibility gates
                currently meet the calculator benchmark.
              </p>
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] leading-5 text-muted-foreground">
                <ShieldAlert
                  size={16}
                  className="mt-0.5 shrink-0 text-amber-600"
                />
                <span>
                  This is a product-defined preparation coverage score, not the
                  official probability of getting a residency place. No
                  universal country-wide formula converts exams, research or
                  electives into match odds.
                </span>
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-extrabold">
                  <LockKeyhole size={16} className="text-destructive" /> Biggest
                  eligibility gaps
                </h3>
                <div className="mt-3 space-y-3">
                  {result.blockers.length ? (
                    result.blockers.map(question => (
                      <div
                        key={question.key}
                        className="rounded-xl border border-destructive/15 bg-destructive/5 p-3"
                      >
                        <p className="text-xs font-extrabold">
                          {question.label}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                          {question.advice}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No major gate is currently below the benchmark. Verify the
                      named program before relying on the result.
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-extrabold">
                      <TrendingUp size={16} className="text-primary" /> Why is
                      my percentage low?
                    </h3>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                      These are the points currently missing from your result,
                      ranked by impact. Fixing one item shows the estimated
                      score you could reach.
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-extrabold text-muted-foreground">
                    {result.gaps.length} gaps
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {result.gaps.length ? (
                    result.gaps.map(gap => (
                      <div
                        key={gap.question.key}
                        className="rounded-xl border border-border bg-background/45 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-extrabold">
                              {gap.question.label}
                            </p>
                            <p className="mt-1 text-[11px] font-bold text-destructive">
                              Missing {gap.lostPercentagePoints} percentage
                              points
                            </p>
                          </div>
                          <span className="rounded-full bg-destructive/5 px-2 py-1 text-[10px] font-extrabold text-destructive">
                            {gap.question.gate
                              ? "Eligibility gate"
                              : "Profile factor"}
                          </span>
                        </div>
                        <div className="mt-3 grid gap-2 text-[11px] sm:grid-cols-2">
                          <div className="rounded-lg bg-secondary/55 p-3">
                            <p className="font-extrabold text-muted-foreground">
                              Your current input
                            </p>
                            <p className="mt-1 font-bold">
                              {gap.rawValue
                                ? gap.question.type === "number"
                                  ? gap.rawValue
                                  : gap.question.choices?.find(
                                      choice => choice.value === gap.rawValue
                                    )?.label || gap.rawValue
                                : "Not answered"}
                            </p>
                          </div>
                          <div className="rounded-lg border border-primary/15 bg-primary/5 p-3">
                            <p className="font-extrabold text-primary">
                              To get full points
                            </p>
                            <p className="mt-1 font-bold">
                              {gap.question.type === "number"
                                ? `Reach ${gap.target}`
                                : `Choose “${gap.target}”`}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                          {gap.question.advice}
                        </p>
                        <p className="mt-2 text-[11px] font-extrabold text-primary">
                          Estimated result after fixing:{" "}
                          {gap.projectedPercentage}%
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Nothing is currently reducing the calculator score. Keep
                      verifying the named program requirements.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={saveResult}
                  className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-extrabold"
                >
                  <Save size={14} />{" "}
                  {savedResult?.percentage === result.percentage
                    ? "Update saved result"
                    : "Save result"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResultShown(false);
                    setStep(1);
                  }}
                  className="btn-quiet inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold"
                >
                  <ArrowLeft size={14} /> Edit answers
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="btn-quiet inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold"
                >
                  <RotateCcw size={14} /> Start again
                </button>
                <a
                  href={country.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-quiet inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold"
                >
                  Official rules <ExternalLink size={13} />
                </a>
                {savedNotice && (
                  <span className="text-xs font-bold text-primary">
                    Saved. It will appear on Home.
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        id="career-dashboard"
        className="mt-12 border-t border-border pt-10"
        aria-labelledby="career-dashboard-heading"
      >
        <div className="mb-6">
          <div className="eyebrow">Complete pathway workspace</div>
          <h2
            id="career-dashboard-heading"
            className="mt-2 text-2xl font-black tracking-tight"
          >
            Eligibility, readiness, and competitiveness in one roadmap
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Keep your country questions, pathway requirements, profile strength,
            official references, and preparation status together. These
            assessments remain independent and are never combined into one
            score.
          </p>
        </div>
        <CareerDashboard />
      </section>
    </main>
  );
}

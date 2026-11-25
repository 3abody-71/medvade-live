import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BriefcaseMedical,
  Building2,
  CheckCircle2,
  Clock3,
  Globe2,
  HeartPulse,
  Languages,
  LockKeyhole,
  PoundSterling,
  Trophy,
} from "lucide-react";
import {
  competitive,
  examDetails,
  friendly,
  hospitals,
  passportSteps,
  reasons,
  requirements,
  salaries,
  stages,
  ukPageContents,
} from "../data/ukPathway";
import {
  IconBox,
  PathwayContents,
  SectionHeading,
  SourceLink,
} from "./PathwayPrimitives";
import { assetPath } from "../lib/assetPath";

function UkPathway() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[350px] overflow-hidden bg-[#1b2a3c]">
            <img
              src={assetPath("/assets/uk/uk-hero.jpg")}
              alt="United Kingdom pathway"
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#111d2d]/95 via-[#203c58]/45 to-[#9c303e]/35" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/75">
                United Kingdom guide for IMGs
              </div>
              <h2 className="mt-2 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                A practical route into NHS medicine and specialty training.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">
                GMC registration, PLAB, MRCP, NHS jobs, salaries, work-life
                balance, immigration, specialties, and nine major hospitals.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="eyebrow">Guide / contents</div>
            <h2 className="mt-2 text-xl font-extrabold">
              What is on this page?
            </h2>
            <PathwayContents
              ariaLabel="UK guide contents"
              items={ukPageContents}
            />
          </div>
        </div>
        <div className="grid gap-4 border-t border-border bg-secondary/30 p-4 sm:grid-cols-[1fr_1.25fr] sm:p-5">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <img
              src={assetPath("/assets/uk/uk-reaction-london.jpg")}
              alt="London skyline with the Palace of Westminster, London Eye, and River Thames"
              className="h-40 w-full object-cover"
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="eyebrow">The honest version</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The UK can feel more straightforward than the USA or Canada
              because the registration route is nationally coordinated. It still
              involves exams, paperwork, competition, and persistence. In other
              words: bring your passport, your portfolio, and a respectable
              amount of tea.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-secondary px-3 py-1.5">GMC</span>
              <span className="rounded-full bg-secondary px-3 py-1.5">
                PLAB 1 + 2
              </span>
              <span className="rounded-full bg-secondary px-3 py-1.5">
                NHS jobs
              </span>
              <span className="rounded-full bg-secondary px-3 py-1.5">
                Oriel
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="why-uk">
        <SectionHeading
          eyebrow="01 / Why choose the UK?"
          title="Four reasons IMGs seriously consider Britain"
          body="The UK is not an effortless destination, but it offers a clearly signposted professional route and a large health service that employs doctors from around the world."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <article
              key={reason.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <IconBox icon={reason.icon} />
              <div className="mt-4 text-xs font-bold text-primary">
                0{index + 1}
              </div>
              <h3 className="mt-1 text-base font-extrabold leading-5">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {reason.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="requirements-uk">
        <SectionHeading
          eyebrow="02 / IMG requirements"
          title="What you normally need before applying"
          body="The GMC decides the registration route. Treat the list below as a planning map and confirm every document, score, and deadline against the current official guidance."
        />
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {requirements.map(group => (
            <article
              key={group.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <IconBox
                  icon={
                    group.title === "English evidence" ? Languages : BadgeCheck
                  }
                />
                <div>
                  <h3 className="text-lg font-extrabold">{group.title}</h3>
                  <div className="mt-4 space-y-3">
                    {group.items.map(item => (
                      <div
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-6"
                      >
                        <CheckCircle2
                          size={15}
                          className="mt-1 shrink-0 text-primary"
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-warning-border bg-warning-surface p-6">
          <div className="flex items-start gap-3">
            <LockKeyhole size={18} className="mt-0.5 shrink-0 text-warning-foreground" />
            <p className="text-sm leading-6 text-muted-foreground">
              <strong className="text-foreground">Important:</strong> passing
              PLAB does not itself guarantee a job, a training number, or a
              visa. GMC registration, right to work, and employment are
              connected but separate decisions.
            </p>
          </div>
        </div>
      </section>

      <section id="pathway-uk">
        <SectionHeading
          eyebrow="03 / Exams and pathway"
          title="PLAB first, then build your NHS career"
          body="For many IMGs, PLAB is the most direct registration route. MRCP and other Royal College qualifications are postgraduate credentials that can strengthen specialty applications and may support a different GMC registration route when the qualification and all other criteria are acceptable."
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.82fr]">
          <div className="space-y-4">
            {stages.map(([number, title, body]) => (
              <article
                key={number}
                className="route-step rounded-2xl border border-border bg-card p-5 pl-14 shadow-sm sm:p-6 sm:pl-16"
              >
                <span className="step-dot !top-6 !left-5">{number}</span>
                <h3 className="text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-2xl border border-border bg-[#123f52] p-6 text-white shadow-lg lg:sticky lg:top-24">
            <div className="eyebrow !text-[#8bd3dc]">Exam decision</div>
            <h3 className="mt-2 text-xl font-extrabold">PLAB or MRCP?</h3>
            <p className="mt-3 text-sm leading-6 text-white/75">
              PLAB is usually the quicker route to GMC registration and an NHS
              service job. MRCP is a demanding physician qualification with
              written and clinical components; it is valuable for medical
              specialties but is not a substitute for checking the GMC’s exact
              registration rules.
            </p>
            <div className="mt-5 space-y-3 text-xs leading-5 text-white/90">
              <div>
                <span className="font-bold text-[#8bd3dc]">PLAB:</span>{" "}
                registration-focused, broad clinical knowledge, practical
                communication.
              </div>
              <div>
                <span className="font-bold text-[#8bd3dc]">MRCP (UK):</span>{" "}
                postgraduate physician credential, useful for internal medicine
                progression.
              </div>
              <div>
                <span className="font-bold text-[#8bd3dc]">
                  Common strategy:
                </span>{" "}
                PLAB → NHS job → MRCP while working, if medicine is your
                intended specialty.
              </div>
            </div>
          </aside>
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="eyebrow">Exam detail / content and locations</div>
              <h3 className="mt-1 text-xl font-extrabold">
                What do PLAB and MRCP actually test?
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                “MRC” is often used informally to mean MRCP (UK). PLAB is the
                common IMG licensing assessment; MRCP (UK) is a postgraduate
                physician examination made up of Part 1, Part 2 Written, and
                PACES. They are different exams with different purposes.
              </p>
            </div>
            <BookOpen
              className="hidden shrink-0 text-primary sm:block"
              size={22}
            />
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {examDetails.map(exam => (
              <article
                key={exam.name}
                className="rounded-xl border border-border bg-secondary/30 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="text-base font-extrabold">{exam.name}</h4>
                  <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-bold text-primary">
                    {exam.label}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6">
                  {exam.format}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {exam.content}
                </p>
                <div className="mt-3 rounded-lg border border-primary/15 bg-background/70 p-3 text-xs leading-5 text-muted-foreground">
                  <span className="font-bold text-foreground">Where:</span>{" "}
                  {exam.locations}
                </div>
                <a
                  href={exam.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  Official exam guidance <ArrowUpRight size={13} />
                </a>
              </article>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
            <SourceLink
              label="GMC PLAB guide"
              url="https://www.gmc-uk.org/registration-and-licensing/join-our-registers/plab/a-guide-to-the-plab-test"
            />
            <SourceLink
              label="MRCP written centres"
              url="https://www.thefederation.uk/examinations/part-1/uk-and-international-centres"
            />
            <SourceLink
              label="MRCP PACES centres"
              url="https://www.thefederation.uk/examinations/paces/centre-locations"
            />
          </div>
        </div>
      </section>

      <section id="life-uk">
        <SectionHeading
          eyebrow="04 / Money and lifestyle"
          title="Salary, work-life balance, and the passport question"
          body="The figures below are England basic salary ranges published for 2026. Scotland, Wales, and Northern Ireland use their own contracts and the total package changes with rota supplements, nights, weekends, location, and role."
        />
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
            {salaries.map(([role, pay, note]) => (
              <div key={role} className="p-5">
                <PoundSterling size={18} className="text-primary" />
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {role}
                </p>
                <p className="mt-1 text-xl font-extrabold">{pay}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-6">
            <HeartPulse className="text-primary" size={20} />
            <h3 className="mt-3 text-lg font-extrabold">Work-life balance</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The NHS offers structured annual leave, pension access, study
              leave, and defined rotas. Reality varies by specialty and rota:
              emergency medicine, surgery, and understaffed departments can be
              intense, while psychiatry, pathology, and some outpatient roles
              may offer more predictable patterns.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6">
            <Globe2 className="text-primary" size={20} />
            <h3 className="mt-3 text-lg font-extrabold">
              Settlement and passport
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A medical job does not automatically grant British citizenship.
              Many doctors first use a work visa, later seek
              settlement/indefinite leave when eligible, and then apply for
              naturalisation if they meet residence, absence, character,
              language, and other legal requirements. Citizenship and a British
              passport are separate applications.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6">
            <Clock3 className="text-primary" size={20} />
            <h3 className="mt-3 text-lg font-extrabold">Time horizon</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The registration phase can be relatively quick, but specialty
              progression takes years. A realistic plan separates “getting
              licensed and employed” from “winning a training post” and from
              “qualifying as a consultant or GP.”
            </p>
          </article>
        </div>
        <div className="mt-7 rounded-2xl border border-info-border bg-info-surface p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <Globe2 className="mt-0.5 shrink-0 text-primary" size={20} />
            <div>
              <div className="eyebrow">
                Passport roadmap / general orientation
              </div>
              <h3 className="mt-1 text-xl font-extrabold">
                How long can an IMG expect to wait for a British passport?
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                For a doctor starting from overseas, a realistic minimum is
                often about six years before citizenship eligibility on the
                standard route: roughly five years of qualifying UK residence,
                then usually 12 months with ILR or settled status. This is a
                planning estimate, not a promise. Visa changes, gaps in
                residence, absences, processing time, and personal circumstances
                can make it longer.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {passportSteps.map(([title, body], index) => (
              <div
                key={title}
                className="relative rounded-xl border border-info-border bg-card/80 p-4"
              >
                <div className="text-xs font-extrabold text-primary">
                  0{index + 1}
                </div>
                <h4 className="mt-2 text-sm font-extrabold leading-5">
                  {title}
                </h4>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-info-border pt-4">
            <SourceLink
              label="Citizenship with ILR"
              url="https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain"
            />
            <SourceLink
              label="First adult passport"
              url="https://www.gov.uk/apply-first-adult-passport"
            />
            <SourceLink
              label="HM Passport Office timing"
              url="https://www.gov.uk/government/organisations/hm-passport-office/about/about-our-services"
            />
          </div>
        </div>
      </section>

      <section id="specialties-uk">
        <SectionHeading
          eyebrow="05 / Specialty strategy"
          title="Which specialties are easier or harder for IMGs?"
          body="There is no permanently easy specialty. Competition changes by recruitment round, geography, portfolio, immigration policy, and the number of posts. These categories are strategic patterns, not guarantees."
        />
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-success-border bg-success-surface p-6">
            <h3 className="flex items-center gap-2 text-lg font-extrabold">
              <CheckCircle2 className="text-success-foreground" size={19} /> Often more
              accessible
            </h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {friendly.map(item => (
                <div
                  key={item}
                  className="rounded-lg bg-card/75 p-3 text-sm font-semibold"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Access can improve with NHS experience, geographic flexibility, a
              good portfolio, and evidence that you understand the specialty.
            </p>
          </article>
          <article className="rounded-2xl border border-error-border bg-error-surface p-6">
            <h3 className="flex items-center gap-2 text-lg font-extrabold">
              <Trophy className="text-error-foreground" size={19} /> Usually highly
              competitive
            </h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {competitive.map(item => (
                <div
                  key={item}
                  className="rounded-lg bg-card/80 p-3 text-sm font-semibold"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              These routes often require stronger evidence of commitment,
              audits, teaching, research, references, and excellent recruitment
              performance.
            </p>
          </article>
        </div>
      </section>

      <section id="hospitals-uk">
        <SectionHeading
          eyebrow="06 / Hospitals"
          title="Nine important UK hospitals and trusts to know"
          body="These are prominent teaching and tertiary centres, not a promise of IMG recruitment or a ranking. Check the trust’s current vacancies, training accreditation, and eligibility rules before applying."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((hospital, index) => (
            <article
              key={hospital.name}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative h-44 overflow-hidden bg-secondary">
                <img
                  src={assetPath(hospital.image)}
                  alt={`${hospital.name} hospital exterior`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/85">
                    {hospital.city}
                  </p>
                  <span className="text-xs font-bold text-white/80">
                    0{index + 1}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-2">
                  <Building2
                    size={18}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <h3 className="text-base font-extrabold leading-5">
                    {hospital.name}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {hospital.body}
                </p>
                <a
                  href={hospital.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  Official site <ArrowUpRight size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="passport-uk"
        className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-start gap-4">
          <IconBox icon={BriefcaseMedical} />
          <div>
            <h2 className="text-xl font-extrabold">
              Final checklist before you spend money
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Confirm the current GMC registration route, English evidence, PLAB
              booking rules, accepted postgraduate qualifications, visa route,
              and recruitment criteria. The GMC, NHS Employers, Health Careers,
              Oriel, Home Office, and each Royal College are the authoritative
              sources for current rules.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <SourceLink
                label="GMC registration"
                url="https://www.gmc-uk.org/registration-and-licensing"
              />
              <SourceLink
                label="GMC English guidance"
                url="https://www.gmc-uk.org/registration-and-licensing/join-our-registers/before-you-apply-guide-for-doctors/evidence-of-your-knowledge-of-english"
              />
              <SourceLink
                label="PLAB"
                url="https://www.gmc-uk.org/registration-and-licensing/join-our-registers/plab"
              />
              <SourceLink
                label="NHS pay"
                url="https://www.healthcareers.nhs.uk/explore-roles/doctors/pay-doctors"
              />
              <SourceLink
                label="British citizenship"
                url="https://www.gov.uk/british-citizenship"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UkPathway;

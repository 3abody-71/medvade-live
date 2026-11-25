export type RoadmapQuestionType = "select" | "number";

type Choice = { value: string; label: string; score: number };

export interface RoadmapQuestion {
  key: string;
  label: string;
  prompt: string;
  type: RoadmapQuestionType;
  gate: boolean;
  weight: number;
  placeholder?: string;
  min?: number;
  max?: number;
  benchmark?: number;
  choices?: Choice[];
  scoreBands?: { min: number; score: number }[];
  sourceLabel: string;
  sourceUrl: string;
  advice: string;
}

export interface RoadmapScoreGap {
  question: RoadmapQuestion;
  rawValue: string;
  currentScore: number;
  lostPercentagePoints: number;
  target: string;
  projectedPercentage: number;
}

export interface RoadmapCountry {
  id: string;
  name: string;
  flag: string;
  summary: string;
  questions: RoadmapQuestion[];
  officialUrl: string;
}

const USA_ECFMG = [
  "ECFMG certification requirements",
  "https://www.ecfmg.org/2026ib/certification-requirements.html",
] as const;
const USA_NRMP = [
  "NRMP IMG eligibility",
  "https://www.nrmp.org/residency-applicants/get-ready-for-the-match/are-you-eligible/",
] as const;
const USA_ERAS = [
  "AAMC ERAS for residency applicants",
  "https://students-residents.aamc.org/applying-residencies-eras/apply-residencies-eras-system",
] as const;
const USA_VISA = [
  "ECFMG J-1 sponsorship",
  "https://www.ecfmg.org/evsp/applying-general.html",
] as const;

const select = (
  key: string,
  label: string,
  prompt: string,
  choices: Choice[],
  gate: boolean,
  weight: number,
  source: readonly [string, string],
  advice: string
): RoadmapQuestion => ({
  key,
  label,
  prompt,
  type: "select",
  choices,
  gate,
  weight,
  sourceLabel: source[0],
  sourceUrl: source[1],
  advice,
});

const number = (
  key: string,
  label: string,
  prompt: string,
  benchmark: number,
  gate: boolean,
  weight: number,
  source: readonly [string, string],
  advice: string,
  scoreBands?: { min: number; score: number }[]
): RoadmapQuestion => ({
  key,
  label,
  prompt,
  type: "number",
  benchmark,
  gate,
  weight,
  min: 0,
  placeholder: "Enter a number",
  sourceLabel: source[0],
  sourceUrl: source[1],
  advice,
  scoreBands,
});

const commonProfileFactors = (
  source: readonly [string, string]
): RoadmapQuestion[] => [
  select(
    "academicRecord",
    "Academic record and transcript",
    "How strong and complete are your university grades, GPA if available, class rank, basic-science and clinical-clerkship results, and Medical School Transcript?",
    [
      { value: "strong", label: "Strong and complete", score: 1 },
      { value: "mixed", label: "Mixed / partly documented", score: 0.5 },
      { value: "weak", label: "Weak or unavailable", score: 0 },
    ],
    false,
    5,
    source,
    "Academic performance is considered differently by each program. Do not invent a GPA or class rank if your school does not use one."
  ),
  select(
    "evaluations",
    "Clinical evaluations and MSPE",
    "Do you have strong clinical evaluations plus an MSPE/Dean's Letter or equivalent school performance report?",
    [
      { value: "strong", label: "Strong and ready", score: 1 },
      { value: "mixed", label: "Some evidence ready", score: 0.5 },
      { value: "weak", label: "Not ready / concerning", score: 0 },
    ],
    false,
    5,
    source,
    "Programs may review the transcript, MSPE, Dean's Letter and clinical clerkship evaluations as context."
  ),
  select(
    "distinctions",
    "Honors and distinctions",
    "Do you have academic honors, awards, scholarships or other distinctions that you can verify?",
    [
      { value: "many", label: "Several relevant distinctions", score: 1 },
      { value: "some", label: "Some distinctions", score: 0.5 },
      { value: "none", label: "None / not documented", score: 0 },
    ],
    false,
    3,
    source,
    "Honors can strengthen context but are not a substitute for required licensing steps."
  ),
  select(
    "gaps",
    "Study or career gaps",
    "Are there no unexplained study delays, exam gaps or employment gaps in your record, or are they clearly documented?",
    [
      { value: "clear", label: "Clear or well explained", score: 1 },
      { value: "explained", label: "Some gaps explained", score: 0.5 },
      { value: "unexplained", label: "Unexplained gaps", score: 0 },
    ],
    false,
    4,
    source,
    "A gap is not automatically disqualifying; transparent dates and evidence matter."
  ),
  select(
    "leadership",
    "Leadership and medical organisations",
    "Do you have documented leadership, student-organisation, medical-campaign or initiative-building experience?",
    [
      { value: "strong", label: "Strong leadership", score: 1 },
      { value: "some", label: "Some participation", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    3,
    source,
    "Leadership is usually a competitive factor, not a universal eligibility gate."
  ),
  select(
    "service",
    "Volunteer and community service",
    "Do you have sustained volunteer work, community service or service to underserved patients?",
    [
      { value: "strong", label: "Sustained and relevant", score: 1 },
      { value: "some", label: "Some activity", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    3,
    source,
    "Consistency, impact and relevance are more useful than a raw activity count."
  ),
  select(
    "teaching",
    "Teaching and mentorship",
    "Do you have medical teaching, tutoring, mentorship or curriculum contributions with evidence?",
    [
      { value: "strong", label: "Strong evidence", score: 1 },
      { value: "some", label: "Some experience", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    3,
    source,
    "Teaching and mentorship may support specialty fit and interview evidence."
  ),
  select(
    "quality",
    "Quality improvement and patient safety",
    "Do you have documented Quality Improvement, Patient Safety or teamwork projects?",
    [
      { value: "strong", label: "Strong documented work", score: 1 },
      { value: "some", label: "Some participation", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    3,
    source,
    "Include your role, measured outcome and team contribution where possible."
  ),
  select(
    "professional",
    "Professional, conference and non-medical skills",
    "Do you have professional achievements, conferences, awards, teamwork, administrative skills or relevant experience outside medicine?",
    [
      { value: "strong", label: "Strong and relevant", score: 1 },
      { value: "some", label: "Some evidence", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    3,
    source,
    "These factors can support a coherent application story but cannot replace eligibility gates."
  ),
];

const ukCompetitiveFactors = (
  source: readonly [string, string]
): RoadmapQuestion[] => [
  number(
    "ukClinicalMonths",
    "UK/NHS clinical experience",
    "How many months of documented UK/NHS clinical experience do you have?",
    12,
    false,
    8,
    source,
    "UK exposure can support specialty fit, but it is not a universal GMC registration gate."
  ),
  select(
    "ukResearchAudit",
    "Research, audit and QI",
    "Do you have specialty-relevant research, publications, audit or quality-improvement evidence for the person specification?",
    [
      { value: "strong", label: "Strong evidence", score: 1 },
      { value: "some", label: "Some evidence", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    7,
    source,
    "The exact specialty person specification determines whether this is scored."
  ),
  select(
    "ukTeachingLeadership",
    "Teaching and leadership",
    "Do you have documented teaching, leadership or mentorship evidence for the target specialty?",
    [
      { value: "strong", label: "Strong evidence", score: 1 },
      { value: "some", label: "Some evidence", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    5,
    source,
    "This is a specialty-selection factor, not a universal UK licensing requirement."
  ),
  select(
    "ukReferences",
    "UK clinical references",
    "Do you have current referees who can verify your clinical work and suitability?",
    [
      { value: "ready", label: "Ready", score: 1 },
      { value: "progress", label: "Being arranged", score: 0.5 },
      { value: "no", label: "Not ready", score: 0 },
    ],
    false,
    5,
    source,
    "Reference format and number depend on the vacancy and recruitment round."
  ),
];

const canadaCompetitiveFactors = (
  source: readonly [string, string]
): RoadmapQuestion[] => [
  number(
    "canadaClinicalMonths",
    "Canadian or recent clinical experience",
    "How many months of recent clinical experience relevant to the target CaRMS program can you document?",
    24,
    false,
    7,
    source,
    "Programs set their own clinical-experience rules; there is no universal elective minimum."
  ),
  select(
    "canadaResearch",
    "Research and scholarly work",
    "Do you have verifiable research, publications, presentations or academic work relevant to the target program?",
    [
      { value: "strong", label: "Strong evidence", score: 1 },
      { value: "some", label: "Some evidence", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    6,
    source,
    "Research can support program-level selection but is not a national IMG gate."
  ),
  select(
    "canadaReferences",
    "CaRMS references",
    "Are your program-specific references, forms and referee relationships ready?",
    [
      { value: "ready", label: "Ready", score: 1 },
      { value: "progress", label: "In progress", score: 0.5 },
      { value: "no", label: "Not ready", score: 0 },
    ],
    false,
    6,
    source,
    "Reference requirements vary by province and program."
  ),
  select(
    "canadaPortfolio",
    "Academic and service portfolio",
    "Do you have relevant academic performance, leadership, service, teaching or QI evidence for the target program?",
    [
      { value: "strong", label: "Strong and documented", score: 1 },
      { value: "some", label: "Some evidence", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    4,
    source,
    "Only count factors the chosen program actually reviews."
  ),
];

const australiaCompetitiveFactors = (
  source: readonly [string, string]
): RoadmapQuestion[] => [
  number(
    "australiaClinicalMonths",
    "Australian and postgraduate clinical experience",
    "How many months of documented postgraduate or Australian clinical experience do you have?",
    24,
    false,
    8,
    source,
    "State, hospital and college requirements differ; this is not a universal elective rule."
  ),
  select(
    "australiaResearch",
    "Research and specialty portfolio",
    "Do you have research, publications, teaching, audit or specialty-relevant achievements for the target college or employer?",
    [
      { value: "strong", label: "Strong evidence", score: 1 },
      { value: "some", label: "Some evidence", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    6,
    source,
    "The target college decides what is relevant and how it is weighted."
  ),
  select(
    "australiaReferences",
    "Referees and performance reports",
    "Do you have current referees and work-performance evidence suitable for the target role?",
    [
      { value: "ready", label: "Ready", score: 1 },
      { value: "progress", label: "In progress", score: 0.5 },
      { value: "no", label: "Not ready", score: 0 },
    ],
    false,
    6,
    source,
    "References are employer- and college-specific."
  ),
];

const germanySpecificFactors = (
  source: readonly [string, string]
): RoadmapQuestion[] => [
  number(
    "germanyClinicalMonths",
    "Documented clinical experience",
    "How many months of relevant postgraduate clinical experience can you document for the German hospital role?",
    24,
    false,
    7,
    source,
    "Clinical experience and competencies can support direct hospital hiring and recognition; electives are not a national German residency requirement."
  ),
  select(
    "germanyHospitalFit",
    "Direct hospital application",
    "Have you identified hospitals, authorized trainers and vacancies that match your Land and specialty?",
    [
      { value: "ready", label: "Ready and documented", score: 1 },
      { value: "progress", label: "Searching", score: 0.5 },
      { value: "no", label: "Not started", score: 0 },
    ],
    true,
    8,
    source,
    "Germany generally uses direct employer applications rather than a national residency match."
  ),
  select(
    "germanyEvidence",
    "Training and competency evidence",
    "Are your internship, rotations, procedures and prior postgraduate training records ready for the authority and hospital?",
    [
      { value: "ready", label: "Ready", score: 1 },
      { value: "progress", label: "Being prepared", score: 0.5 },
      { value: "no", label: "Not ready", score: 0 },
    ],
    false,
    6,
    source,
    "The authority and Ärztekammer decide what can be recognized; elective counts are not used as a universal score."
  ),
];

const irelandSpecificFactors = (
  source: readonly [string, string]
): RoadmapQuestion[] => [
  number(
    "irelandSystemMonths",
    "Irish health-system experience",
    "How many months of documented Irish healthcare employment or training do you have?",
    12,
    false,
    8,
    source,
    "Some training programs explicitly value Irish-system experience; observerships should not be counted as employment."
  ),
  select(
    "irelandResearchAudit",
    "Research, audit and QI",
    "Do you have specialty-relevant research, publications, audit, QI or teaching evidence for the target training body?",
    [
      { value: "strong", label: "Strong evidence", score: 1 },
      { value: "some", label: "Some evidence", score: 0.5 },
      { value: "none", label: "Not documented", score: 0 },
    ],
    false,
    6,
    source,
    "This is program-specific rather than a Medical Council registration gate."
  ),
  select(
    "irelandReferences",
    "Professional references",
    "Do you have the current consultant/employer references required by the target Irish program or HSE post?",
    [
      { value: "ready", label: "Ready", score: 1 },
      { value: "progress", label: "In progress", score: 0.5 },
      { value: "no", label: "Not ready", score: 0 },
    ],
    false,
    6,
    source,
    "Reference count and format depend on the training body and post."
  ),
];

export const ROADMAP_COUNTRIES: RoadmapCountry[] = [
  {
    id: "usa",
    name: "United States",
    flag: "US",
    officialUrl: USA_NRMP[1],
    summary:
      "ECFMG certification, USMLE, ERAS and NRMP are separate gates. Scores and experience are competitive evidence, not a published match formula.",
    questions: [
      select(
        "schoolEligibility",
        "Medical school eligibility",
        "Is your medical school listed in the World Directory with an applicable ECFMG Sponsor Note for your graduation year?",
        [
          { value: "yes", label: "Yes, confirmed", score: 1 },
          { value: "checking", label: "I am checking", score: 0.5 },
          { value: "no", label: "No / not confirmed", score: 0 },
        ],
        true,
        10,
        USA_ECFMG,
        "This is a foundational ECFMG gate. A strong Step 2 score cannot replace school eligibility."
      ),
      select(
        "step1",
        "USMLE Step 1",
        "Have you passed Step 1, and how is the attempt history documented?",
        [
          { value: "passed", label: "Passed", score: 1 },
          { value: "scheduled", label: "Scheduled / preparing", score: 0.35 },
          { value: "notPassed", label: "Not passed", score: 0 },
        ],
        true,
        10,
        USA_ECFMG,
        "Step 1 is pass/fail. Attempts and timing may still be reviewed by individual programmes."
      ),
      number(
        "step2",
        "USMLE Step 2 CK score",
        "What is your Step 2 CK score? Enter 0 if you have not taken it.",
        260,
        true,
        16,
        USA_ECFMG,
        "This uses a transparent preparation benchmark: 260+ receives full score, while a lower score receives partial credit. It is not an official probability model.",
        [
          { min: 260, score: 1 },
          { min: 250, score: 0.85 },
          { min: 240, score: 0.7 },
          { min: 1, score: 0.45 },
          { min: 0, score: 0 },
        ]
      ),
      number(
        "stepAttempts",
        "USMLE attempts",
        "How many total attempts have you used across USMLE Step 1 and Step 2 CK?",
        1,
        false,
        6,
        USA_ECFMG,
        "Attempts are reviewed by some programs. This is a cautious preparation signal, not a universal cutoff.",
        [
          { min: 1, score: 1 },
          { min: 2, score: 0.65 },
          { min: 3, score: 0.35 },
          { min: 4, score: 0 },
        ]
      ),
      select(
        "examFailures",
        "Previous exam failure",
        "Have you ever failed a licensing exam or USMLE component?",
        [
          { value: "none", label: "No previous failure", score: 1 },
          {
            value: "explained",
            label: "Yes, explained and recovered",
            score: 0.55,
          },
          { value: "recent", label: "Yes, recent or unresolved", score: 0.2 },
        ],
        false,
        6,
        USA_ECFMG,
        "A failure is not automatically disqualifying, but programs may consider attempts, timing and recovery."
      ),
      select(
        "ecfmgPathway",
        "ECFMG Pathway and OET",
        "Have you completed the applicable ECFMG Pathway and OET Medicine requirements?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "unknown", label: "Not started / unsure", score: 0 },
        ],
        true,
        10,
        USA_ECFMG,
        "Record the pathway, all four OET components, and dates. The exact cycle rules must be rechecked before applying."
      ),
      select(
        "credentials",
        "Diploma, transcript and ECFMG certification",
        "Are your final diploma, transcript, identity checks and ECFMG certification complete?",
        [
          { value: "complete", label: "Complete and verified", score: 1 },
          { value: "progress", label: "Some documents pending", score: 0.5 },
          { value: "notReady", label: "Not ready", score: 0 },
        ],
        true,
        10,
        USA_ECFMG,
        "Credential verification is an eligibility gate for starting U.S. residency training."
      ),
      number(
        "usceMonths",
        "U.S. clinical experience",
        "How many months of documented U.S. clinical experience do you have?",
        3,
        false,
        10,
        USA_NRMP,
        "There is no universal national USCE minimum. Separate hands-on experience, electives, and observerships."
      ),
      number(
        "electives",
        "U.S. electives",
        "How many relevant U.S. electives or hands-on rotations do you have?",
        3,
        false,
        8,
        USA_NRMP,
        "The benchmark is a preparation signal only. Programme policies differ by specialty and institution."
      ),
      number(
        "research",
        "Research and publications",
        "How many documented research projects, publications, abstracts, or presentations do you have?",
        4,
        false,
        8,
        USA_ERAS,
        "Two papers may help, but specialty relevance, authorship, venue and verifiability also matter."
      ),
      number(
        "usLetters",
        "U.S. letters of recommendation",
        "How many current letters from U.S. clinicians can you provide?",
        3,
        false,
        8,
        USA_ERAS,
        "Record the specialty, author, date and upload status. Some programmes set their own letter requirements."
      ),
      select(
        "eras",
        "ERAS and NRMP readiness",
        "Are your ERAS profile/documents, program list, signals and NRMP registration ready for the target cycle?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "notReady", label: "Not ready", score: 0 },
        ],
        true,
        8,
        USA_ERAS,
        "ERAS does not register you for the Match. Track ERAS documents and NRMP registration separately."
      ),
      select(
        "visa",
        "Passport, citizenship and work authorization",
        "Do you have U.S. citizenship/green card, or have you confirmed a sponsoring visa route?",
        [
          {
            value: "authorized",
            label: "Citizen / green card / work-authorized",
            score: 1,
          },
          {
            value: "sponsor",
            label: "Visa sponsorship confirmed by target programs",
            score: 0.75,
          },
          { value: "checking", label: "Visa route being checked", score: 0.4 },
          { value: "no", label: "No viable route yet", score: 0 },
        ],
        true,
        8,
        USA_VISA,
        "A U.S. passport is not required for every applicant, but a legal route to train is essential. Program sponsorship policies differ."
      ),
      select(
        "programFit",
        "Programme-specific eligibility",
        "Have you checked graduation year, attempts, USCE, letters, specialty and visa rules for your target programs?",
        [
          { value: "checked", label: "Checked and documented", score: 1 },
          { value: "some", label: "Checked some programs", score: 0.5 },
          { value: "no", label: "Not checked", score: 0 },
        ],
        true,
        6,
        USA_NRMP,
        "A national score cannot replace each program's current eligibility rules."
      ),
      ...commonProfileFactors(USA_ERAS),
    ],
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "UK",
    officialUrl:
      "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/plab/a-guide-to-the-plab-test",
    summary:
      "GMC registration, English evidence, specialty person specifications, Oriel recruitment and right to work are checked separately.",
    questions: [
      select(
        "pmq",
        "Primary medical qualification and EPIC",
        "Is your overseas medical qualification accepted and primary-source verified for the GMC route?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not confirmed", score: 0 },
        ],
        true,
        14,
        [
          "GMC primary-source verification",
          "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/before-you-apply-guide-for-doctors/primary-source-verification-for-international-medical-graduates",
        ],
        "The GMC route depends on your qualification and evidence."
      ),
      select(
        "plab",
        "PLAB or alternative route",
        "Have you passed PLAB 1 and 2, or completed an accepted alternative registration route?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not complete", score: 0 },
        ],
        true,
        14,
        [
          "GMC PLAB guide",
          "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/plab/a-guide-to-the-plab-test",
        ],
        "PLAB is common for IMGs, but accepted alternative routes exist."
      ),
      select(
        "english",
        "English evidence",
        "Do you have current accepted IELTS/OET or another GMC English route with the required component scores?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "GMC English evidence",
          "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/before-you-apply-guide-for-doctors/evidence-of-your-knowledge-of-english",
        ],
        "Enter each component and expiry in your notes."
      ),
      select(
        "gmc",
        "GMC registration and licence",
        "Do you hold or have a confirmed route to GMC registration with a licence to practise?",
        [
          { value: "complete", label: "Registered/licensed", score: 1 },
          { value: "progress", label: "Application in progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        12,
        [
          "GMC IMG registration",
          "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/registration-applications/application-guides/full-registration-for-international-medical-graduates",
        ],
        "Clinical training work requires the appropriate licence."
      ),
      select(
        "internship",
        "Internship and clinical competence",
        "Is your internship/postgraduate experience acceptable for the target specialty and level, with required competence evidence?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "Evidence being prepared", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "GMC internship guidance",
          "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/before-you-apply-guide-for-doctors/check-if-your-practical-training-internship-is-acceptable",
        ],
        "Observerships do not replace an acceptable internship."
      ),
      number(
        "msra",
        "Specialty assessment",
        "What is your specialty assessment score, such as MSRA, if required? Enter 0 if not taken.",
        550,
        false,
        8,
        [
          "NHS specialty selection",
          "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/overview-of-specialty-training/interviews-and-selection-process",
        ],
        "The assessment and weighting depend on the specialty and recruitment round."
      ),
      ...ukCompetitiveFactors([
        "NHS person specifications",
        "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/person-specifications",
      ]),
      select(
        "orielVisa",
        "Oriel and right to work",
        "Is your Oriel application ready and is your UK right-to-work or sponsorship route confirmed?",
        [
          { value: "complete", label: "Ready and confirmed", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "UK Health and Care Worker visa",
          "https://www.gov.uk/health-care-worker-visa",
        ],
        "Oriel deadlines and visa eligibility are separate checks."
      ),
    ],
  },
  {
    id: "canada",
    name: "Canada",
    flag: "CA",
    officialUrl:
      "https://www.carms.ca/match/r-1-main-residency-match/eligibility-criteria/",
    summary:
      "CaRMS and provincial rules are strict. Citizenship/PR, MCC exams, language, source verification and province-specific eligibility come before competitiveness.",
    questions: [
      select(
        "status",
        "Citizenship or permanent residence",
        "Are you a Canadian citizen or permanent resident for the target R-1 stream?",
        [
          { value: "yes", label: "Yes", score: 1 },
          { value: "checking", label: "Checking an exception", score: 0.4 },
          { value: "no", label: "No", score: 0 },
        ],
        true,
        18,
        [
          "CaRMS citizenship criteria",
          "https://www.carms.ca/match/r-1-main-residency-match/eligibility-criteria/r-1-summary-of-citizenship-requirements/",
        ],
        "Most R-1 IMG applicants need citizenship or PR; province-specific exceptions are limited."
      ),
      select(
        "degree",
        "Degree and WDOMS eligibility",
        "Is your medical degree from a recognized medical school and valid for the target match year?",
        [
          { value: "yes", label: "Confirmed", score: 1 },
          { value: "checking", label: "Checking", score: 0.5 },
          { value: "no", label: "Not confirmed", score: 0 },
        ],
        true,
        12,
        [
          "CaRMS R-1 eligibility",
          "https://www.carms.ca/match/r-1-main-residency-match/eligibility-criteria/",
        ],
        "Graduation timing and prior postgraduate training can affect iteration eligibility."
      ),
      select(
        "mccqe",
        "MCCQE Part I",
        "Have you passed MCCQE Part I and transferred the result correctly?",
        [
          { value: "passed", label: "Passed", score: 1 },
          { value: "scheduled", label: "Scheduled", score: 0.5 },
          { value: "no", label: "Not passed", score: 0 },
        ],
        true,
        12,
        [
          "Medical Council of Canada MCCQE",
          "https://mcc.ca/examinations-assessments/mccqe/",
        ],
        "Record result date and score where the program requests it."
      ),
      select(
        "nac",
        "NAC Examination",
        "Have you passed the NAC Examination with the required result for your target province/program?",
        [
          { value: "passed", label: "Passed", score: 1 },
          { value: "scheduled", label: "Scheduled", score: 0.5 },
          { value: "no", label: "Not passed", score: 0 },
        ],
        true,
        12,
        [
          "Medical Council of Canada NAC",
          "https://mcc.ca/examinations-assessments/nac-examination/",
        ],
        "NAC and provincial eligibility rules can vary."
      ),
      select(
        "language",
        "English or French",
        "Do you have the required language evidence for your target province and program?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        8,
        [
          "CaRMS document requirements",
          "https://www.carms.ca/match/r-1-main-residency-match/applicant/application-process-documents-r1/document-submission-r1/",
        ],
        "Accepted tests and thresholds vary by jurisdiction."
      ),
      select(
        "verification",
        "Physiciansapply.ca and credential verification",
        "Are your credentials source-verified and your MINC/CaRMS document pathway ready?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "MCC IMG pathways",
          "https://mcc.ca/credentials-and-services/pathways-to-licensure/pathways-for-international-medical-graduates/",
        ],
        "Verification is a process gate, not a competitiveness score."
      ),
      ...canadaCompetitiveFactors([
        "CaRMS R-1 documents",
        "https://www.carms.ca/match/r-1-main-residency-match/applicant/application-process-documents-r1/documents-r1/",
      ]),
      select(
        "provinceFit",
        "Province and program fit",
        "Have you checked the province's IMG stream, assessments, return-of-service and work authorization rules?",
        [
          { value: "checked", label: "Checked", score: 1 },
          { value: "some", label: "Some checked", score: 0.5 },
          { value: "no", label: "Not checked", score: 0 },
        ],
        true,
        10,
        [
          "CaRMS R-1 eligibility",
          "https://www.carms.ca/match/r-1-main-residency-match/eligibility-criteria/",
        ],
        "Canada has no single national IMG rule that overrides provincial criteria."
      ),
    ],
  },
  {
    id: "australia",
    name: "Australia",
    flag: "AU",
    officialUrl:
      "https://www.medicalboard.gov.au/Registration/International-Medical-Graduates/Standard-Pathway",
    summary:
      "The Medical Board/Ahpra and AMC set registration gates, while states, hospitals and colleges set training selection rules.",
    questions: [
      select(
        "pathway",
        "IMG pathway",
        "Have you selected the correct Australian pathway for your degree and experience?",
        [
          { value: "confirmed", label: "Confirmed", score: 1 },
          { value: "checking", label: "Checking", score: 0.5 },
          { value: "no", label: "Not selected", score: 0 },
        ],
        true,
        12,
        [
          "Medical Board IMG pathways",
          "https://www.medicalboard.gov.au/Registration/International-Medical-Graduates/Standard-Pathway",
        ],
        "Standard, competent-authority and specialty pathways differ."
      ),
      select(
        "verification",
        "AMC portfolio and verification",
        "Is your AMC portfolio and primary-source credential verification complete?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "Australian Medical Council",
          "https://www.amc.org.au/pathways/how-to-apply/",
        ],
        "Verification is required before assessment and registration steps."
      ),
      select(
        "amc",
        "AMC assessment",
        "What is your AMC CAT MCQ and clinical/WBA status?",
        [
          { value: "complete", label: "Required assessments passed", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not complete", score: 0 },
        ],
        true,
        14,
        [
          "AMC assessments",
          "https://www.amc.org.au/pathways/standard-pathway/amc-assessments/",
        ],
        "The exact pathway may use clinical examination or accredited WBA."
      ),
      select(
        "english",
        "English language standard",
        "Do you meet the current Ahpra English standard or an accepted exemption?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "Ahpra English language skills",
          "https://www.ahpra.gov.au/Registration/Registration-Standards/English-language-skills/Accepted-English-language-tests",
        ],
        "Record all component scores and validity."
      ),
      select(
        "registration",
        "Registration and supervised practice",
        "Do you have the required registration category and an approved supervised role or pathway?",
        [
          { value: "complete", label: "Confirmed", score: 1 },
          { value: "progress", label: "Arranging it", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        14,
        [
          "Medical Board general registration for IMGs",
          "https://www.medicalboard.gov.au/Registration/Types/General-Registration/imgs-with-AMC",
        ],
        "Supervised practice and registration are separate from specialty selection."
      ),
      ...australiaCompetitiveFactors([
        "RANZCP selection example",
        "https://www.ranzcp.org/become-a-psychiatrist/psychiatry-training/selection-process-trainees",
      ]),
      select(
        "visa",
        "Visa and work rights",
        "Do you have a visa or employer sponsorship route that permits the intended medical work?",
        [
          { value: "authorized", label: "Authorized", score: 1 },
          {
            value: "sponsor",
            label: "Sponsorship being confirmed",
            score: 0.5,
          },
          { value: "no", label: "No route yet", score: 0 },
        ],
        true,
        10,
        [
          "Australian Home Affairs",
          "https://immi.homeaffairs.gov.au/visas/working-in-australia/skills-assessment",
        ],
        "Visa rules are case-specific and should be checked with the employer and Home Affairs."
      ),
    ],
  },
  {
    id: "germany",
    name: "Germany",
    flag: "DE",
    officialUrl:
      "https://www.make-it-in-germany.com/en/working-in-germany/job-search-application/professions-in-demand/physicians",
    summary:
      "Approbation or an appropriate temporary licence, German language, state authority recognition and direct hospital applications define the route.",
    questions: [
      select(
        "recognition",
        "Medical qualification recognition",
        "Has the responsible state authority assessed your medical degree and documents?",
        [
          { value: "complete", label: "Recognized/equivalent", score: 1 },
          { value: "progress", label: "Assessment in progress", score: 0.5 },
          { value: "no", label: "Not started", score: 0 },
        ],
        true,
        14,
        [
          "Make it in Germany physician guidance",
          "https://www.make-it-in-germany.com/en/working-in-germany/job-search-application/professions-in-demand/physicians",
        ],
        "The competent authority depends on the federal state where you will work."
      ),
      select(
        "germanB2",
        "General German B2",
        "Do you have the general German level required by the responsible state?",
        [
          { value: "complete", label: "B2 or higher", score: 1 },
          { value: "progress", label: "Studying", score: 0.5 },
          { value: "no", label: "Not yet", score: 0 },
        ],
        true,
        10,
        [
          "Make it in Germany",
          "https://www.make-it-in-germany.com/en/working-in-germany/job-search-application/professions-in-demand/physicians",
        ],
        "Most states require general German B2, subject to implementation."
      ),
      select(
        "medicalGerman",
        "Medical German",
        "Have you passed the Fachsprachprüfung or equivalent medical-language assessment?",
        [
          { value: "passed", label: "Passed", score: 1 },
          { value: "scheduled", label: "Scheduled", score: 0.5 },
          { value: "no", label: "Not passed", score: 0 },
        ],
        true,
        12,
        [
          "German Medical Association language guidance",
          "https://www.bundesaerztekammer.de/fileadmin/user_upload/BAEK/Themen/Internationales/Orientierungshilfe_mit_Fachglossar_DE_220302.pdf",
        ],
        "Medical language is separate from general B2."
      ),
      select(
        "knowledge",
        "Kenntnisprüfung",
        "If required, have you passed or scheduled the Kenntnisprüfung?",
        [
          {
            value: "notRequired",
            label: "Not required / route accepted",
            score: 1,
          },
          { value: "passed", label: "Passed", score: 1 },
          { value: "scheduled", label: "Scheduled", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "German Approbation regulation",
          "https://www.gesetze-im-internet.de/_appro_2002/BJNR240500002.html",
        ],
        "Whether it is required depends on equivalence and authority assessment."
      ),
      select(
        "licence",
        "Approbation or Berufserlaubnis",
        "Do you hold the practice authorization needed for the intended role?",
        [
          { value: "approbation", label: "Approbation", score: 1 },
          { value: "temporary", label: "Berufserlaubnis", score: 0.7 },
          { value: "progress", label: "Application in progress", score: 0.4 },
          { value: "no", label: "No authorization", score: 0 },
        ],
        true,
        12,
        [
          "Make it in Germany physician guidance",
          "https://www.make-it-in-germany.com/en/working-in-germany/job-search-application/professions-in-demand/physicians",
        ],
        "A temporary permit may be limited by state, employer or time."
      ),
      ...germanySpecificFactors([
        "German physician employment guidance",
        "https://www.make-it-in-germany.com/en/working-in-germany/job-search-application/professions-in-demand/physicians",
      ]),
      select(
        "landFit",
        "State chamber and hospital fit",
        "Have you checked the Land, Ärztekammer, specialty and direct hospital vacancy requirements?",
        [
          { value: "checked", label: "Checked", score: 1 },
          { value: "some", label: "Partly checked", score: 0.5 },
          { value: "no", label: "Not checked", score: 0 },
        ],
        true,
        8,
        [
          "German Medical Association training regulation",
          "https://www.bundesaerztekammer.de/themen/aerzte/aus-fort-und-weiterbildung/aerztliche-weiterbildung/muster-weiterbildungsordnung",
        ],
        "Germany has no single national residency match or deadline."
      ),
      select(
        "residence",
        "Residence and work authorization",
        "Do you have the residence title or EU/EEA status needed for the intended job?",
        [
          { value: "authorized", label: "Authorized", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "No route yet", score: 0 },
        ],
        true,
        8,
        [
          "Recognition visa",
          "https://www.make-it-in-germany.com/en/visa-recognition/visa-types/recognition",
        ],
        "Recognition and immigration are separate processes."
      ),
    ],
  },
  {
    id: "ireland",
    name: "Ireland",
    flag: "IE",
    officialUrl:
      "https://www.medicalcouncil.ie/registration-applications/first-time-applicants/",
    summary:
      "Medical Council registration, PRES or an accepted route, English evidence, training-body rules and work permission are separate checks.",
    questions: [
      select(
        "registrationRoute",
        "Medical Council registration route",
        "Have you selected the correct Irish Medical Council registration division and route?",
        [
          { value: "confirmed", label: "Confirmed", score: 1 },
          { value: "checking", label: "Checking", score: 0.5 },
          { value: "no", label: "Not selected", score: 0 },
        ],
        true,
        12,
        [
          "Medical Council first-time applicants",
          "https://www.medicalcouncil.ie/registration-applications/first-time-applicants/",
        ],
        "Route depends on qualification, experience and registration history."
      ),
      select(
        "pres",
        "PRES or accepted alternative",
        "Have you completed PRES or an accepted alternative such as PLAB/USMLE/MCCQE/AMC where applicable?",
        [
          { value: "complete", label: "Complete/exempt", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not complete", score: 0 },
        ],
        true,
        12,
        [
          "Medical Council PRES",
          "https://www.medicalcouncil.ie/registration-applications/pres/what-is-the-pres-level-2-.html",
        ],
        "Do not assume one exam route applies to every applicant."
      ),
      select(
        "english",
        "English language",
        "Do you have current accepted OET/IELTS/Cambridge evidence or an official exemption?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "Medical Council English language",
          "https://www.medicalcouncil.ie/registration-applications/first-time-applicants/english-language.html",
        ],
        "Record all component scores and certificate dates."
      ),
      select(
        "epic",
        "EPIC and good standing",
        "Are your degree documents EPIC-verified and your current certificates of good standing ready?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "In progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "Medical Council non-EU/EEA applicants",
          "https://www.medicalcouncil.ie/registration-applications/first-time-applicants/notice-for-applicants-for-registration-who-qualified-outside-of-the-eu-eea-and-switzerland-.html",
        ],
        "Good-standing certificates may need to be sent directly and be recent."
      ),
      select(
        "internship",
        "Internship and clinical experience",
        "Is your internship accepted and do you meet the named training body's clinical experience requirements?",
        [
          { value: "complete", label: "Complete", score: 1 },
          { value: "progress", label: "Evidence in progress", score: 0.5 },
          { value: "no", label: "Not ready", score: 0 },
        ],
        true,
        10,
        [
          "RCPI BST entry guidance",
          "https://www.rcpi.ie/Learn-and-Develop/Training-Programmes/Basic-Specialist-Training/Entry-Guidance-and-Advice",
        ],
        "Some programmes value Irish health-system experience; check the exact intake."
      ),
      ...irelandSpecificFactors([
        "RCPI BST entry guidance",
        "https://www.rcpi.ie/Learn-and-Develop/Training-Programmes/Basic-Specialist-Training/Entry-Guidance-and-Advice",
      ]),
      select(
        "program",
        "Training body and application",
        "Have you checked the target RCPI/RCSI/HSE programme, portal, deadlines and registration eligibility?",
        [
          { value: "checked", label: "Checked", score: 1 },
          { value: "some", label: "Partly checked", score: 0.5 },
          { value: "no", label: "Not checked", score: 0 },
        ],
        true,
        8,
        [
          "RCSI training applications",
          "https://www.rcsi.com/surgery/training/surgery/cst/apply",
        ],
        "Ireland has multiple specialty and training-body processes."
      ),
      select(
        "visa",
        "Work authorization",
        "Do you have EEA/UK/Swiss status or a confirmed Irish employment-permit and visa route?",
        [
          { value: "authorized", label: "Authorized", score: 1 },
          {
            value: "sponsor",
            label: "Employer route being confirmed",
            score: 0.5,
          },
          { value: "no", label: "No route yet", score: 0 },
        ],
        true,
        10,
        [
          "Irish employment visa",
          "https://www.irishimmigration.ie/coming-to-work-in-ireland/what-are-my-work-visa-options/applying-for-a-long-stay-employment-visa/employment-visa/",
        ],
        "An observership does not itself provide work permission."
      ),
    ],
  },
];

export function answerKey(countryId: string, questionKey: string) {
  return `roadmap:${countryId}:${questionKey}`;
}

export function questionScore(
  question: RoadmapQuestion,
  raw: string | undefined
) {
  if (!raw) return 0;
  const numeric = Number(raw);
  if (question.type === "number" && Number.isFinite(numeric)) {
    if (question.scoreBands) {
      return question.scoreBands.find(band => numeric >= band.min)?.score ?? 0;
    }
    return Math.min(numeric / (question.benchmark || 1), 1);
  }
  return question.choices?.find(choice => choice.value === raw)?.score ?? 0;
}

function targetFor(question: RoadmapQuestion) {
  if (question.type === "number") {
    const fullCreditBand = question.scoreBands?.find(band => band.score >= 1);
    return fullCreditBand
      ? `${fullCreditBand.min}+`
      : `${question.benchmark ?? 1}+`;
  }
  return (
    question.choices?.find(choice => choice.score >= 1)?.label ||
    "Complete / confirmed"
  );
}

export function calculateRoadmap(
  country: RoadmapCountry,
  answers: Record<string, string>
) {
  const totalWeight = country.questions.reduce(
    (sum, question) => sum + question.weight,
    0
  );
  const earned = country.questions.reduce(
    (sum, question) =>
      sum + questionScore(question, answers[question.key]) * question.weight,
    0
  );
  const percentage = Math.round((earned / totalWeight) * 100);
  const gates = country.questions.filter(question => question.gate);
  const gatesMet = gates.filter(
    question => questionScore(question, answers[question.key]) >= 0.99
  ).length;
  const blockers = gates
    .filter(question => questionScore(question, answers[question.key]) < 0.99)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);
  const gaps: RoadmapScoreGap[] = country.questions
    .filter(question => questionScore(question, answers[question.key]) < 0.99)
    .map(question => {
      const currentScore = questionScore(question, answers[question.key]);
      const lostPercentagePoints =
        (((1 - currentScore) * question.weight) / totalWeight) * 100;
      return {
        question,
        rawValue: answers[question.key] || "",
        currentScore,
        lostPercentagePoints: Math.round(lostPercentagePoints * 10) / 10,
        target: targetFor(question),
        projectedPercentage: Math.min(
          100,
          Math.round(percentage + lostPercentagePoints)
        ),
      };
    })
    .sort((a, b) => b.lostPercentagePoints - a.lostPercentagePoints)
    .slice(0, 8);
  return {
    percentage,
    gatesMet,
    gatesTotal: gates.length,
    blockers,
    gaps,
    improvements: gaps.map(gap => gap.question),
  };
}

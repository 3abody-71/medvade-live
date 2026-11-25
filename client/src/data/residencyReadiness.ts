import type { Profile } from "../contexts/AppContext";
import countries from "./countries.json";

export type ReadinessStatus =
  | "verified"
  | "in-progress"
  | "not-met"
  | "unknown"
  | "not-applicable";

export interface ReadinessFactor {
  key: string;
  label: string;
  question: string;
  placeholder: string;
  evidenceGuide: string;
  official: boolean;
  sourceLabel: string;
  sourceUrl: string;
}

export interface ReadinessScore {
  percentage: number;
  verified: number;
  inProgress: number;
  total: number;
  gatesMet: number;
  gatesTotal: number;
  competitiveDocumented: number;
  competitiveTotal: number;
  blockers: string[];
}

const USA_SOURCES = {
  ecfmg: [
    "ECFMG certification requirements",
    "https://www.ecfmg.org/certification-pathways/",
  ],
  nrmp: [
    "NRMP IMG eligibility",
    "https://www.nrmp.org/residency-applicants/get-ready-for-the-match/are-you-eligible/",
  ],
  eras: [
    "AAMC ERAS documents",
    "https://students-residents.aamc.org/applying-residencies-eras/documents-eras-residency-applicants",
  ],
  visa: [
    "ECFMG J-1 requirements",
    "https://www.ecfmg.org/evsp/applying-general.html",
  ],
} as const;

const COMMON = {
  gmc: [
    "GMC registration and English guidance",
    "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/before-you-apply-guide-for-doctors/evidence-of-your-knowledge-of-english",
  ],
  australia: [
    "Medical Board of Australia IMG pathways",
    "https://www.medicalboard.gov.au/Registration/International-Medical-Graduates.aspx",
  ],
  canada: [
    "CaRMS R-1 eligibility",
    "https://www.carms.ca/match/r-1-main-residency-match/eligibility-criteria/",
  ],
  germany: [
    "Germany physician recognition guidance",
    "https://www.make-it-in-germany.com/en/working-in-germany/job-search-application/professions-in-demand/physicians",
  ],
  ireland: [
    "Medical Council of Ireland registration",
    "https://www.medicalcouncil.ie/registration-applications/first-time-applicants/",
  ],
} as const;

const factor = (
  key: string,
  label: string,
  question: string,
  placeholder: string,
  evidenceGuide: string,
  official: boolean,
  source: readonly [string, string]
): ReadinessFactor => ({
  key,
  label,
  question,
  placeholder,
  evidenceGuide,
  official,
  sourceLabel: source[0],
  sourceUrl: source[1],
});

export const RESIDENCY_READINESS_FACTORS: Record<string, ReadinessFactor[]> = {
  usa: [
    factor(
      "ecfmg_exams",
      "USMLE Step 1 and Step 2 CK",
      "What is your Step 1 status, and what are your Step 2 CK score, attempts, and date?",
      "Example: Step 1 passed; Step 2 CK 253, first attempt, 2026",
      "Enter exact results and dates. Passing is an official ECFMG gate; scores and attempts are program-context evidence, not a match forecast.",
      true,
      USA_SOURCES.ecfmg
    ),
    factor(
      "ecfmg_pathway_oet",
      "ECFMG Pathway and OET Medicine",
      "Which ECFMG Pathway/OET requirements have you completed?",
      "Example: Pathway 1 complete; OET L/R/W/S scores recorded",
      "Record each OET component, pathway, completion date, and expiry when applicable.",
      true,
      USA_SOURCES.ecfmg
    ),
    factor(
      "credential_verification",
      "Credential verification and ECFMG certification",
      "What is the status of your diploma, transcript, identity verification, and ECFMG certification?",
      "Example: Diploma verified; ECFMG certification complete",
      "Use verified, pending, or unknown rather than assuming your school documents are accepted.",
      true,
      USA_SOURCES.ecfmg
    ),
    factor(
      "usce_electives",
      "U.S. clinical experience and electives",
      "How much hands-on U.S. clinical experience or elective exposure do you have?",
      "Example: 3 electives / 4 months hands-on USCE in internal medicine",
      "Separate hands-on experience, electives, and observerships. There is no universal national minimum.",
      false,
      USA_SOURCES.nrmp
    ),
    factor(
      "research",
      "Research and publications",
      "How many research projects, publications, abstracts, or presentations can you document?",
      "Example: 2 peer-reviewed publications; 1 abstract; specialty-related research",
      "Enter count, role, specialty relevance, and DOI/citation links. No universal publication threshold exists.",
      false,
      USA_SOURCES.eras
    ),
    factor(
      "letters_documents",
      "Letters and ERAS application documents",
      "How ready are your letters, MSPE, transcript, personal statement, and ERAS documents?",
      "Example: 3 letters ready, 2 from US clinicians; MSPE and transcript uploaded",
      "Program-specific letter requirements vary. Document the source and readiness of each item.",
      true,
      USA_SOURCES.eras
    ),
    factor(
      "visa",
      "Visa and sponsorship feasibility",
      "What is your U.S. work authorization or visa sponsorship situation?",
      "Example: Requires J-1; Statement of Need likely available; target programs sponsor J-1",
      "Visa feasibility is a program gate, not a competitiveness score. Confirm the exact sponsor policy.",
      true,
      USA_SOURCES.visa
    ),
    factor(
      "program_fit",
      "Specialty and program-specific fit",
      "Which specialty/program requirements have you checked for this Match cycle?",
      "Example: 2027 internal medicine programs checked for graduation year, attempts, USCE, letters, and visa policy",
      "Record the program URL and date checked. Never generalize one program's cutoff to the whole country.",
      true,
      USA_SOURCES.nrmp
    ),
  ],
  uk: [
    factor(
      "pmq_gmc",
      "Acceptable medical qualification and GMC route",
      "Has GMC confirmed your primary medical qualification and registration route?",
      "Example: PMQ accepted; PLAB route selected; EPIC verification pending",
      "Record the exact GMC route, school, graduation date, and verification outcome.",
      true,
      COMMON.gmc
    ),
    factor(
      "plab",
      "PLAB or applicable licensing examination",
      "What is your PLAB or alternative GMC examination status?",
      "Example: PLAB 1 passed; PLAB 2 booked for October 2026",
      "Exam and route requirements are official gates where applicable; specialty exams are programme-specific.",
      true,
      COMMON.gmc
    ),
    factor(
      "english",
      "English language evidence",
      "What accepted English evidence do you have and when does it expire?",
      "Example: IELTS Academic 7.5 overall, no component below 7.0",
      "Record test, component scores, date, expiry, and exemption basis.",
      true,
      COMMON.gmc
    ),
    factor(
      "gmc_registration",
      "GMC registration and licence",
      "What is your GMC registration and licence-to-practise status?",
      "Example: Full registration application submitted; licence expected before start date",
      "Registration is not a guarantee of employment or specialty training.",
      true,
      COMMON.gmc
    ),
    factor(
      "clinical_competence",
      "Clinical experience and competence",
      "What internship, postgraduate experience, CREST, or foundation competence evidence do you have?",
      "Example: 18 months postgraduate medicine; CREST route evidence prepared",
      "Requirements vary by specialty and level. Electives are not universal UK requirements.",
      true,
      [
        "NHS specialty training eligibility",
        "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/overview-of-specialty-training/eligibility",
      ]
    ),
    factor(
      "research_teaching",
      "Research, teaching, audit, and QI",
      "What scholarly or teaching evidence can you document for your named specialty?",
      "Example: 2 publications, 1 audit, 3 teaching sessions with feedback",
      "These may be desirable in a person specification, not universal national requirements.",
      false,
      [
        "NHS IMT 2026 person specification",
        "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/person-specifications/person-specifications-2026/internal-medicine-training-ct1-2026",
      ]
    ),
    factor(
      "right_to_work",
      "Right to work and immigration",
      "Can you work in the UK for the selected programme and cycle?",
      "Example: Health and Care Worker visa sponsorship required; certificate route checked",
      "Confirm current immigration and 2027 prioritisation rules for the named recruitment round.",
      true,
      [
        "UK Health and Care Worker visa",
        "https://www.gov.uk/health-care-worker-visa",
      ]
    ),
  ],
  australia: [
    factor(
      "degree_pathway",
      "Eligible medical school and IMG pathway",
      "Which Australian IMG pathway applies to your degree, school, graduation year, and experience?",
      "Example: Standard pathway; school/year listed in WDoMS; AMC portfolio started",
      "Pathway classification is an official gate, not a ranking score.",
      true,
      COMMON.australia
    ),
    factor(
      "amc_exams",
      "AMC examinations and assessment",
      "What is your AMC CAT MCQ, clinical exam, or WBA status?",
      "Example: AMC CAT MCQ passed; clinical exam scheduled",
      "The standard pathway uses AMC assessment steps; exact status and dates matter.",
      true,
      [
        "Australian Medical Council standard pathway assessments",
        "https://www.amc.org.au/pathways/standard-pathway/amc-assessments/",
      ]
    ),
    factor(
      "english",
      "English language standard",
      "What English test, component scores, validity, or exemption do you have?",
      "Example: OET B in all components, valid through 2027",
      "Use the current Ahpra standard and record the source date.",
      true,
      [
        "Ahpra English language skills",
        "https://www.ahpra.gov.au/Registration/Registration-Standards/English-language-skills.aspx",
      ]
    ),
    factor(
      "verification_registration",
      "Verification, registration, and supervision",
      "What is your primary-source verification, Ahpra registration, and supervised-practice status?",
      "Example: Primary qualification verified; provisional registration; supervised role identified",
      "Registration and supervision are eligibility/safety gates, not a training-place guarantee.",
      true,
      COMMON.australia
    ),
    factor(
      "clinical_australian",
      "Clinical experience and Australian exposure",
      "How much recent clinical work, Australian experience, or elective/observership exposure do you have?",
      "Example: 24 months postgraduate work; 3-month Australian elective",
      "Programmes differ by state, hospital, and specialty. Record the exact programme rule.",
      false,
      COMMON.australia
    ),
    factor(
      "research_references",
      "Research and references",
      "What research, publications, and referee evidence can you document?",
      "Example: 2 publications; 3 current referees with specialty relevance",
      "These are programme-specific competitive evidence, not national registration requirements.",
      false,
      [
        "RACGP international medical graduates",
        "https://www.racgp.org.au/education/imgs",
      ]
    ),
    factor(
      "visa",
      "Visa and work authorization",
      "What Australian work rights or sponsorship route applies to you?",
      "Example: Employer sponsorship required; target hospital confirms eligibility",
      "Visa type and restrictions vary. Use Home Affairs for the exact route.",
      true,
      [
        "Australian Government visa finder",
        "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
      ]
    ),
  ],
  canada: [
    factor(
      "cars_basic",
      "CaRMS eligibility and applicant status",
      "Do you meet the current CaRMS R-1 IMG eligibility rules for citizenship/PR, degree, school, iteration, and MINC?",
      "Example: Permanent resident; school accepted; MINC obtained; first iteration",
      "These are hard cycle-specific gates and vary by province and programme.",
      true,
      COMMON.canada
    ),
    factor(
      "mcc_exams",
      "MCCQE Part I and NAC",
      "What are your MCCQE Part I and NAC status, scores, dates, and attempts?",
      "Example: MCCQE Part I passed; NAC passed; results transferred to CaRMS",
      "Province and programme rules differ. Do not infer a national score-to-match relationship.",
      true,
      [
        "CaRMS MCC examination requirements",
        "https://www.carms.ca/match/r-1-main-residency-match/eligibility-criteria/r-1-summary-of-mcc-examination-requirements/",
      ]
    ),
    factor(
      "language",
      "English or French language evidence",
      "What accepted language evidence do you have for your target province and programme?",
      "Example: IELTS component scores recorded; expiry checked against CaRMS cycle",
      "Tests, scores, validity, and exemptions are jurisdiction-specific.",
      true,
      [
        "CaRMS language requirements",
        "https://www.carms.ca/match/r-1-main-residency-match/eligibility-criteria/r-1-summary-of-language-proficiency-requirements/",
      ]
    ),
    factor(
      "credentials",
      "Credential and source verification",
      "What is the status of your physiciansapply.ca and medical credential verification?",
      "Example: Diploma source-verified; translation uploaded; regulator acceptance checked",
      "Verification is a process status, not a quality ranking.",
      true,
      [
        "Medical Council of Canada credential verification",
        "https://mcc.ca/credentials-and-services/services/verification-of-credentials/",
      ]
    ),
    factor(
      "clinical_electives",
      "Clinical experience and Canadian electives",
      "What recent clinical experience or Canadian electives can you document for the exact programme?",
      "Example: 2 years postgraduate medicine; 3 Canadian electives; recency confirmed",
      "There is no universal national elective or clinical-experience requirement.",
      false,
      COMMON.canada
    ),
    factor(
      "research_references",
      "Research and references",
      "What publications, scholarly work, and references can you document?",
      "Example: 2 publications; 3 references in CaRMS format; all dates current",
      "Treat as competitive/context evidence unless the named programme requires it.",
      false,
      [
        "CaRMS R-1 data and reports",
        "https://www.carms.ca/data-reports/r1-data-reports/",
      ]
    ),
    factor(
      "program_fit_visa",
      "Province, programme fit, and work authorization",
      "Have you checked programme-specific assessments, obligations, citizenship/visa rules, and return-of-service terms?",
      "Example: Ontario IMG stream checked; AVP/PRP requirement and PR status confirmed",
      "One province or university's rules cannot be generalized to Canada.",
      true,
      COMMON.canada
    ),
  ],
  germany: [
    factor(
      "recognition",
      "Medical qualification recognition",
      "What is the status of your German recognition/Approbation pathway?",
      "Example: Third-country degree assessed; equivalence decision pending",
      "Recognition and the responsible Land authority are official gates.",
      true,
      COMMON.germany
    ),
    factor(
      "knowledge_exam",
      "Kenntnisprüfung or applicable exam",
      "Do you need a knowledge/proficiency exam, and what is its status?",
      "Example: Kenntnisprüfung required; exam date booked",
      "The applicable route depends on qualification and jurisdiction.",
      true,
      [
        "German Medical Association recognition",
        "https://www.bundesaerztekammer.de/en/work-and-training-in-germany/recognition",
      ]
    ),
    factor(
      "german_language",
      "General and medical German",
      "What B2 general German and C1 medical-language evidence do you have?",
      "Example: B2 certificate complete; Fachsprachprüfung C1 passed",
      "Exact language implementation is state-specific; record certificates and dates.",
      true,
      COMMON.germany
    ),
    factor(
      "licence",
      "Approbation or Berufserlaubnis",
      "What German practice authorization do you hold or expect?",
      "Example: Berufserlaubnis issued in Bavaria; Approbation application pending",
      "Temporary permission is not identical to unrestricted Approbation.",
      true,
      COMMON.germany
    ),
    factor(
      "land_specialty",
      "Land and specialty-training eligibility",
      "Which Land, chamber, specialty, rotations, and trainer requirements have you checked?",
      "Example: NRW chamber rules checked for internal medicine; authorized trainer identified",
      "The legally binding rules are state-chamber and specialty-specific.",
      true,
      [
        "German Medical Association model training regulation",
        "https://www.bundesaerztekammer.de/themen/aerzte/aus-fort-und-weiterbildung/aerztliche-weiterbildung/muster-weiterbildungsordnung",
      ]
    ),
    factor(
      "clinical_research",
      "Clinical experience, electives, research, and references",
      "What clinical competencies, electives, research, publications, and references can you document?",
      "Example: 18 months clinical work; 3-month German observership; 2 publications",
      "These are usually employer-specific competitive evidence, not national match inputs.",
      false,
      COMMON.germany
    ),
    factor(
      "residence",
      "Work authorization and residence",
      "Can you legally work in the selected Land and role?",
      "Example: EU Blue Card/job-offer route checked; contract and licence conditions understood",
      "Residence status is separate from medical licensure and does not guarantee a post.",
      true,
      [
        "Federal Employment Agency EU Blue Card",
        "https://www.arbeitsagentur.de/vor-ort/zav/working-and-living-in-germany/iss-en/issue-03-2026/blue-card",
      ]
    ),
  ],
  ireland: [
    factor(
      "degree_internship_exam",
      "Degree, internship, and route-specific exam",
      "What is your Irish registration route, internship evidence, and PRES or programme-exam status?",
      "Example: Internship accepted; Category 4 route; PRES exemption checked",
      "Requirements vary by Medical Council division and named programme.",
      true,
      COMMON.ireland
    ),
    factor(
      "english",
      "English language evidence",
      "What accepted OET, IELTS, Cambridge, or exemption evidence do you have?",
      "Example: OET B in every module in one sitting; date and expiry recorded",
      "Use current Medical Council rules and record each component score.",
      true,
      [
        "Medical Council of Ireland English language",
        "https://www.medicalcouncil.ie/registration-applications/first-time-applicants/english-language.html",
      ]
    ),
    factor(
      "epic_goodstanding",
      "EPIC verification and good standing",
      "What is the status of EPIC, diploma/internship documents, and certificates of good standing?",
      "Example: EPIC report complete; good standing sent by every regulator",
      "EPIC is a route-specific registration process, not a selection score.",
      true,
      [
        "EPIC instructions for Ireland",
        "https://www.ecfmg.org/psv/instructions-ireland.html",
      ]
    ),
    factor(
      "clinical_electives",
      "Clinical experience, electives, and specialty training",
      "What internship, postgraduate work, Irish experience, electives, or logbook evidence do you have?",
      "Example: 2 years medicine; 3 electives; procedures and supervisor evidence recorded",
      "Only named programme criteria should turn this into a requirement.",
      false,
      [
        "Postgraduate Medical Training Ireland",
        "https://www.postgraduatemedicaltraining.ie/",
      ]
    ),
    factor(
      "research_references",
      "Research and references",
      "What research, publications, audits, teaching, and references can you document?",
      "Example: 2 publications; 1 audit; 3 references with current dates",
      "No country-wide official weighting exists for these factors.",
      false,
      [
        "RCPI Basic Specialist Training entry guidance",
        "https://www.rcpi.ie/Learn-and-Develop/Training-Programmes/Basic-Specialist-Training/Entry-Guidance-and-Advice",
      ]
    ),
    factor(
      "registration",
      "Medical Council registration status",
      "What is your current Irish Medical Council registration division and application status?",
      "Example: Trainee Specialist registration application submitted; no outstanding documents",
      "Registration is required to practise but does not guarantee training or employment.",
      true,
      COMMON.ireland
    ),
    factor(
      "program_visa",
      "Named programme and work authorization",
      "Have you checked the training body, intake, programme criteria, visa, and employment-permit route?",
      "Example: RCPI intake checked; employment permit route confirmed with employer",
      "Ireland has multiple postgraduate bodies and programme-specific criteria.",
      true,
      [
        "Irish doctors employment permits",
        "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/doctors/",
      ]
    ),
  ],
};

export const READINESS_STATUS_LABELS: Record<ReadinessStatus, string> = {
  verified: "Verified",
  "in-progress": "In progress",
  "not-met": "Not met",
  unknown: "Unknown",
  "not-applicable": "Not applicable",
};

function genericFactors(countryId: string): ReadinessFactor[] {
  const country = countries.find(item => item.id === countryId);
  const source: readonly [string, string] = [
    country?.licensingBody ||
      `${country?.name || "Destination"} licensing authority`,
    country?.officialAuthorityUrl || "https://www.who.int/",
  ];
  return [
    factor(
      "qualification",
      "Medical qualification and eligibility",
      "What is the status of your medical degree, school recognition, graduation date, and internship?",
      "Example: Degree complete; school recognized; internship documented",
      "Confirm the exact degree and eligibility rules with the destination authority.",
      true,
      source
    ),
    factor(
      "language",
      "Language evidence",
      "What accepted language evidence do you have for this destination and cycle?",
      "Example: Accepted test passed; component scores and expiry recorded",
      "Enter the test, component scores, validity, and any official exemption.",
      true,
      source
    ),
    factor(
      "licensing",
      "Licensing examinations and registration",
      "Which licensing exams, registration steps, or authority assessments have you completed?",
      "Example: Registration route selected; required exam passed; application submitted",
      "Requirements vary by country, region, specialty, and applicant route.",
      true,
      source
    ),
    factor(
      "credentials",
      "Credential verification and good standing",
      "Are your primary-source credentials, identity, translations, and good-standing documents ready?",
      "Example: Primary-source verification complete; good-standing letters current",
      "Mark only documents verified by the relevant authority as verified.",
      true,
      source
    ),
    factor(
      "clinical",
      "Clinical experience and electives",
      "What recent clinical experience, specialty exposure, and electives can you document?",
      "Example: 24 months postgraduate work; 3 specialty electives",
      "Record programme-specific requirements separately; do not treat electives as universally required.",
      false,
      source
    ),
    factor(
      "research",
      "Research and references",
      "What research, publications, teaching, audits, and references can you document?",
      "Example: 2 publications; 1 audit; 3 current references",
      "These are competitive context unless the named programme publishes them as requirements.",
      false,
      source
    ),
    factor(
      "programme",
      "Specialty/programme fit",
      "Which specialty, institution, cycle, and current programme requirements have you checked?",
      "Example: 2027 programme page checked for exams, experience, documents, and deadlines",
      "Do not generalize one programme's criteria to an entire country.",
      true,
      source
    ),
    factor(
      "visa",
      "Work authorization and visa",
      "What work authorization or sponsorship route applies to your target role?",
      "Example: Employer sponsorship route confirmed; restrictions recorded",
      "Visa feasibility is separate from registration and does not predict selection.",
      true,
      source
    ),
  ];
}

export function readinessFactorsFor(profile: Profile): ReadinessFactor[] {
  const country = profile.targetCountries[0]?.trim().toLowerCase();
  const countryId =
    country === "united states"
      ? "usa"
      : country === "united kingdom"
        ? "uk"
        : country;
  if (!countryId) return [];
  const factors =
    RESIDENCY_READINESS_FACTORS[countryId] || genericFactors(countryId);
  return factors.map(item => ({ ...item, key: `${countryId}-${item.key}` }));
}

export function readinessScore(
  profile: Profile,
  factors = readinessFactorsFor(profile)
): ReadinessScore {
  const applicable = factors.filter(
    factor => profile.residencyEvidenceStatuses[factor.key] !== "not-applicable"
  );
  const verified = applicable.filter(
    factor => profile.residencyEvidenceStatuses[factor.key] === "verified"
  ).length;
  const inProgress = applicable.filter(
    factor => profile.residencyEvidenceStatuses[factor.key] === "in-progress"
  ).length;
  const blockers = factors
    .filter(
      factor =>
        factor.official &&
        ["not-met", "unknown"].includes(
          profile.residencyEvidenceStatuses[factor.key] || "unknown"
        )
    )
    .map(factor => factor.label);
  const gates = factors.filter(factor => factor.official);
  const competitive = factors.filter(factor => !factor.official);
  return {
    percentage: applicable.length
      ? Math.round(((verified + inProgress * 0.5) / applicable.length) * 100)
      : 0,
    verified,
    inProgress,
    total: applicable.length,
    gatesMet: gates.filter(
      factor => profile.residencyEvidenceStatuses[factor.key] === "verified"
    ).length,
    gatesTotal: gates.length,
    competitiveDocumented: competitive.filter(
      factor => profile.residencyEvidenceStatuses[factor.key] === "verified"
    ).length,
    competitiveTotal: competitive.length,
    blockers,
  };
}

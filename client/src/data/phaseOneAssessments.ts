import type { Profile } from "../contexts/AppContext";
import specialties from "./specialties.json";

export type EligibilityStatus =
  | "verified"
  | "completed"
  | "in-progress"
  | "missing"
  | "not-applicable"
  | "needs-verification";

export const ELIGIBILITY_STATUS_LABELS: Record<EligibilityStatus, string> = {
  verified: "Verified",
  completed: "Completed",
  "in-progress": "In progress",
  missing: "Missing",
  "not-applicable": "Not applicable",
  "needs-verification": "Needs verification",
};

export interface EligibilityRequirement {
  key: string;
  label: string;
  description: string;
  mandatory: boolean;
  sourceLabel: string;
  sourceUrl: string;
}

export interface EligibilityResult {
  status: "eligible" | "not-yet-eligible" | "eligibility-uncertain" | "not-assessed";
  verified: number;
  completed: number;
  incomplete: number;
  blockers: EligibilityRequirement[];
  needsVerification: EligibilityRequirement[];
  totalApplicable: number;
}

export type CompetitivenessBand =
  | "insufficient-data"
  | "developing"
  | "moderate"
  | "strong"
  | "very-strong";

export const COMPETITIVENESS_LABELS: Record<CompetitivenessBand, string> = {
  "insufficient-data": "Insufficient data",
  developing: "Developing",
  moderate: "Moderate",
  strong: "Strong",
  "very-strong": "Very strong",
};

export interface CompetitivenessFactor {
  key: string;
  label: string;
  description: string;
  signal: "strong" | "partial" | "missing";
}

const sources = {
  usa: ["ECFMG certification pathways", "https://www.ecfmg.org/certification-pathways/"],
  uk: ["GMC registration guidance", "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/before-you-apply-guide-for-doctors"],
  australia: ["Medical Board of Australia IMGs", "https://www.medicalboard.gov.au/Registration/International-Medical-Graduates.aspx"],
  canada: ["CaRMS R-1 eligibility", "https://www.carms.ca/match/r-1-main-residency-match/eligibility-criteria/"],
  germany: ["Make it in Germany: physicians", "https://www.make-it-in-germany.com/en/working-in-germany/job-search-application/professions-in-demand/physicians"],
  ireland: ["Medical Council of Ireland", "https://www.medicalcouncil.ie/registration-applications/first-time-applicants/"],
} as const;

const countryId = (profile: Profile) => {
  const value = profile.targetCountries[0]?.trim().toLowerCase();
  return value === "united states" ? "usa" : value === "united kingdom" ? "uk" : value;
};

const requirement = (
  key: string,
  label: string,
  description: string,
  mandatory: boolean,
  source: readonly [string, string]
): EligibilityRequirement => ({ key, label, description, mandatory, sourceLabel: source[0], sourceUrl: source[1] });

export function eligibilityRequirementsFor(profile: Profile): EligibilityRequirement[] {
  const id = countryId(profile);
  if (!id || !(id in sources)) return [];
  const source = sources[id as keyof typeof sources];
  const common = [
    requirement("degree", "Medical degree and graduation status", "Your medical qualification and graduation stage must be documented for the selected route.", true, source),
    requirement("internship", "Internship or accepted clinical experience", "Confirm that your internship and clinical experience meet the route’s stated requirements.", true, source),
    requirement("language", "Accepted language evidence", "Confirm the language test, score, validity, or exemption accepted by the authority or programme.", true, source),
    requirement("credentials", "Primary-source credential verification", "Verify the degree, identity, translations, and good-standing documents where required.", true, source),
    requirement("registration", "Licensing or registration pathway", "Identify the correct regulator route and confirm any required assessment or registration steps.", true, source),
    requirement("programme", "Programme-specific eligibility", "Check graduation year, specialty, attempts, experience, status, and documents against named programmes.", true, source),
    requirement("visa", "Work authorization or visa route", "Confirm that you can legally train and work in the selected destination and programme.", true, source),
  ];
  if (id === "usa") {
    return [
      requirement("school", "ECFMG school eligibility", "Confirm your medical school and graduation year have an applicable ECFMG pathway.", true, source),
      requirement("usmle", "Required USMLE examinations", "Confirm the required USMLE examinations and attempt history for your intended route.", true, source),
      requirement("ecfmg", "ECFMG certification pathway", "Confirm the applicable ECFMG Pathway, OET, and certification requirements.", true, source),
      ...common,
    ];
  }
  if (id === "uk") {
    return [
      requirement("pmq", "Acceptable primary medical qualification", "Confirm your PMQ and the correct GMC registration route.", true, source),
      requirement("plab", "PLAB or accepted alternative route", "Confirm whether PLAB or another accepted route applies to your profile.", true, source),
      ...common,
    ];
  }
  if (id === "germany") {
    return [
      requirement("recognition", "Medical qualification recognition", "Confirm the responsible state authority and recognition route for your degree.", true, source),
      requirement("german", "German B2 and medical-language evidence", "Confirm the required general and medical German level for the selected state and role.", true, source),
      requirement("approbation", "Approbation or applicable permission", "Confirm the professional authorization needed before clinical work.", true, source),
      ...common,
    ];
  }
  return common;
}

const statusFor = (profile: Profile, key: string): EligibilityStatus => {
  const value = profile.eligibilityStatuses[key];
  return value || "needs-verification";
};

export function eligibilityResult(profile: Profile): EligibilityResult {
  const requirements = eligibilityRequirementsFor(profile);
  if (!requirements.length) {
    return { status: "not-assessed", verified: 0, completed: 0, incomplete: 0, blockers: [], needsVerification: [], totalApplicable: 0 };
  }
  const applicable = requirements.filter(item => statusFor(profile, item.key) !== "not-applicable");
  const verified = applicable.filter(item => statusFor(profile, item.key) === "verified").length;
  const completed = applicable.filter(item => statusFor(profile, item.key) === "completed").length;
  const blockers = applicable.filter(item => item.mandatory && statusFor(profile, item.key) === "missing");
  const needsVerification = applicable.filter(item => statusFor(profile, item.key) === "needs-verification");
  const inProgress = applicable.filter(item => statusFor(profile, item.key) === "in-progress");
  const status = blockers.length
    ? "not-yet-eligible"
    : verified === applicable.length
      ? "eligible"
      : verified + completed + inProgress.length === 0
        ? "not-assessed"
        : "eligibility-uncertain";
  return { status, verified, completed, incomplete: applicable.length - verified - completed, blockers, needsVerification, totalApplicable: applicable.length };
}

function includesAny(value: string, terms: string[]) {
  const lower = value.toLowerCase();
  return terms.some(term => lower.includes(term));
}

export function competitivenessFactorsFor(profile: Profile): CompetitivenessFactor[] {
  const specialty = specialties.find(item => item.name.toLowerCase() === profile.targetSpecialty.trim().toLowerCase());
  const evidence = `${profile.completedLicensingExams} ${profile.professionalQualifications}`.trim();
  const factors: CompetitivenessFactor[] = [
    { key: "exams", label: "Examination profile", description: "Documented relevant examinations, scores, dates, and attempts.", signal: includesAny(evidence, ["usmle", "plab", "amc", "mcc", "exam", "passed"]) ? "partial" : "missing" },
    { key: "experience", label: "Clinical and specialty experience", description: "Recent work and meaningful exposure related to the selected specialty.", signal: profile.graduationStatus === "Licensed doctor" || profile.professionalQualifications.length > 50 ? "partial" : "missing" },
    { key: "research", label: "Research, audit, or quality improvement", description: "Documented scholarly work relevant to the destination and specialty.", signal: includesAny(evidence, ["research", "publication", "audit", "quality improvement", "abstract"]) ? "partial" : "missing" },
    { key: "references", label: "References and supporting evidence", description: "Current references, portfolio evidence, teaching, and leadership where relevant.", signal: profile.professionalQualifications.length > 100 ? "partial" : "missing" },
    { key: "fit", label: `${specialty?.name || profile.targetSpecialty || "Specialty"} fit`, description: specialty ? `${specialty.name} is described as ${specialty.workStyle.toLowerCase()} with ${specialty.competitiveness.toLowerCase()} competitiveness in the current catalogue.` : "Add a specialty to assess specialty-specific fit.", signal: specialty ? "partial" : "missing" },
    { key: "timeline", label: "Graduation timing and application fit", description: "A realistic cycle, timeline, and programme list aligned with your graduation year.", signal: profile.residencyCycle || profile.careerTimeline ? "partial" : "missing" },
  ];
  return factors;
}

export function competitivenessBand(factors: CompetitivenessFactor[]): CompetitivenessBand {
  if (!factors.length || factors.filter(item => item.signal !== "missing").length < 2) return "insufficient-data";
  const present = factors.filter(item => item.signal === "strong").length;
  const partial = factors.filter(item => item.signal === "partial").length;
  if (present >= 4) return "very-strong";
  if (present >= 2 || partial >= 5) return "strong";
  if (partial >= 3) return "moderate";
  return "developing";
}

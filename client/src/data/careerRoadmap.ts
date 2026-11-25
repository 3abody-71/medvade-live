import countries from "./countries.json";
import specialties from "./specialties.json";
import type { Profile } from "../contexts/AppContext";

export type RoadmapRequirementStatus =
  | "completed"
  | "in-progress"
  | "not-started"
  | "not-applicable";

export interface RoadmapRequirement {
  id: string;
  title: string;
  detail: string;
  action: string;
  mandatory: boolean;
  sourceLabel: string;
  sourceUrl: string;
  dependency?: string;
  profileSignal?: "language" | "exam" | "qualification" | "graduation";
}

export interface RoadmapMilestone {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  requirements: RoadmapRequirement[];
}

export interface RoadmapModel {
  countryId: string;
  countryName: string;
  specialtyName: string;
  licensingBody: string;
  languageRequirement: string;
  officialAuthorityUrl: string;
  milestones: RoadmapMilestone[];
}

export const ROADMAP_STATUS_LABELS: Record<RoadmapRequirementStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  "not-started": "Not started",
  "not-applicable": "Not applicable",
};

const COUNTRY_AUTHORITY_OVERRIDES: Record<
  string,
  { body: string; language: string; url: string }
> = {
  usa: {
    body: "ECFMG and state medical boards",
    language:
      "English proficiency; confirm the accepted evidence for your route",
    url: "https://www.ecfmg.org/",
  },
  uk: {
    body: "General Medical Council (GMC)",
    language: "IELTS Academic or OET Medicine unless an exemption applies",
    url: "https://www.gmc-uk.org/registration-and-licensing/join-the-register/registration-applications",
  },
  australia: {
    body: "AHPRA and the Medical Board of Australia",
    language: "IELTS, OET, PTE Academic, or TOEFL iBT",
    url: "https://www.medicalboard.gov.au/Registration/International-Medical-Graduates.aspx",
  },
  canada: {
    body: "Medical Council of Canada and provincial colleges",
    language: "English or French proficiency, depending on province",
    url: "https://mcc.ca/credentials-and-services/pathways-for-international-medical-graduates/",
  },
  germany: {
    body: "The responsible state authority and medical chamber",
    language: "German language evidence; confirm the state-specific level",
    url: "https://www.anerkennung-in-deutschland.de/html/en/2688.php",
  },
  ireland: {
    body: "Medical Council of Ireland",
    language: "IELTS Academic or OET Medicine unless an exemption applies",
    url: "https://www.medicalcouncil.ie/registration-applications/",
  },
};

function countryIdFromProfile(profile: Profile) {
  const target = profile.targetCountries[0]?.trim().toLowerCase();
  return countries.find(
    country => country.id === target || country.name.toLowerCase() === target
  )?.id;
}

function specialtyNameFromProfile(profile: Profile) {
  const target = profile.targetSpecialty.trim().toLowerCase();
  const match = specialties.find(
    specialty =>
      specialty.id === target || specialty.name.toLowerCase() === target
  );
  return match?.name || profile.targetSpecialty.trim();
}

function sourceFor(countryId: string) {
  const country = countries.find(item => item.id === countryId);
  const override = COUNTRY_AUTHORITY_OVERRIDES[countryId];
  return {
    body:
      override?.body ||
      country?.licensingBody ||
      "Destination licensing authority",
    language:
      override?.language ||
      country?.languageRequirement ||
      "Confirm the required language evidence with the official authority",
    url:
      override?.url || country?.officialAuthorityUrl || "https://www.who.int/",
  };
}

export function getRoadmapProfileGaps(profile: Profile) {
  const gaps: string[] = [];
  if (!profile.targetCountries[0]) gaps.push("target destination country");
  if (!profile.targetSpecialty.trim()) gaps.push("desired specialty");
  if (!profile.graduationStatus) gaps.push("current educational stage");
  if (!profile.languageProficiency) gaps.push("language proficiency");
  if (!profile.currentCountry.trim()) gaps.push("current country of education");
  return gaps;
}

export function buildRoadmap(profile: Profile): RoadmapModel | null {
  const countryId = countryIdFromProfile(profile);
  const specialtyName = specialtyNameFromProfile(profile);
  if (!countryId || !specialtyName || getRoadmapProfileGaps(profile).length > 0)
    return null;
  const country = countries.find(item => item.id === countryId)!;
  const source = sourceFor(countryId);
  const prefix = `${countryId}-${specialtyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const req = (
    id: string,
    title: string,
    detail: string,
    action: string,
    mandatory = true,
    extra: Partial<RoadmapRequirement> = {}
  ): RoadmapRequirement => ({
    id: `${prefix}-${id}`,
    title,
    detail,
    action,
    mandatory,
    sourceLabel: source.body,
    sourceUrl: source.url,
    ...extra,
  });
  return {
    countryId,
    countryName: country.name,
    specialtyName,
    licensingBody: source.body,
    languageRequirement: source.language,
    officialAuthorityUrl: source.url,
    milestones: [
      {
        id: `${prefix}-foundation`,
        number: 1,
        title: "Foundation documents",
        shortTitle: "Foundation",
        description:
          "Make your medical education and current stage legible to the destination authority.",
        requirements: [
          req(
            "degree",
            "Primary medical qualification",
            `Confirm the degree, institution, graduation date, and country of education that the ${source.body} will assess.`,
            "Gather your degree certificate and medical-school records.",
            true,
            { profileSignal: "graduation" }
          ),
          req(
            "internship",
            "Internship and clinical rotations",
            "Document internship dates, hospital information, rotations, and professional standing where the route requires them.",
            "Collect internship completion evidence and rotation records."
          ),
        ],
      },
      {
        id: `${prefix}-language`,
        number: 2,
        title: "Language evidence",
        shortTitle: "Language",
        description: `Match your language evidence to the destination route: ${source.language}.`,
        requirements: [
          req(
            "language",
            "Accepted language evidence",
            `The current profile says your proficiency is ${profile.languageProficiency}. Confirm whether that level and evidence are accepted for your exact route.`,
            "Record your test, exemption, or next preparation action.",
            true,
            {
              profileSignal: "language",
              dependency:
                "May depend on education history, test validity, and the destination authority's exemption rules.",
            }
          ),
          req(
            "communication",
            "Clinical communication readiness",
            "Plan how you will demonstrate safe communication with patients, colleagues, and examiners in the destination system.",
            "Write down the clinical communication practice you will complete.",
            false
          ),
        ],
      },
      {
        id: `${prefix}-licensing`,
        number: 3,
        title: "Licensing examinations",
        shortTitle: "Licensing",
        description:
          "Identify the examinations or accepted alternatives before paying fees or booking travel.",
        requirements: [
          req(
            "route",
            "Confirm the IMG licensing route",
            `Use the official ${source.body} guidance to determine the route for your medical-school and graduation profile.`,
            "Open the official route page and record the route that applies to you.",
            true
          ),
          req(
            "exam",
            "Required examination(s)",
            "List only examinations that the official route confirms for your circumstances; requirements can vary by country, qualification, and exemption.",
            "Add completed exams to your profile and create a preparation plan for remaining exams.",
            true,
            {
              profileSignal: "exam",
              dependency:
                "Can depend on nationality, medical school, graduation date, internship, and prior registration.",
            }
          ),
        ],
      },
      {
        id: `${prefix}-verification`,
        number: 4,
        title: "Credential verification",
        shortTitle: "Verification",
        description:
          "Prepare primary-source verification and the documents needed for a defensible application.",
        requirements: [
          req(
            "identity",
            "Identity and good-standing documents",
            "Prepare identity, police-clearance, health, registration, and good-standing documents only as required by the official route.",
            "Create a document checklist and note expiry dates."
          ),
          req(
            "qualification",
            "Verified professional qualifications",
            "Record specialist certificates, registration history, and other qualifications that may affect eligibility.",
            "Add relevant qualifications to your profile and request verification where required.",
            false,
            { profileSignal: "qualification" }
          ),
        ],
      },
      {
        id: `${prefix}-registration`,
        number: 5,
        title: "Medical registration",
        shortTitle: "Registration",
        description: `Complete the ${source.body} application sequence before practising medicine.`,
        requirements: [
          req(
            "application",
            "Registration application",
            "Follow the official application procedure, required forms, identity checks, and document submission instructions.",
            "Save the official application page and break it into dated actions."
          ),
          req(
            "eligibility",
            "Eligibility decision",
            "Keep a written record of any missing evidence, conditions, exemptions, or additional assessment requested by the authority.",
            "Respond to authority requests and store the decision with your roadmap."
          ),
        ],
      },
      {
        id: `${prefix}-employment`,
        number: 6,
        title: "Employment pathway",
        shortTitle: "Employment",
        description: `Translate registration into a realistic ${specialtyName} job or supervised role in ${country.name}.`,
        requirements: [
          req(
            "role",
            "Eligible hospital or supervised role",
            "Confirm the role's registration, supervision, immigration, and training requirements before applying.",
            "Create a shortlist of roles and verify each role with the employer or programme."
          ),
          req(
            "applications",
            "Job applications and evidence",
            "Prepare a focused CV, references, clinical evidence, and specialty-specific application documents.",
            `Prepare your first ${specialtyName} application package.`,
            false
          ),
        ],
      },
      {
        id: `${prefix}-specialty`,
        number: 7,
        title: `${specialtyName} training`,
        shortTitle: "Specialty",
        description:
          "Move from entry eligibility to specialty training with the destination programme's current criteria.",
        requirements: [
          req(
            "program",
            "Specialty programme criteria",
            `Check the official programme or institution criteria for ${specialtyName}; selection, rotations, exams, and timelines are programme-specific.`,
            "Bookmark the relevant programme page and list its mandatory criteria."
          ),
          req(
            "timeline",
            "Career timeline review",
            `Your stated timeline is ${profile.careerTimeline || "not yet set"}. Revisit it after confirming the route, eligibility, and competition.`,
            "Set a realistic next review date and update the timeline after new evidence.",
            false
          ),
        ],
      },
    ],
  };
}

export function inferredRequirementStatus(
  requirement: RoadmapRequirement,
  profile: Profile
): RoadmapRequirementStatus {
  if (
    requirement.profileSignal === "language" &&
    profile.languageProficiency.toLowerCase() === "advanced / fluent"
  )
    return "completed";
  if (
    requirement.profileSignal === "exam" &&
    profile.completedLicensingExams.trim()
  )
    return "completed";
  if (
    requirement.profileSignal === "qualification" &&
    profile.professionalQualifications.trim()
  )
    return "completed";
  if (
    requirement.profileSignal === "graduation" &&
    ["Graduate, not yet licensed", "Licensed doctor"].includes(
      profile.graduationStatus
    )
  )
    return "completed";
  return "not-started";
}

export function progressFor(roadmap: RoadmapModel, profile: Profile) {
  const requirements = roadmap.milestones.flatMap(
    milestone => milestone.requirements
  );
  const statuses = requirements.map(
    requirement =>
      profile.roadmapRequirementStatuses[requirement.id] ||
      inferredRequirementStatus(requirement, profile)
  );
  const counted = statuses.filter(status => status !== "not-applicable");
  const completed = counted.filter(status => status === "completed").length;
  return {
    total: counted.length,
    completed,
    percentage: counted.length
      ? Math.round((completed / counted.length) * 100)
      : 0,
  };
}

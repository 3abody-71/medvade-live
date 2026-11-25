import {
  ArrowRight,
  Languages,
  TrainFront,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export const ukPageContents = [
  { href: "why-uk", label: "Why choose the UK?" },
  { href: "requirements-uk", label: "IMG requirements" },
  { href: "pathway-uk", label: "PLAB, MRCP, and pathway" },
  { href: "life-uk", label: "Salaries and work-life" },
  { href: "specialties-uk", label: "Specialty difficulty" },
  { href: "hospitals-uk", label: "Nine important hospitals" },
  { href: "passport-uk", label: "Passport and settlement" },
];

export type UkReason = { title: string; body: string; icon: LucideIcon };
export type UkRequirement = { title: string; items: string[] };
export type UkStage = [number: string, title: string, body: string];
export type UkExamDetail = {
  name: string;
  label: string;
  format: string;
  content: string;
  locations: string;
  url: string;
};
export type UkPassportStep = [title: string, body: string];
export type UkSalaryBand = [role: string, pay: string, note: string];
export type UkHospital = {
  name: string;
  city: string;
  body: string;
  image: string;
  url: string;
};

export const reasons: UkReason[] = [
  {
    title: "Organised training",
    body: "The NHS uses a recognisable sequence: registration, service posts, foundation-equivalent experience, specialty recruitment, and certificate of completion of training (CCT).",
    icon: TrainFront,
  },
  {
    title: "English-language practice",
    body: "Clinical work, teaching, documentation, and exams are conducted in English, so there is no second-language requirement like the German language pathway.",
    icon: Languages,
  },
  {
    title: "Portable training",
    body: "GMC registration, NHS experience, and Royal College qualifications are widely understood by employers and training systems around the world.",
    icon: Trophy,
  },
  {
    title: "A more direct route than North America",
    body: "For many IMGs, PLAB and GMC registration can lead to paid NHS work without the USMLE–residency match sequence or Canada’s province-specific IMG bottlenecks. It is easier in relative terms, not easy.",
    icon: ArrowRight,
  },
];

export const requirements: UkRequirement[] = [
  {
    title: "English evidence",
    items: [
      "IELTS Academic: normally 7.5 overall with at least 7.0 in each component.",
      "OET Medicine: normally a B in each component; check the GMC’s current combination rules.",
      "The GMC may also accept other evidence, such as a qualifying UK job offer or primary medical qualification, in defined circumstances.",
    ],
  },
  {
    title: "Primary qualification and verification",
    items: [
      "A primary medical qualification that meets GMC criteria.",
      "Primary-source verification through the route required by the GMC/ECFMG before registration.",
      "Passport, identity documents, certificates, translations, and a complete five-year activity history.",
    ],
  },
  {
    title: "Internship and professional standing",
    items: [
      "For full registration after PLAB, an acceptable internship is normally required; the GMC assesses its rotations and supervision.",
      "Certificate of good standing from each relevant medical regulator.",
      "Fitness-to-practise declarations and evidence of recent clinical work where required.",
    ],
  },
  {
    title: "Registration route",
    items: [
      "PLAB 1 and PLAB 2 are the common IMG route to full GMC registration.",
      "An acceptable postgraduate qualification, including some Royal College qualifications such as MRCP (UK), may support another full-registration route.",
      "Registration with a licence to practise is separate from immigration permission and employment eligibility.",
    ],
  },
];

export const stages: UkStage[] = [
  [
    "1",
    "Confirm eligibility",
    "Check your medical school, internship pattern, English evidence, passport, and primary-source verification requirements on the GMC website.",
  ],
  [
    "2",
    "Pass English and PLAB 1",
    "PLAB 1 is a written single-best-answer examination. Prepare around UK clinical guidance, ethics, communication, and safe practice.",
  ],
  [
    "3",
    "Pass PLAB 2",
    "PLAB 2 is a practical clinical and communication examination held in the UK. Plan travel, documentation, and a realistic revision schedule.",
  ],
  [
    "4",
    "Apply for GMC registration",
    "After both parts and the remaining documents are ready, apply through GMC Online for full registration with a licence to practise.",
  ],
  [
    "5",
    "Get the first NHS job",
    "Most IMGs begin in a locally employed doctor, trust-grade, clinical fellow, or specialty doctor role. Use NHS Jobs, BMJ Careers, and trust websites.",
  ],
  [
    "6",
    "Build the training portfolio",
    "Collect NHS references, audits, quality-improvement work, teaching, courses, publications, and evidence of capability while learning the local system.",
  ],
  [
    "7",
    "Apply through Oriel",
    "Apply for the specialty and region that fit your experience. Some programmes are run-through; others are uncoupled and involve core followed by higher specialty training.",
  ],
];

export const examDetails: UkExamDetail[] = [
  {
    name: "PLAB 1",
    label: "Written licensing exam",
    format:
      "180 single-best-answer questions in 3 hours. Each question has five answer options and starts with a short clinical scenario.",
    content:
      "Tests the applied knowledge, clinical reasoning, ethics, communication, and safe-practice level expected of a doctor beginning the second year of the UK Foundation Programme (FY2).",
    locations:
      "Available in the UK and in a number of international countries. The GMC shows the current cities and dates inside GMC Online, so availability can change by diet.",
    url: "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/plab/a-guide-to-the-plab-test",
  },
  {
    name: "PLAB 2",
    label: "Practical OSCE",
    format:
      "16 clinical scenarios, each lasting 8 minutes, designed to reflect real-life settings such as consultations and acute-ward encounters.",
    content:
      "Assesses clinical examination, communication, history-taking, explaining and planning management, professionalism, patient safety, and the ability to deal with difficult or urgent situations.",
    locations:
      "Held at the GMC clinical assessment centre in Manchester, United Kingdom. PLAB 2 is not offered overseas, so international candidates must plan travel and any required visitor permission.",
    url: "https://www.gmc-uk.org/registration-and-licensing/join-our-registers/plab/plab-2-guide",
  },
  {
    name: "MRCP (UK) Part 1",
    label: "Physician knowledge / written",
    format:
      "Two computer-based papers, 3 hours each, with 100 best-of-five questions per paper; 200 questions in total and no negative marking.",
    content:
      "Covers clinical sciences and common or important disorders across areas such as cardiology, respiratory, renal, neurology, infectious diseases, endocrinology, gastroenterology, rheumatology, haematology, and clinical pharmacology.",
    locations:
      "Computer-based at UK and international test centres. The Federation publishes the current centre list and may change delivery arrangements by exam diet.",
    url: "https://www.thefederation.uk/examinations/part-1/format",
  },
  {
    name: "MRCP (UK) Part 2 Written",
    label: "Applied medicine / written",
    format:
      "Two computer-based papers, 3 hours each, with 100 best-of-five questions per paper; 200 questions in total and no negative marking.",
    content:
      "Questions may include clinical photographs, pathology, ECGs, X-rays, CT, MRI, echocardiograms, and investigation results. The focus is diagnosis, investigation, management, prognosis, and clinical problem-solving across the medical specialties.",
    locations:
      "Available at UK and international test centres listed by the Federation of the Royal Colleges of Physicians of the UK.",
    url: "https://www.thefederation.uk/examinations/part-2/format",
  },
  {
    name: "MRCP (UK) PACES",
    label: "Clinical examination",
    format:
      "Five clinical stations, eight patient or surrogate encounters, and about 125 minutes including the changeover periods.",
    content:
      "Assesses physical examination, identifying signs, clinical communication, differential diagnosis, clinical judgement, managing patient concerns, and maintaining patient welfare. Encounters include communication, respiratory, cardiovascular, neurological, abdominal, and consultation stations.",
    locations:
      "Run in UK clinical centres and selected international centres, including locations across the Middle East, South Asia, Africa, Asia-Pacific, and the Caribbean. Places and centres vary by diet.",
    url: "https://www.thefederation.uk/examinations/paces/format",
  },
];

export const passportSteps: UkPassportStep[] = [
  [
    "Start UK medical work",
    "A GMC licence and an NHS job do not automatically create a route to citizenship. Most IMGs first hold a work visa such as Skilled Worker, subject to the rules in force.",
  ],
  [
    "Usually around 5 years",
    "If eligible, a qualifying work route may lead to indefinite leave to remain (ILR) after the required qualifying residence period. This is not automatic: salary, sponsorship, continuous residence, absences, English, and other requirements can matter.",
  ],
  [
    "After ILR",
    "For the standard naturalisation route, GOV.UK normally requires 5 years of UK residence and 12 months holding ILR or settled status. You usually need the Life in the UK Test, English-language evidence, good character, and the required residence and absence limits.",
  ],
  [
    "Citizenship decision",
    "A naturalisation application usually receives a decision within 6 months, although some cases take longer. Approval is followed by a citizenship ceremony and a certificate of naturalisation.",
  ],
  [
    "British passport",
    "Citizenship and a passport are separate. After receiving the naturalisation certificate, apply for the first British passport. HM Passport Office says you will usually receive it within 3 weeks after it receives the required documents, although cases needing more information can take longer.",
  ],
];

export const salaries: UkSalaryBand[] = [
  [
    "Foundation training",
    "£41,226–£47,610",
    "Basic salary range in England from 1 April 2026; nights, weekends, on-call, and other supplements can increase total pay.",
  ],
  [
    "Specialist training",
    "£55,355–£77,348",
    "Basic salary range in England from 1 April 2026 for doctors in specialist training.",
  ],
  [
    "Specialty doctor",
    "£63,696–£102,689",
    "Basic salary range in England from 1 April 2026; grade, experience, duties, and supplements matter.",
  ],
  [
    "Consultant",
    "£113,565–£150,569",
    "Basic salary range in England from 1 April 2026, before extra responsibilities or private work.",
  ],
];

export const friendly: string[] = [
  "General Practice",
  "Psychiatry",
  "Internal Medicine / Acute Medicine",
  "Geriatric Medicine",
  "Emergency Medicine",
  "Histopathology and other pathology routes",
];
export const competitive: string[] = [
  "Neurosurgery",
  "Cardiothoracic Surgery",
  "Plastic Surgery",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Paediatric Surgery",
  "Orthopaedic Surgery",
];

export const hospitals: UkHospital[] = [
  {
    name: "Guy’s and St Thomas’ NHS Foundation Trust",
    city: "London",
    body: "Large teaching trust with major tertiary, specialist, and academic services.",
    image: "/assets/uk/hospitals/guys-hospital.jpg",
    url: "https://www.guysandstthomas.nhs.uk/",
  },
  {
    name: "University College London Hospitals (UCLH)",
    city: "London",
    body: "Academic centre known for complex medicine, surgery, cancer, and research.",
    image: "/assets/uk/hospitals/uclh.jpg",
    url: "https://www.uclh.nhs.uk/",
  },
  {
    name: "Imperial College Healthcare NHS Trust",
    city: "London",
    body: "Major teaching trust linked to Imperial College London and specialist hospitals.",
    image: "/assets/uk/hospitals/imperial-st-marys.jpg",
    url: "https://www.imperial.nhs.uk/",
  },
  {
    name: "King’s College Hospital NHS Foundation Trust",
    city: "London",
    body: "Tertiary centre with strong liver, neurosciences, maternity, and trauma services.",
    image: "/assets/uk/hospitals/kings-college.jpg",
    url: "https://www.kch.nhs.uk/",
  },
  {
    name: "Oxford University Hospitals NHS Foundation Trust",
    city: "Oxford",
    body: "University hospital group with broad tertiary care and research exposure.",
    image: "/assets/uk/hospitals/oxford.jpg",
    url: "https://www.ouh.nhs.uk/",
  },
  {
    name: "Cambridge University Hospitals NHS Foundation Trust",
    city: "Cambridge",
    body: "Academic centre including Addenbrooke’s Hospital and specialist services.",
    image: "/assets/uk/hospitals/cambridge.jpg",
    url: "https://www.cuh.nhs.uk/",
  },
  {
    name: "Manchester University NHS Foundation Trust",
    city: "Manchester",
    body: "One of the UK’s largest trusts, spanning major adult and paediatric services.",
    image: "/assets/uk/hospitals/manchester.jpg",
    url: "https://mft.nhs.uk/",
  },
  {
    name: "University Hospitals Birmingham NHS Foundation Trust",
    city: "Birmingham",
    body: "Large multi-site teaching trust including Queen Elizabeth Hospital Birmingham.",
    image: "/assets/uk/hospitals/birmingham.jpg",
    url: "https://www.uhb.nhs.uk/",
  },
  {
    name: "University Hospitals Bristol and Weston NHS Foundation Trust",
    city: "Bristol / Weston",
    body: "Teaching trust with regional specialist, cardiac, paediatric, and surgical services.",
    image: "/assets/uk/hospitals/bristol.jpg",
    url: "https://www.uhbw.nhs.uk/",
  },
];

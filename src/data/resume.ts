import type {
  Certification,
  EducationItem,
  ExperienceItem,
  Profile,
  ShowcaseProject,
  SkillGroup,
  Stat,
  ThinkingStep,
  VolunteerItem,
} from "@/types";

/** Every word on the site, and the generated CV, comes from this file. */

export const profile: Profile = {
  name: "Priya Murkute",
  title: "QA Automation Engineer",
  location: "United Kingdom",
  email: "priyamurkute7@gmail.com",
  github: "https://github.com/Priya-Murkute",
  linkedin: "https://www.linkedin.com/in/priya-murkute-oct7",
  summary:
    "Three years automating test coverage for banking platforms at Wipro, then an MSc in Computer Science at Queen Mary while working part-time as a London-based SDET. I build frameworks that behave like real software — version-controlled, CI-integrated, and built to be inherited by whoever's on call after me.",
  headline: "QA Engineer at heart. Data Analyst by mindset.",
  tagline: "I test like an engineer, think like an analyst, and use data to solve problems.",
  keywords: ["QA Automation", "SDET", "Data Analytics"],
  cvPath: "Priya-Murkute-CV.pdf",
  yearsExperience: 3,
  /** CV only — the site routes contact through email and LinkedIn. */
  phone: "+44 7789 595457",
};

function handleFromUrl(url: string): string {
  return url.replace(/\/+$/, "").split("/").pop() ?? "";
}

/** Derived, so a changed URL can never leave a stale handle behind. */
export const githubHandle = handleFromUrl(profile.github);
export const linkedinHandle = handleFromUrl(profile.linkedin);

export const stats: Stat[] = [
  {
    value: 95,
    suffix: "%",
    label: "defect catch rate",
    note: "REST Assured and Postman folded into CI with Newman, at Wipro",
    signal: "pass",
  },
  {
    value: 50,
    prefix: "−",
    suffix: "%",
    label: "regression cycle time",
    note: "Selenium and WebdriverIO automation that made weekly releases possible",
    signal: "pass",
  },
  {
    value: 300,
    suffix: "+",
    label: "Gherkin scenarios authored",
    note: "Led BDD adoption with Cucumber to align testing with product requirements",
    signal: "pass",
  },
];

export const experience: ExperienceItem[] = [
  {
    role: "QA Automation Engineer (Part-time)",
    organisation: "Testing Info",
    location: "London",
    period: "Feb 2023 — Sept 2023",
    note: "Part-time QA work in London, running alongside the MSc below — hands-on API automation for a UK client while studying full-time.",
    bullets: [
      "Created and executed test cases and scenarios for web applications",
      "Ran functional, regression and integration testing",
      "Tested REST APIs with Postman and RestSharp",
      "Logged and tracked defects in Jira",
      "Worked with developers and product through Agile sprints",
      "Produced test reports and supported release validation",
    ],
  },
  {
    role: "Senior Project Engineer",
    organisation: "Wipro Technologies",
    location: "Pune, Maharashtra, India",
    period: "Oct 2021 — Sept 2022",
    honors: "Inspiring Performance Award",
    bullets: [
      "Led web and API automation initiatives (Selenium/Java, WebdriverIO, Postman) across a cross-functional Agile team on complex banking platforms",
      "Built API frameworks and integrated them into CI pipelines with Newman, contributing to a 95% defect catch rate in staging",
      "Ran RCA with developers to unblock bottlenecks and drive efficient defect resolution",
      "Documented end-to-end test artefacts — test plans, strategies, execution reports, automation logs",
      "Adopted BDD with Cucumber to improve requirement clarity within a CI/CD workflow",
      "Mentored junior testers, helping raise team capability",
    ],
  },
  {
    role: "Project Engineer",
    organisation: "Wipro Technologies",
    location: "Pune Area, India",
    period: "Oct 2019 — Oct 2021",
    bullets: [
      "Designed test scenarios and detailed test plans; executed functional and regression suites",
      "Applied SDLC and STLC best practices across delivery cycles",
      "Automated UI regression with Selenium, using XPath/CSS optimisation for stable locators",
      "Supported API automation with JSON-based REST API testing",
      "Worked directly with clients and stakeholders to keep testing cycles and requirements aligned",
      "Applied OOP concepts within automation modules to improve system efficiency",
    ],
  },
];

export const education: EducationItem[] = [
  {
    qualification: "MSc Computer Science",
    institution: "Queen Mary University of London",
    year: "2024",
  },
  {
    qualification: "BE Computer Engineering",
    institution: "R. H. Sapat College of Engineering, Nashik",
    year: "2019",
  },
  {
    qualification: "Diploma, Computer Engineering",
    institution: "Met's Bhujbal Knowledge City, Nashik",
    year: "2016",
  },
];

export const thinkingSteps: ThinkingStep[] = [
  { verb: "Test", line: "Find what can go wrong." },
  { verb: "Analyse", line: "Understand what the data is saying." },
  { verb: "Improve", line: "Turn findings into better solutions." },
];

/** Curated, unlike the live GitHub feed in Projects.tsx. */
export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "web-api-automation",
    title: "Web & API Test Automation",
    organisation: "Wipro Technologies · Testing Info",
    kind: "Professional work",
    summary:
      "Designed test cases, automated web testing and tested REST APIs while working with Agile teams.",
    tools: ["Selenium", "Java", "Postman", "Rest Assured"],
    track: "qa",
  },
  {
    id: "deloitte-data-analytics",
    title: "Deloitte Australia — Data Analytics Job Simulation",
    organisation: "Deloitte Australia",
    kind: "Job simulation",
    summary: "Analysed business data and created a Tableau dashboard to communicate findings.",
    tools: ["Excel", "Tableau", "Data Analysis"],
    track: "data",
  },
  {
    id: "tata-genai-analytics",
    title: "Tata Group — GenAI-Powered Data Analytics",
    organisation: "Tata Group",
    kind: "Job simulation",
    summary:
      "Explored data quality and risk indicators and developed a proposed predictive approach.",
    tools: ["EDA", "GenAI", "Predictive Modelling"],
    track: "data",
  },
];

/** From the LinkedIn profile. */
export const certifications: Certification[] = [
  { name: "Programming Foundations: Software Testing/QA", track: "qa" },
  { name: "Test Automation Foundations", track: "qa" },
  { name: "Postman Essential Training", track: "qa" },
  { name: "Skyscanner — Front-End Software Engineering Job Simulation", track: "qa" },
  { name: "Y Combinator — Working as a Software Engineer at a Start-Up Job Simulation", track: "qa" },
  { name: "Tata — GenAI Powered Data Analytics Job Simulation", track: "data" },
];

/** Kept separate from `experience` so it never reads as a paid role. */
export const volunteering: VolunteerItem[] = [
  {
    role: "Student Volunteer",
    organisation: "Quick Heal Foundation",
    location: "Nashik",
    period: "Jul 2017 — Sept 2017",
    summary:
      "Educated students on cybersecurity — phishing risks, email threats, authentication best practices, online banking safety and data protection.",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Testing types",
    items: [
      "Functional",
      "Regression",
      "Integration",
      "UAT",
      "Exploratory",
      "API",
    ],
  },
  {
    label: "Automation",
    items: [
      "Selenium WebDriver",
      "WebdriverIO",
      "C#",
      "Java",
      "TestNG",
      "Cucumber",
      "Page Object pattern",
    ],
  },
  {
    label: "API tooling",
    items: ["Postman", "Newman", "Rest Assured", "REST APIs", "JSON"],
  },
  {
    label: "Test & defect management",
    items: ["Jira", "Test case management", "Test reporting"],
  },
  {
    label: "Process",
    items: [
      "Agile (Scrum)",
      "SDLC",
      "STLC",
      "BDD / Gherkin modelling",
      "Cross-functional Team Leadership",
      "Sprint planning",
      "Retrospectives",
    ],
  },
  {
    /** SQL moved to Data & Analytics below, so it isn't listed twice. */
    label: "CI/CD & tooling",
    items: ["Jenkins", "Azure Pipelines", "GitHub", "Root cause analysis"],
  },
  {
    label: "Data & Analytics",
    items: [
      "SQL",
      "Python",
      "Excel",
      "Power BI",
      "Tableau",
      "EDA",
      "Data Quality",
      "Predictive Analytics",
      "Reporting",
    ],
  },
];

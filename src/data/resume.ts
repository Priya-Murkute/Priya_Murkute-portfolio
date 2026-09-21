import type {
  Certification,
  EducationItem,
  ExperienceItem,
  Profile,
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
    "QA Automation Engineer with 3+ years of experience across UI and API automation, including modernising legacy automation, building test frameworks from scratch, and uncovering application and API-level defects through exploratory testing. Recognised by Wipro for technical learning agility, API automation contribution, product understanding and identifying requirement gaps.",
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
    value: 60,
    suffix: "+",
    label: "Gherkin UI scenarios automated",
    note: "Written for the RGL page's UI framework, in WebdriverIO + TypeScript, at Wipro",
    signal: "pass",
  },
  {
    value: 30,
    suffix: "+",
    label: "API scenarios automated",
    note: "Critical Postman scenarios for Accounts and RGL: positive, negative and business-rule cases, run as part of regression",
    signal: "pass",
  },
  {
    value: 80,
    prefix: "~",
    suffix: "%",
    label: "recurring regression scenarios automated",
    note: "Legacy Ruby UI automation migrated to WebdriverIO + TypeScript",
    signal: "pass",
  },
  {
    value: 40,
    prefix: "~",
    suffix: "%",
    label: "less repetitive regression effort",
    note: "Manual regression effort saved during new feature and release validation",
    signal: "pass",
  },
];

export const experience: ExperienceItem[] = [
  {
    role: "QA Automation Engineer (SDET)",
    organisation: "Testing Info",
    location: "London",
    period: "Feb 2023 — Sept 2023",
    note: "QA work in London, running alongside the MSc below — hands-on API automation for a UK client while studying full-time.",
    cvBullets: [
      "Designed and executed functional, regression and integration tests for web applications, turning requirements into test cases and automation scenarios",
      "Automated UI regression with Selenium WebDriver using reusable page components, and tested REST APIs with Postman and RestSharp, covering payloads, status codes and negative scenarios",
      "Supported root-cause analysis with logs and API responses, and tracked defects in Jira through Agile sprints",
    ],
    bullets: [
      "Designed and executed functional, regression and integration test scenarios for web applications, translating requirements into practical test cases and automation scenarios",
      "Developed and maintained UI automation using Selenium WebDriver, applying reusable page components and automation practices to improve the repeatability of regression testing",
      "Performed API testing using Postman and RestSharp, validating REST endpoints, request/response payloads, status codes and negative scenarios",
      "Investigated test failures and application defects, using logs, API responses and test evidence to support root-cause analysis and give developers clear reproduction details",
      "Managed defects through Jira and collaborated with developers and product teams throughout Agile sprint cycles, supporting regression testing and release validation",
    ],
  },
  {
    role: "Senior QA Automation Tester — Charles Schwab, Accounts LOB",
    organisation: "Wipro Technologies",
    location: "Pune, Maharashtra, India",
    period: "Oct 2021 — Oct 2022",
    honors: ["Pleasure Working With You · Mar 2022", "Inspiring Performance Award · Jan 2022"],
    cvBullets: [
      "Led automation for the RGL page, building UI and API frameworks from scratch with WebdriverIO, TypeScript and Postman, including 60+ Gherkin UI scenarios",
      "Migrated legacy Ruby UI automation to WebdriverIO + TypeScript, automating ~80% of recurring regression scenarios and cutting repetitive manual regression effort by ~40%",
      "Built API automation from scratch for Accounts and RGL workflows: 30+ critical scenarios covering positive, negative and business-rule cases, run as part of regression",
      "Uncovered a critical Cost Method API vulnerability using Fiddler: a manipulated request could set security cost values to $0 despite UI restrictions; worked with developers on remediation and regression validation",
      "Performed functional, regression, exploratory, UI and API testing across sorting, exports and account workflows, uncovering defects, requirement gaps and edge cases before release",
      "Delivered structured knowledge-transfer sessions for new joiners on workflows, frameworks and testing practices; worked in Agile/Scrum with developers, BAs and QA using Jira, Git, Postman, Fiddler, WebdriverIO and TypeScript",
    ],
    bullets: [
      "Led automation for the RGL page, building UI and API automation frameworks from scratch with WebdriverIO, TypeScript and Postman, including 60+ Gherkin UI scenarios",
      "Migrated legacy Ruby UI automation to WebdriverIO + TypeScript, automating ~80% of recurring regression scenarios and cutting repetitive manual regression effort by ~40% during new feature and release validation",
      "Built API automation from scratch for Accounts and RGL workflows, covering 30+ critical scenarios, including positive, negative and business-rule validation, and integrated automated validation into the team's regression workflow",
      "Uncovered a critical Cost Method API vulnerability using Fiddler: a manipulated API request could set security cost values to $0 despite UI-level restrictions; worked with developers on remediation and regression validation",
      "Performed functional, regression, exploratory, UI and API testing across complex features including sorting, exports and account workflows, uncovering defects, requirement gaps and edge cases beyond standard user journeys before release",
      "Delivered structured knowledge-transfer sessions for new joiners, covering application workflows, automation frameworks, testing processes and team practices to speed their transition into the team",
      "Collaborated with developers, BAs and QA engineers in Agile/Scrum, contributing to sprint testing, defect triage, test planning and release validation using Jira, Git, Postman, Fiddler, WebdriverIO and TypeScript",
    ],
  },
  {
    role: "Project Engineer",
    organisation: "Wipro Technologies",
    location: "Pune/Pimpri-Chinchwad Area, India",
    period: "Oct 2019 — Oct 2021",
    cvBullets: [
      "Designed test scenarios and detailed test plans and executed functional and regression suites for enterprise financial applications, applying SDLC and STLC best practices",
      "Learned UI automation with Selenium using XPath/CSS optimisation for stable locators, applied OOP concepts in automation modules, and supported JSON-based REST API testing",
      "Joined daily stand-ups and retrospectives, working with developers, clients and stakeholders to keep requirements aligned, and learned the application's workflows quickly from senior colleagues and documentation",
    ],
    bullets: [
      "Applied my engineering knowledge and skills in industry: designed test scenarios and detailed test plans, and executed functional and regression suites for enterprise financial applications",
      "Learned UI automation with Selenium, using XPath/CSS optimisation for stable locators, and applied OOP concepts in automation modules to improve efficiency",
      "Supported API automation with JSON-based REST API testing",
      "Applied SDLC and STLC best practices, joined daily stand-ups and retrospectives, and onboarded quickly into a cross-functional team",
      "Worked with developers, clients and stakeholders to keep requirements and testing cycles aligned, learning the application's workflows quickly from senior colleagues and documentation",
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

/** From the LinkedIn profile. */
export const certifications: Certification[] = [
  { name: "Programming Foundations: Software Testing/QA", track: "qa" },
  { name: "Test Automation Foundations", track: "qa" },
  { name: "Postman Essential Training", track: "qa" },
  {
    name: "Tata — GenAI Powered Data Analytics Job Simulation",
    track: "data",
    url: "https://www.theforage.com/completion-certificates/ifobHAoMjQs9s6bKS/gMTdCXwDdLYoXZ3wG_ifobHAoMjQs9s6bKS_68cc5a9323fff83d6df1616c_1789668503034_completion_certificate.pdf",
  },
  {
    name: "Deloitte Australia — Data Analytics Job Simulation",
    track: "data",
    url: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_68cc5a9323fff83d6df1616c_1789425113978_completion_certificate.pdf",
  },
  {
    name: "Skyscanner — Front-End Software Engineering Job Simulation",
    track: "other",
    url: "https://www.theforage.com/completion-certificates/skoQmxqhtgWmKv2pm/km4rw7dihDr3etqom_skoQmxqhtgWmKv2pm_68cc5a9323fff83d6df1616c_1789687389437_completion_certificate.pdf",
  },
  {
    name: "Y Combinator — Working as a Software Engineer at a Start-Up Job Simulation",
    track: "other",
    url: "https://www.theforage.com/completion-certificates/3rjEZnibAFydi6noa/oRMogWRHeewqHzA7u_3rjEZnibAFydi6noa_68cc5a9323fff83d6df1616c_1789598462794_completion_certificate.pdf",
  },
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
      "TypeScript",
      "TestNG",
      "Cucumber",
      "Page Object pattern",
    ],
  },
  {
    label: "API tooling",
    items: ["Postman", "Newman", "Rest Assured", "Fiddler", "REST APIs", "JSON"],
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
    items: ["Jenkins", "GitHub", "Root cause analysis"],
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

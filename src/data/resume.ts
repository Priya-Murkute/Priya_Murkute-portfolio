import type {
  Assertion,
  EducationItem,
  ExperienceItem,
  Profile,
  SkillGroup,
  Stat,
  VolunteerItem,
  WorkItem,
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

/** Achievements written as Gherkin scenarios, for the hero's SpecSuite. */
export const assertions: Assertion[] = [
  {
    id: "a1",
    text: "Given a framework I built once, When I'm long gone, Then the team still swears by it",
    duration: 420,
  },
  {
    id: "a2",
    text: "Given an API that looks fine, When I go hunting for what breaks it, Then it doesn't break",
    duration: 300,
  },
  {
    id: "a3",
    text: "Given a bug marked fixed, When it comes back to check, Then it stays dead",
    duration: 360,
  },
  {
    id: "a4",
    text: "Given a bug hiding in the code, When the sprint's still open, Then I've already caught it",
    duration: 280,
  },
  {
    id: "a5",
    text: "Given a room deciding go or no-go, When they open the report, Then they just know",
    duration: 340,
  },
];

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

/** Résumé achievements, not side projects. Add here and the Work grid picks them up. */
export const work: WorkItem[] = [
  {
    id: "ci-api-automation",
    name: "API automation that lives in the pipeline",
    category: "API testing",
    organisation: "Wipro Technologies",
    summary:
      "Built REST Assured and Postman API frameworks and wired them into CI with Newman, so defects surfaced in staging instead of in front of a client.",
    detail:
      "The brief was banking platforms, where a missed edge case is expensive. I built the API framework, then made sure it actually ran — integrated into CI with Newman so every push got tested, not just the ones someone remembered to run manually. Alongside it: RCA with developers on the failures that did get through, and the test plans, execution reports and automation logs that made the whole thing auditable rather than tribal knowledge. I also mentored the junior testers picking the framework up after me.",
    metric: { value: 95, suffix: "%", label: "defect catch rate" },
    metricContext:
      "by integrating REST Assured and Postman into CI with Newman, catching failures in staging before they reached a release candidate",
    tools: ["REST Assured", "Postman", "Newman", "Java", "Jenkins"],
    status: "measured",
  },
  {
    id: "regression-velocity",
    name: "Regression fast enough for weekly releases",
    category: "Test automation",
    organisation: "Wipro Technologies",
    summary:
      "Led web automation with Selenium and WebdriverIO across a cross-functional Agile team, cutting regression cycle time enough to move the team to weekly releases.",
    detail:
      "A regression suite that takes three days to run doesn't get run three days before a release — it gets skipped. I rebuilt the web automation around Selenium and WebdriverIO with release readiness as the actual goal, not just coverage for its own sake, and that's what took the cycle time down far enough that the team could ship weekly instead of working around a slow suite.",
    metric: { value: 50, prefix: "−", suffix: "%", label: "regression cycle time" },
    metricContext:
      "by leading the Selenium/WebdriverIO web automation effort with release readiness as the explicit goal",
    tools: ["Selenium WebDriver", "WebdriverIO", "Java", "Agile / Scrum"],
    status: "measured",
  },
  {
    id: "bdd-adoption",
    name: "BDD adoption, 300+ scenarios in",
    category: "Process",
    organisation: "Wipro Technologies",
    summary:
      "Led the team's move to behaviour-driven testing with Cucumber, authoring 300+ Gherkin scenarios that tied test coverage directly to product requirements.",
    detail:
      "Selenium scripts don't tell a product manager anything. Gherkin does. I led the adoption of BDD with Cucumber specifically to close that gap — scenarios written in language a non-engineer could review meant ambiguity in requirements got caught before it became a defect, not after. 300+ scenarios later, it was the shared reference both engineering and product actually used.",
    metric: { value: 300, suffix: "+", label: "Gherkin scenarios authored" },
    metricContext:
      "by leading BDD adoption with Cucumber, so testing and product requirements shared one language",
    tools: ["Cucumber", "Gherkin", "BDD", "Java"],
    status: "measured",
  },
  {
    id: "ui-automation-framework",
    name: "UI automation built on Page Objects, not scripts",
    category: "Test automation",
    organisation: "Wipro Technologies",
    summary:
      "Automated UI regression for enterprise financial applications with Selenium, applying OOP and Page Object structure so the framework stayed maintainable as it grew.",
    detail:
      "Early automation work is where a framework either becomes an asset or a liability for whoever inherits it. I applied OOP concepts and XPath/CSS locator optimisation to keep the Selenium suite from becoming the usual pile of brittle, copy-pasted scripts, and paired it with JSON-based REST API testing so UI and API coverage grew together rather than as two disconnected efforts.",
    tools: ["Selenium WebDriver", "XPath / CSS", "JSON", "REST APIs", "OOP"],
    status: "measured",
  },
  {
    id: "release-validation",
    name: "Release validation you can sign off on",
    category: "API testing",
    organisation: "Testing Info",
    summary:
      "Hands-on API testing with Postman and RestSharp, feeding test reports directly into the go / no-go conversation.",
    detail:
      "Testing that nobody reads doesn't help anyone decide anything. Alongside the functional and API runs, I produced the reporting the release call actually used: what was covered, what failed, what was accepted as known, and what would need a hotfix. It made the sign-off a decision rather than a hope.",
    tools: ["Postman", "RestSharp", "C#", "Azure DevOps"],
    status: "measured",
  },
  {
    id: "agile-test-design",
    name: "Test design inside the sprint",
    category: "Functional testing",
    organisation: "Testing Info",
    summary:
      "Wrote and executed test cases and scenarios for web applications while embedded with developers and product, not after handover.",
    detail:
      "Being in refinement changes what testing costs. I wrote scenarios against acceptance criteria while they were still being argued about, which meant ambiguity got resolved in a conversation instead of in a defect ticket two weeks later. Functional, regression and integration passes ran on the same cadence as development.",
    tools: ["Test case design", "Cucumber", "Jira", "Exploratory testing"],
    status: "ongoing",
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

export const certifications: string[] = [
  "Programming Foundations: Software Testing/QA",
  "Test Automation Foundations",
  "Postman Essential Training",
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
      "NUnit",
      "TestNG",
      "Cucumber",
      "Page Object pattern",
    ],
  },
  {
    label: "API tooling",
    items: ["Postman", "Newman", "Rest Assured", "RestSharp", "REST APIs", "JSON"],
  },
  {
    label: "Test & defect management",
    items: ["Jira", "Azure DevOps", "Test case management", "Test reporting"],
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
    label: "CI/CD & data",
    items: ["Jenkins", "Azure Pipelines", "GitHub", "SQL", "Root cause analysis"],
  },
];

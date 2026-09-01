import type {
  Assertion,
  EducationItem,
  ExperienceItem,
  Profile,
  SkillGroup,
  Stat,
  WorkItem,
} from "@/types";

/**
 * Every word on the site comes from this file. Edit here, not in components.
 * The facts are straight from Priya's résumé; only the framing is editorial.
 */

export const profile: Profile = {
  name: "Priya Murkute",
  title: "QA Engineer",
  location: "United Kingdom",
  email: "priyamurkute7@gmail.com",
  github: "https://github.com/Priya-Murkute",
  linkedin: "https://www.linkedin.com/in/priya-murkute-oct7",
  summary:
    "Three years in enterprise QA at Wipro, then relocated to London for an MSc and UK-based SDET experience. Now building at the intersection of quality engineering and software development — writing tests, building tools, and caring about the whole system, not just the happy path.",
  cvPath: "Priya-Murkute-CV.pdf",
};

/** The hero's signature: her achievements written as the tests they'd have to pass. */
export const assertions: Assertion[] = [
  { id: "a1", text: "builds a framework the team keeps using", duration: 420 },
  { id: "a2", text: "covers the contract, not just the happy path", duration: 300 },
  { id: "a3", text: "closes defects so they stay closed", duration: 360 },
  { id: "a4", text: "finds it in the sprint, not after the release", duration: 280 },
  { id: "a5", text: "writes the report the release decision needs", duration: 340 },
];

export const stats: Stat[] = [
  {
    value: 50,
    prefix: "+",
    suffix: "%",
    label: "testing efficiency",
    note: "Selenium and Java framework built and maintained at Wipro",
    signal: "pass",
  },
  {
    value: 30,
    prefix: "+",
    suffix: "%",
    label: "API test coverage",
    note: "REST automation extended across services",
    signal: "pass",
  },
  {
    value: 15,
    prefix: "−",
    suffix: "%",
    label: "recurring defects",
    note: "Tracked, retested and closed rather than reopened",
    signal: "fail",
  },
];

/**
 * These are achievements from the résumé, not separate side projects — the
 * résumé doesn't list discrete personal projects. Add entries here and they
 * appear in the Work grid automatically.
 */
export const work: WorkItem[] = [
  {
    id: "automation-framework",
    name: "Automation framework, built to be inherited",
    category: "Test automation",
    organisation: "Wipro Technologies",
    summary:
      "Designed and maintained a Selenium and Java framework from scratch, then kept it healthy long enough for the rest of the team to rely on it.",
    detail:
      "The framework covered regression and functional suites for the product's core journeys. The work that made it stick wasn't the first version — it was the maintenance: keeping locators stable, keeping the suite fast enough to run every sprint, and keeping the failure output readable so a developer could act on a red build without asking me what it meant. It cut manual testing effort by half.",
    metric: { value: 50, prefix: "+", suffix: "%", label: "testing efficiency" },
    // TODO(Priya): confirm this framing before merging — worded from the
    // existing detail/tools above (TestNG suite, Jenkins), not a new claim.
    metricContext:
      "by building and maintaining the TestNG regression suite from scratch, kept fast and readable enough for the team to run every sprint",
    tools: ["Selenium WebDriver", "Java", "TestNG", "Jenkins"],
    status: "measured",
  },
  {
    id: "api-coverage",
    name: "API coverage past the happy path",
    category: "API testing",
    organisation: "Wipro Technologies",
    summary:
      "Extended automated REST coverage across services so contract and error-path failures surfaced in CI instead of in a release candidate.",
    detail:
      "Most of the existing API tests asserted a 200 and moved on. I added the cases that actually break: malformed payloads, missing required fields, auth failures, and response schema drift between environments. Coverage went up 30%, and the useful part was where the new failures showed up — in the pipeline, on the branch that caused them.",
    metric: { value: 30, prefix: "+", suffix: "%", label: "API coverage" },
    // TODO(Priya): confirm — worded from the existing detail (Rest Assured,
    // contract/error-path cases surfacing "in the pipeline"), not a new claim.
    metricContext:
      "by extending Rest Assured coverage to contract and error-path cases, surfacing failures in the pipeline instead of a release candidate",
    tools: ["Rest Assured", "REST APIs", "JSON", "SQL"],
    status: "measured",
  },
  {
    id: "defect-reduction",
    name: "Defects that stayed closed",
    category: "Defect management",
    organisation: "Wipro Technologies",
    summary:
      "Owned identification, tracking and retesting through sprint cycles, and cut recurring issues by working the root cause rather than the ticket.",
    detail:
      "A reopened defect is a defect that was never understood. I ran root cause analysis on the repeat offenders, added the regression case that would have caught each one, and made retesting a step in the sprint rather than an afterthought. Recurring issues dropped 15%.",
    metric: { value: 15, prefix: "−", suffix: "%", label: "recurring defects" },
    // TODO(Priya): confirm — worded from the existing detail (root cause
    // analysis on repeat offenders, regression case per fix), not a new claim.
    metricContext:
      "by running root cause analysis on repeat offenders and adding the regression case that would have caught each one, quarter over quarter",
    tools: ["Jira", "Azure DevOps", "Root cause analysis"],
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
  {
    id: "qa-practice",
    name: "QA practice, continuously sharpened",
    category: "Process",
    organisation: "Wipro Technologies",
    summary:
      "Contributed to how the team tested — process, strategy and standards — not only to what got tested this sprint.",
    detail:
      "Stand-ups, planning and retrospectives are where testing strategy actually changes. I used retros to argue for the unglamorous things: entry and exit criteria people agreed on, a regression suite trimmed of tests that no longer asserted anything, and a shared definition of what 'tested' meant before a story could move.",
    tools: ["Agile / Scrum", "STLC", "Test planning", "Test reporting"],
    status: "ongoing",
  },
];

export const experience: ExperienceItem[] = [
  {
    role: "QA Automation Engineer (SDET)",
    organisation: "Testing Info",
    location: "London",
    period: "Feb 2023 — Sept 2023",
    // TODO(Priya): confirm phrasing — dates line up with the MSc start
    // below, but double-check "ahead of an MSc" reads right before merging.
    note: "First UK-based SDET role, taken while preparing for postgraduate study — hands-on API automation ahead of starting an MSc in Computer Science at Queen Mary.",
    bullets: [
      "Created and executed test cases and scenarios for web applications",
      "Ran functional, regression and integration testing",
      "Tested REST APIs with Postman and RestSharp",
      "Logged and tracked defects in Jira and Azure DevOps",
      "Worked with developers and product through Agile sprints",
      "Produced test reports and supported release validation",
    ],
  },
  {
    role: "Senior QA Automation Tester",
    organisation: "Wipro Technologies",
    location: "India",
    period: "Oct 2019 — Oct 2022",
    bullets: [
      "Designed and executed test plans, test cases and test scripts",
      "Ran manual and automated functional, regression and UAT testing",
      "Built and maintained Selenium and Java automation frameworks (+50% efficiency)",
      "Increased API test coverage by 30% with REST automation tooling",
      "Led defect identification, tracking and retesting (−15% recurring issues)",
      "Worked across cross-functional Agile teams through sprint cycles",
      "Contributed to QA process and testing strategy improvements",
    ],
  },
];

export const education: EducationItem[] = [
  {
    qualification: "MSc Computer Science",
    institution: "Queen Mary University of London",
    year: "2024",
  },
  { qualification: "BE Computer Engineering", institution: "India", year: "2019" },
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
    items: ["Selenium WebDriver", "C#", "Java", "NUnit", "TestNG", "Cucumber"],
  },
  {
    label: "API tooling",
    items: ["Postman", "Rest Assured", "RestSharp", "REST APIs", "JSON"],
  },
  {
    label: "Test & defect management",
    items: ["Jira", "Azure DevOps", "Test case management", "Test reporting"],
  },
  {
    label: "Process",
    items: ["Agile (Scrum)", "SDLC", "STLC", "Sprint planning", "Retrospectives"],
  },
  {
    label: "CI/CD & data",
    items: ["Jenkins", "Azure Pipelines", "GitHub", "SQL", "Root cause analysis"],
  },
];


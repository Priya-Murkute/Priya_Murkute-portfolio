import type {
  EducationItem,
  ExperienceItem,
  FlowerProject,
  Profile,
  SkillGroup,
} from "../types";

export const profile: Profile = {
  name: "Priya Murkute",
  title: "QA Engineer | Software Tester",
  location: "United Kingdom",
  email: "priyamurkute7@gmail.com",
  phone: "+44 7789 595457",
  linkedin: "https://www.linkedin.com/in/priya-murkute-oct7",
  summary:
    "Detail-oriented QA Engineer with 3+ years of experience in manual and automated testing, ensuring high-quality software delivery across Agile/Scrum environments. Strong expertise in test planning, test case design, defect tracking, API testing, and test automation frameworks — with a proven track record of collaborating across cross-functional teams to improve test coverage and ship reliable, high-performing applications.",
};

export const skillGroups: SkillGroup[] = [
  {
    label: "QA Methodologies",
    items: ["Functional Testing", "Regression Testing", "Integration Testing", "UAT", "Exploratory Testing"],
  },
  {
    label: "Test Management & Defect Tracking",
    items: ["Jira", "Azure DevOps", "Test Case Management"],
  },
  {
    label: "Automation Testing",
    items: ["Selenium WebDriver", "C#", "Java", "NUnit", "TestNG", "Cucumber"],
  },
  {
    label: "API Testing",
    items: ["REST APIs", "Postman", "Rest Assured", "RestSharp", "JSON"],
  },
  {
    label: "SDLC & Agile",
    items: ["Agile (Scrum)", "SDLC", "STLC", "Sprint Planning", "Retrospectives"],
  },
  {
    label: "CI/CD & Tools",
    items: ["Azure DevOps", "Jenkins", "GitHub"],
  },
  {
    label: "Other",
    items: ["SQL", "Root Cause Analysis (RCA)", "Test Planning", "Test Reporting"],
  },
];

export const experience: ExperienceItem[] = [
  {
    role: "QA Automation Engineer (SDET)",
    organisation: "Testing Info",
    location: "London",
    period: "Feb 2023 – Sept 2023",
    bullets: [
      "Created and executed test cases and test scenarios for web applications",
      "Performed functional, regression, and integration testing",
      "Conducted API testing using Postman and RestSharp",
      "Logged and tracked defects using Jira/Azure DevOps",
      "Worked closely with developers and product teams in Agile sprints",
      "Produced test reports and supported release validation",
    ],
  },
  {
    role: "Senior QA Automation Tester",
    organisation: "Wipro Technologies",
    location: "India",
    period: "Oct 2019 – Oct 2022",
    bullets: [
      "Designed and executed comprehensive test plans, test cases, and test scripts",
      "Performed manual and automated testing, including functional, regression, and UAT testing",
      "Built and maintained automation frameworks (Selenium, Java), improving efficiency by 50%",
      "Increased API test coverage by 30% using REST automation tools",
      "Led defect identification, tracking, and retesting, reducing recurring issues by 15%",
      "Worked closely with cross-functional Agile teams during sprint cycles",
      "Participated in daily stand-ups, sprint planning, and retrospectives",
      "Contributed to continuous improvement of QA processes and testing strategies",
    ],
  },
];

export const education: EducationItem[] = [
  { qualification: "MSc Computer Science", institution: "Queen Mary University of London", year: "2024" },
  { qualification: "Bachelor of Computer Engineering", institution: "India", year: "2019" },
];

// Each stand-out achievement from the resume, presented as a flower in the garden.
export const projects: FlowerProject[] = [
  {
    id: "automation-framework",
    name: "Automation Framework Build",
    category: "Test Automation",
    organisation: "Wipro Technologies",
    description:
      "Built and maintained a Selenium + Java automation framework from the ground up, cutting manual testing effort and speeding up every release cycle.",
    metric: "+50% efficiency",
    species: "rose",
    petalFrom: "#F3D9E8",
    petalTo: "#C97FA8",
    centerColor: "#B8922E",
  },
  {
    id: "api-coverage",
    name: "API Coverage Expansion",
    category: "API Testing",
    organisation: "Wipro Technologies",
    description:
      "Extended automated API test coverage using REST automation tooling, catching more issues before they ever reached a release branch.",
    metric: "+30% coverage",
    species: "sunflower",
    petalFrom: "#FCE2A0",
    petalTo: "#E2A62E",
    centerColor: "#5A3B1E",
  },
  {
    id: "defect-reduction",
    name: "Defect Reduction Drive",
    category: "Quality Process",
    organisation: "Wipro Technologies",
    description:
      "Led defect identification, tracking, and retesting across sprint cycles, closing the loop on recurring issues instead of just logging them.",
    metric: "-15% recurring issues",
    species: "poppy",
    petalFrom: "#F0A08C",
    petalTo: "#C13A2E",
    centerColor: "#2A1B14",
  },
  {
    id: "api-testing-suite",
    name: "Release-Ready API Testing",
    category: "API Testing",
    organisation: "Testing Info",
    description:
      "Ran hands-on API testing with Postman and RestSharp and produced the test reporting that fed directly into release-validation decisions.",
    species: "tulip",
    petalFrom: "#DCEBF5",
    petalTo: "#6FA3C7",
    centerColor: "#2E4A5E",
  },
  {
    id: "agile-test-design",
    name: "Agile Test Case Design",
    category: "Functional Testing",
    organisation: "Testing Info",
    description:
      "Designed and executed test cases and scenarios for web applications, embedded inside Agile sprints alongside developers and product.",
    species: "lotus",
    petalFrom: "#EFE1F6",
    petalTo: "#A97FCB",
    centerColor: "#4A3563",
  },
  {
    id: "qa-process",
    name: "Continuous QA Improvement",
    category: "Process & Practice",
    organisation: "Wipro Technologies",
    description:
      "Contributed to the ongoing evolution of QA processes and testing strategy — not just executing tests, but improving how the team tested.",
    species: "daisy",
    petalFrom: "#FDF6E3",
    petalTo: "#F0D77B",
    centerColor: "#B8922E",
  },
];

/**
 * Renders public/Priya-Murkute-CV.pdf from src/data/resume.ts, so the CV can
 * never disagree with the site about a fact.
 *
 * Printed through the Chromium Playwright already installs, so it needs no
 * PDF library. Laid out to fit one A4 page; it warns when it doesn't.
 *
 * Run after editing resume.ts:  npm run cv
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  certifications,
  education,
  experience,
  profile,
  skillGroups,
} from "../src/data/resume";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "public", profile.cvPath);

/** Page margins, shared by the stylesheet and the preview. */
const MARGIN_X_MM = 12;
const MARGIN_Y_MM = 9;
const PX_PER_MM = 3.7795;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Set in bold wherever they appear in the summary and the bullets. Longest first, so a phrase wins over the words inside it. */
const KEYWORDS = [
  // summary
  "3+ years",
  "UI and API automation",
  "legacy automation",
  "test frameworks from scratch",
  "exploratory testing",
  "Recognised by Wipro",
  // numbers and headline achievements
  "Led automation for the RGL page",
  "60+ Gherkin UI scenarios",
  "Migrated legacy Ruby UI automation",
  "~80% of recurring regression scenarios",
  "~40%",
  "Built API automation from scratch",
  "30+ critical scenarios",
  "Uncovered a critical Cost Method API vulnerability",
  "$0",
  "requirement gaps and edge cases",
  "knowledge-transfer sessions",
  "from scratch",
  // practices
  "Agile/Scrum",
  "SDLC and STLC",
  "test plans",
  "exploratory",
  "root-cause analysis",
  "functional, regression and integration",
  "JSON-based REST API testing",
  "XPath/CSS optimisation",
  "OOP",
  // tools
  "Selenium WebDriver",
  "Selenium",
  "WebdriverIO",
  "TypeScript",
  "Postman",
  "RestSharp",
  "Fiddler",
  "Jira",
  "Git",
].sort((a, b) => b.length - a.length);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const KEYWORD_PATTERN = new RegExp(
  `(?<![A-Za-z0-9])(?:${KEYWORDS.map((keyword) => escapeRegExp(escapeHtml(keyword))).join("|")})(?![A-Za-z0-9])`,
  "g",
);

/** Escaped text with the keywords in bold. */
function emphasise(value: string): string {
  return escapeHtml(value).replace(KEYWORD_PATTERN, (match) => `<strong>${match}</strong>`);
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  /* Print-safe: one typeface (Carlito, metric-compatible with Calibri), hairline rules, no fills. */
  :root {
    --ink: #111418;
    --muted: #3b4149;
    --faint: #5b626b;
    --line: #b9bdc3;
    --accent: #2e6b4f;
  }

  @page { size: A4; margin: ${MARGIN_Y_MM}mm ${MARGIN_X_MM}mm; }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "Carlito", Calibri, Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.25;
    color: var(--ink);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  strong { font-weight: 700; }

  /* Header: the one centred block. */
  header { text-align: center; }
  h1 { font-size: 24pt; font-weight: 700; line-height: 1.05; letter-spacing: 0.01em; }
  .headline {
    margin-top: 3px;
    font-size: 10.5pt;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .contact { margin-top: 3px; font-size: 10pt; color: var(--muted); }
  .contact a { color: inherit; text-decoration: none; }
  .contact span + span::before { content: "  |  "; color: var(--line); white-space: pre; }

  .summary { margin-top: 6px; color: var(--muted); text-align: left; }

  /* Section headings share one left edge and one rule. */
  h2 {
    margin: 8px 0 4px;
    padding-bottom: 2px;
    border-bottom: 0.75pt solid var(--ink);
    font-size: 10pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .role { margin-bottom: 5px; break-inside: avoid; }
  .role:last-child { margin-bottom: 0; }
  .role-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .role-title { font-size: 10.5pt; font-weight: 700; }
  .role-dates { font-size: 10pt; color: var(--muted); white-space: nowrap; font-variant-numeric: tabular-nums; }
  .role-org { color: var(--muted); font-style: italic; }
  .awards { color: var(--accent); }

  /* Bullets hang: wrapped lines line up with the first line's text. */
  ul { list-style: none; margin-top: 2px; }
  li { position: relative; padding-left: 11px; margin-bottom: 1px; }
  li::before { content: "•"; position: absolute; left: 1px; top: 0; color: var(--faint); }

  /* Skills: one label column, sized to the longest label, and one value column. */
  .skills { display: grid; grid-template-columns: max-content 1fr; column-gap: 12px; row-gap: 1px; }
  .skill-key { font-weight: 700; }
  .skill-value { color: var(--muted); }

  .two-col { display: flex; gap: 28px; }
  .two-col > :first-child { flex: 0.95; }
  .two-col > :last-child { flex: 1.15; }
  .edu-row { display: flex; gap: 10px; margin-bottom: 3px; }
  .edu-year { flex: none; width: 34px; color: var(--muted); font-variant-numeric: tabular-nums; }
  .edu-detail { flex: 1; }
  .edu-detail .school { color: var(--muted); }
</style>
</head>
<body>

  <header>
    <h1>${escapeHtml(profile.name)}</h1>
    <p class="headline">${escapeHtml(profile.title)} · ${escapeHtml(profile.location)}</p>
    <!-- No phone number: contact routes through email/LinkedIn only, same as the live site. -->
    <p class="contact">
      <span><a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></span>
      <span><a href="${escapeHtml(profile.linkedin)}">LinkedIn</a></span>
      <span><a href="${escapeHtml(profile.github)}">GitHub</a></span>
    </p>
  </header>

  <p class="summary">${emphasise(profile.summary)}</p>

  <h2>Experience</h2>
  ${experience
    .map(
      (role) => `
    <div class="role">
      <div class="role-head">
        <div class="role-title">${escapeHtml(role.role)}</div>
        <div class="role-dates">${escapeHtml(role.period)}</div>
      </div>
      <div class="role-org">${escapeHtml(role.organisation)} · ${escapeHtml(role.location)}</div>
      ${
        role.honors?.length
          ? `<div class="awards">Awards: ${role.honors.map((honor) => escapeHtml(honor.replace(/ · (.+)$/, " ($1)"))).join(" · ")}</div>`
          : ""
      }
      <ul>
        ${(role.cvBullets ?? role.bullets).map((bullet) => `<li>${emphasise(bullet)}</li>`).join("")}
      </ul>
    </div>`,
    )
    .join("")}

  <h2>Skills</h2>
  <div class="skills">
    ${skillGroups
      .map(
        (group) => `
    <div class="skill-key">${escapeHtml(group.label)}</div>
    <div class="skill-value">${escapeHtml(group.items.join(", "))}</div>`,
      )
      .join("")}
  </div>

  <div class="two-col">
    <div>
      <h2>Education</h2>
      ${education
        .map(
          (item) => `
        <div class="edu-row">
          <div class="edu-year">${escapeHtml(item.year)}</div>
          <div class="edu-detail">
            <strong>${escapeHtml(item.qualification)}</strong>
            <div class="school">${escapeHtml(item.institution)}</div>
          </div>
        </div>`,
        )
        .join("")}
    </div>

    <div>
      <h2>Certifications</h2>
      <ul>${certifications.map((cert) => `<li>${escapeHtml(cert.name)}</li>`).join("")}</ul>
    </div>
  </div>

</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setContent(html, { waitUntil: "networkidle" });
// Webfonts can arrive after networkidle resolves.
await page.evaluate(() => document.fonts.ready);

const pdf = await page.pdf({
  path: OUTPUT,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});

// Headless Chromium downloads a PDF rather than rendering it, so a PNG is
// the only way to actually look at the layout while editing it. It is laid out
// at the printed text width, so lines wrap where the PDF's do.
if (process.argv.includes("--preview")) {
  const preview = path.join(ROOT, "cv-preview.png");
  await page.setViewportSize({ width: Math.round((210 - 2 * MARGIN_X_MM) * PX_PER_MM), height: 1123 });
  await page.screenshot({ path: preview, fullPage: true });
  console.log(`Wrote ${path.relative(ROOT, preview)}`);
}

await browser.close();

// Counted in the PDF itself, so it is what a reader will get.
const pageCount = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;

console.log(`Wrote ${path.relative(ROOT, OUTPUT)} (${pageCount} page${pageCount === 1 ? "" : "s"})`);
if (pageCount > 1) {
  console.warn("The CV runs past one page: shorten a role's cvBullets in src/data/resume.ts, or tighten the spacing above.");
  process.exitCode = 1;
}

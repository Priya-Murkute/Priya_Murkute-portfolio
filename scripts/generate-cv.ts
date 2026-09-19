/**
 * Renders public/Priya-Murkute-CV.pdf from src/data/resume.ts, so the CV can
 * never disagree with the site about a fact.
 *
 * Printed through the Chromium Playwright already installs, so it uses the
 * site's own typography and needs no PDF library.
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
  stats,
  volunteering,
} from "../src/data/resume";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "public", profile.cvPath);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const linkedinDisplay = profile.linkedin.replace(/^https?:\/\/(www\.)?/, "");
const githubDisplay = profile.github.replace(/^https?:\/\/(www\.)?/, "");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  /* Mirrors the site's palette. Print-safe: hairlines, no background fills. */
  :root {
    --ink: #14171a;
    --ink-muted: #4a5058;
    --ink-faint: #6b7078;
    --line: #d9d8d2;
    --pass: #2e6b4f;
  }

  /* Type is tuned to land the whole thing on one page. */
  @page { size: A4; margin: 11mm 13mm; }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "Instrument Sans", system-ui, sans-serif;
    font-size: 8.5pt;
    line-height: 1.34;
    color: var(--ink);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  h1 {
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
    font-size: 20pt;
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .role-line {
    font-family: "JetBrains Mono", monospace;
    font-size: 7.6pt;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--pass);
    margin-top: 6px;
  }

  .contact {
    font-family: "JetBrains Mono", monospace;
    font-size: 7.4pt;
    color: var(--ink-faint);
    margin-top: 7px;
  }
  .contact a { color: inherit; text-decoration: none; }
  .contact span + span::before { content: " · "; }

  .summary {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--line);
    color: var(--ink-muted);
    max-width: 62em;
  }

  h2 {
    font-family: "JetBrains Mono", monospace;
    font-size: 7.2pt;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin: 10px 0 6px;
    padding-top: 7px;
    border-top: 1px solid var(--line);
  }

  .metrics { display: flex; gap: 20px; }
  .metric { flex: 1; }
  .metric-value {
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
    font-size: 15pt;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--pass);
    line-height: 1.1;
  }
  .metric-label {
    font-family: "JetBrains Mono", monospace;
    font-size: 7pt;
    color: var(--ink);
    margin-top: 2px;
  }
  .metric-note { font-size: 8pt; color: var(--ink-faint); margin-top: 2px; }

  .role { margin-bottom: 8px; page-break-inside: avoid; }
  .role:last-child { margin-bottom: 0; }

  .role-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .role-title {
    font-family: "Bricolage Grotesque", system-ui, sans-serif;
    font-size: 10.2pt;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .role-dates {
    font-family: "JetBrains Mono", monospace;
    font-size: 7.6pt;
    color: var(--ink-faint);
    white-space: nowrap;
  }
  .role-org { font-size: 8.6pt; color: var(--ink-muted); margin-top: 1px; }
  .award {
    font-family: "JetBrains Mono", monospace;
    font-size: 6.8pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--pass);
    border: 1px solid var(--pass);
    border-radius: 99px;
    padding: 1px 6px;
    margin-left: 7px;
    white-space: nowrap;
  }

  ul { list-style: none; margin-top: 3px; }
  li { padding-left: 11px; position: relative; margin-bottom: 0.5px; }
  li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.62em;
    width: 5px;
    height: 1px;
    background: var(--ink-faint);
  }

  .grid-row { display: flex; gap: 14px; margin-bottom: 4px; }
  .grid-key {
    font-family: "JetBrains Mono", monospace;
    font-size: 7.2pt;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-faint);
    width: 128px;
    flex: none;
    padding-top: 1px;
  }
  .grid-value { flex: 1; }

  .two-col { display: flex; gap: 26px; }
  .two-col > * { flex: 1; }
</style>
</head>
<body>

  <header>
    <h1>${escapeHtml(profile.name)}</h1>
    <p class="role-line">${escapeHtml(profile.title)} · ${escapeHtml(profile.location)}</p>
    <!-- No phone number: contact routes through email/LinkedIn only, same as the live site. -->
    <p class="contact">
      <span><a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></span>
      <span><a href="${escapeHtml(profile.linkedin)}">${escapeHtml(linkedinDisplay)}</a></span>
      <span><a href="${escapeHtml(profile.github)}">${escapeHtml(githubDisplay)}</a></span>
    </p>
    <p class="summary">${escapeHtml(profile.summary)}</p>
  </header>

  <h2>Selected outcomes</h2>
  <div class="metrics">
    ${stats
      .map(
        (stat) => `
      <div class="metric">
        <div class="metric-value">${escapeHtml(stat.prefix ?? "")}${stat.value}${escapeHtml(stat.suffix ?? "")}</div>
        <div class="metric-label">${escapeHtml(stat.label)}</div>
        <div class="metric-note">${escapeHtml(stat.note)}</div>
      </div>`,
      )
      .join("")}
  </div>

  <h2>Experience</h2>
  ${experience
    .map(
      (role) => `
    <div class="role">
      <div class="role-head">
        <div class="role-title">
          ${escapeHtml(role.role)}${role.honors ? `<span class="award">${escapeHtml(role.honors)}</span>` : ""}
        </div>
        <div class="role-dates">${escapeHtml(role.period)}</div>
      </div>
      <div class="role-org">${escapeHtml(role.organisation)} · ${escapeHtml(role.location)}</div>
      <ul>
        ${role.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
      </ul>
    </div>`,
    )
    .join("")}

  <h2>Skills</h2>
  ${skillGroups
    .map(
      (group) => `
    <div class="grid-row">
      <div class="grid-key">${escapeHtml(group.label)}</div>
      <div class="grid-value">${escapeHtml(group.items.join(", "))}</div>
    </div>`,
    )
    .join("")}

  <div class="two-col">
    <div>
      <h2>Education</h2>
      ${education
        .map(
          (item) => `
        <div class="grid-row">
          <div class="grid-key" style="width:38px">${escapeHtml(item.year)}</div>
          <div class="grid-value">
            ${escapeHtml(item.qualification)}
            <div style="color:var(--ink-faint);font-size:8.2pt">${escapeHtml(item.institution)}</div>
          </div>
        </div>`,
        )
        .join("")}
    </div>

    <div>
      <h2>Certifications</h2>
      <ul>${certifications.map((cert) => `<li>${escapeHtml(cert.name)}</li>`).join("")}</ul>

      ${
        volunteering.length > 0
          ? `<h2>Volunteering</h2>
      ${volunteering
        .map(
          (item) => `
        <div class="role-head">
          <div class="role-title" style="font-size:9.4pt">${escapeHtml(item.role)}</div>
          <div class="role-dates">${escapeHtml(item.period)}</div>
        </div>
        <div class="role-org">${escapeHtml(item.organisation)} · ${escapeHtml(item.location)}</div>
        <p style="margin-top:3px;color:var(--ink-muted)">${escapeHtml(item.summary)}</p>`,
        )
        .join("")}`
          : ""
      }
    </div>
  </div>

</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setContent(html, { waitUntil: "networkidle" });
// Webfonts can arrive after networkidle resolves.
await page.evaluate(() => document.fonts.ready);

await page.pdf({
  path: OUTPUT,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});

// Headless Chromium downloads a PDF rather than rendering it, so a PNG is
// the only way to actually look at the layout while editing it.
if (process.argv.includes("--preview")) {
  const preview = path.join(ROOT, "cv-preview.png");
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.screenshot({ path: preview, fullPage: true });
  console.log(`Wrote ${path.relative(ROOT, preview)}`);
}

const pageCount = await page.evaluate(
  () => Math.ceil(document.body.scrollHeight / (297 * 3.7795)), // A4 height in px @96dpi
);

await browser.close();

console.log(`Wrote ${path.relative(ROOT, OUTPUT)} (~${pageCount} page${pageCount === 1 ? "" : "s"})`);

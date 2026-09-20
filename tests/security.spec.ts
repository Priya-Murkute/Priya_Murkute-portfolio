import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Guards for the things that fail silently. None of these open a browser: they
 * read the project's own files, so they run once (like hobby-folders.spec.ts).
 */
test.describe("security guards", () => {
  test.beforeEach(({ browserName }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium" || browserName !== "chromium", "File checks run once.");
  });

  const read = (file: string) => readFileSync(path.resolve(file), "utf8");

  /** Every file under `dir` whose name ends with one of `extensions`. */
  function filesUnder(dir: string, extensions: string[]): string[] {
    return readdirSync(path.resolve(dir)).flatMap((name) => {
      const full = path.join(dir, name);
      if (statSync(path.resolve(full)).isDirectory()) return filesUnder(full, extensions);
      return extensions.some((extension) => name.endsWith(extension)) ? [full] : [];
    });
  }

  const vercel = JSON.parse(read("vercel.json")) as { headers: { headers: { key: string; value: string }[] }[] };
  const header = (name: string) => vercel.headers[0].headers.find((h) => h.key === name)?.value;

  test("the CSP allows the inline theme script by its hash, and nothing inline beyond it", () => {
    // The one script that runs inline (JSON-LD is data, not script). If its text
    // changes and the hash in vercel.json doesn't, the browser silently blocks it.
    const html = read("index.html").replace(/\r\n/g, "\n");
    const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)].map(
      (match) => match[1],
    );
    expect(inline, "index.html should have exactly one inline script").toHaveLength(1);

    const hash = createHash("sha256").update(inline[0], "utf8").digest("base64");
    const scriptSrc = header("Content-Security-Policy")!
      .split(";")
      .map((directive) => directive.trim())
      .find((directive) => directive.startsWith("script-src"));

    expect(scriptSrc, "vercel.json's CSP has no script-src").toBeDefined();
    expect(scriptSrc, "the inline script's hash is not in the CSP; recompute it (see the README)").toContain(`'sha256-${hash}'`);
    expect(scriptSrc).not.toMatch(/unsafe-(inline|eval)/);
  });

  test("the response headers Vercel sends are all there", () => {
    const csp = header("Content-Security-Policy")!;
    for (const directive of ["default-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "upgrade-insecure-requests"]) {
      expect(csp, `CSP is missing ${directive}`).toContain(directive);
    }

    expect(header("X-Content-Type-Options")).toBe("nosniff");
    expect(header("X-Frame-Options")).toBe("DENY");
    expect(header("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(header("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(header("Permissions-Policy")).toContain("camera=()");

    const hsts = header("Strict-Transport-Security") ?? "";
    const maxAge = Number(/max-age=(\d+)/.exec(hsts)?.[1] ?? 0);
    expect(maxAge, "HSTS should last at least a year").toBeGreaterThanOrEqual(31_536_000);
  });

  test("every workflow sets its token's permissions, and every action is pinned to a commit", () => {
    const workflows = readdirSync(path.resolve(".github/workflows")).filter((name) => /\.ya?ml$/.test(name));
    expect(workflows.length).toBeGreaterThan(0);

    for (const name of workflows) {
      const text = read(path.join(".github/workflows", name));
      expect(text, `${name} has no top-level permissions: block`).toMatch(/^permissions:/m);

      const unpinned = [...text.matchAll(/^\s*-?\s*uses:\s*(\S+)/gm)]
        .map((match) => match[1])
        .filter((reference) => !/@[0-9a-f]{40}$/.test(reference));
      expect(unpinned, `${name} uses actions by a movable tag; pin them to a commit SHA`).toEqual([]);
    }
  });

  test("links to other sites open through ExternalLink, which adds rel=noopener", () => {
    const offenders = filesUnder("src", [".tsx"])
      .filter((file) => !file.endsWith("ExternalLink.tsx"))
      .filter((file) => /target=["'{]_blank/.test(read(file)));
    expect(offenders, "use <ExternalLink> instead of target=_blank").toEqual([]);
  });

  test("nothing in src writes raw HTML or evaluates strings as code", () => {
    const dangerous = /dangerouslySetInnerHTML|\.innerHTML\s*=|\.outerHTML\s*=|insertAdjacentHTML|document\.write\(|\beval\(|new Function\(/;
    const offenders = filesUnder("src", [".ts", ".tsx"]).filter((file) => dangerous.test(read(file)));
    expect(offenders).toEqual([]);
  });
});

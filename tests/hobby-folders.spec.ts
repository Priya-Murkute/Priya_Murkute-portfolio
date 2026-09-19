import { expect, test } from "@playwright/test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { hobbies } from "../src/data/offHours";

/**
 * The Hobbies / Interests folders are edited by hand, so these catch the
 * mistakes that would otherwise just make a photo quietly not appear: a
 * misspelt folder, a missing one, a badly named file, or a photo added
 * without running `npm run images`. No browser needed — each runs once.
 */
const ROOT = path.resolve("src/assets/hobbies_interest");
const NAMED = /^\d{4}-\d{2}-\d{2}__[^_].*\.(jpe?g|png|webp)$/i;
/** Files that belong in a folder but aren't pictures. */
const NOT_PICTURES = new Set(["manifest.json", ".gitkeep", "README.md", ".DS_Store", "Thumbs.db", "desktop.ini"]);

const folders = readdirSync(ROOT).filter(
  (name) => statSync(path.join(ROOT, name)).isDirectory() && !name.startsWith("_"),
);

test.describe("hobbies / interests folders", () => {
  test.beforeEach(({ browserName }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium" || browserName !== "chromium", "File checks run once.");
  });

  test("every hobby has a folder, and every folder is a hobby", () => {
    const ids = hobbies.map((hobby) => hobby.id);
    expect(folders.filter((folder) => !ids.includes(folder)), "folders with no matching hobby id").toEqual([]);
    expect(ids.filter((id) => !folders.includes(id)), "hobbies with no folder").toEqual([]);
  });

  test("every picture is named YYYY-MM-DD__Title-Words", () => {
    const misnamed = folders.flatMap((folder) =>
      readdirSync(path.join(ROOT, folder))
        .filter((name) => !NOT_PICTURES.has(name) && !statSync(path.join(ROOT, folder, name)).isDirectory())
        .filter((name) => !NAMED.test(name))
        .map((name) => `${folder}/${name}`),
    );
    expect(misnamed, "rename these like 2026-10-02__Tulips-At-The-Market.jpg").toEqual([]);
  });

  test("every picture has been through `npm run images`", () => {
    const pending = folders.flatMap((folder) => {
      const dir = path.join(ROOT, folder);
      const manifestPath = path.join(dir, "manifest.json");
      const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
      return readdirSync(dir)
        .filter((name) => NAMED.test(name))
        // A .jpg or .png means it hasn't been converted yet; a .webp needs its size recorded.
        .filter((name) => !name.toLowerCase().endsWith(".webp") || !manifest[name])
        .map((name) => `${folder}/${name}`);
    });
    expect(pending, "run `npm run images` to optimise these").toEqual([]);
  });
});

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";

/**
 * TypeScript already carries a lot of the load here (strict, noUnusedLocals,
 * noUnusedParameters), so this deliberately adds only what the compiler can't
 * see: hook dependency correctness, and the accessibility rules — the review
 * that prompted this found a modal without a focus trap, tab roles with no
 * tabpanel, and content images with empty alt text, none of which tsc can
 * catch.
 */
export default tseslint.config(
  { ignores: ["dist", "playwright-report", "test-results", "src/assets/**/_originals"] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // The codebase uses `catch {}` intentionally in several storage helpers,
      // where the only sane response to a quota/private-mode error is to carry
      // on without persistence.
      "no-empty": ["error", { allowEmptyCatch: true }],

      // React-Compiler-era advice rather than defect detection: both flag
      // patterns that are correct here (a capability probe that has to run on
      // the client, a hold-to-repeat timer that clears its own charge state).
      // Kept visible as warnings so new instances get a second look, but not
      // failing CI over a style the codebase applies deliberately.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },

  // Vendored from motion-primitives.com, with prop APIs matching upstream so
  // a component pasted from that site works unedited. `motion.create(as)` in a
  // useMemo is their documented pattern for polymorphic `as` props; rewriting
  // it to satisfy the rule would fork these from upstream for no behavioural
  // gain. Accessibility rules still apply here — they caught a real dialog bug.
  {
    files: ["src/components/motion-primitives/**/*.tsx"],
    rules: {
      "react-hooks/static-components": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },

  // Node scripts: different globals, and they legitimately log.
  {
    files: ["scripts/**/*.mjs", "*.config.{js,ts}"],
    languageOptions: { globals: globals.node },
  },
);

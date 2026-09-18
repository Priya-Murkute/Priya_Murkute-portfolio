import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";

/**
 * tsc already covers unused code and types, so this adds only what it can't
 * see: hook dependency correctness and the accessibility rules.
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
      // Storage helpers use `catch {}` deliberately.
      "no-empty": ["error", { allowEmptyCatch: true }],

      // Advice rather than defect detection — warn, don't fail CI.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },

  // Vendored from motion-primitives.com: `motion.create(as)` in a useMemo is
  // their documented pattern, and rewriting it would fork us from upstream.
  // Accessibility rules still apply here.
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

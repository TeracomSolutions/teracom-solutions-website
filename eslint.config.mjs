// ESLint 9 flat config (Robert, 2026-11-02: Next 16 removed next lint and the old .eslintrc format; the Next 16
// lint rules support ESLint up to 9, and typescript-eslint supports TypeScript up to 6.0).
import nextVitals from "eslint-config-next/core-web-vitals";

export default [
  ...nextVitals,
  {
    // Two React Compiler rules that came with eslint-plugin-react-hooks 7 flag patterns the site has always
    // used safely (setting state when an effect runs, keeping a ref in step during render). Warnings, not
    // errors, until those places are reworked.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
  { ignores: [".next/**", "node_modules/**", "public/**", "playwright-report/**", "test-results/**"] },
];

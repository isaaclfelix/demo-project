---
name: Commitlint conventional commits
overview: Add Commitlint with the official [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) preset, a versioned `commitlint.config.js`, and a Husky `commit-msg` hook so invalid commit messages are rejected before they land on a branch.
todos:
  - id: deps-commitlint
    content: pnpm add -D @commitlint/cli @commitlint/config-conventional
    status: completed
  - id: config-commitlint
    content: Add commitlint.config.js extending @commitlint/config-conventional (CJS module.exports)
    status: completed
  - id: husky-commit-msg
    content: Add .husky/commit-msg running pnpm exec commitlint --edit "$1"
    status: completed
  - id: docs-commitlint
    content: Update CONTRIBUTING.md with commit conventions, colon vs branch slash, bypass; optional README tweak
    status: completed
isProject: false
---

# Conventional commits via Commitlint (docs + Husky)

## Current state

- [package.json](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\package.json) already has **Husky** (`prepare`: `"husky"`) and [`.husky/pre-push`](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\.husky\pre-push) for **branch** naming only.
- There is **no** `commit-msg` hook at [`.husky/commit-msg`](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\.husky\commit-msg) yet, and no Commitlint dependencies or config file.
- [CONTRIBUTING.md](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\CONTRIBUTING.md) documents branches and pre-push bypass; it should gain a **commit message** section aligned with the same Conventional Commit **types** (and note how it differs from branch `feat/` slash syntax).

```mermaid
flowchart LR
  commit[git commit]
  hook[Husky commit-msg]
  cli[commitlint CLI]
  cfg[commitlint.config.js]
  preset[@commitlint/config-conventional]
  commit --> hook --> cli --> cfg --> preset
```

## Dependencies

Add devDependencies (use **pnpm** to match [pnpm-lock.yaml](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\pnpm-lock.yaml)):

- `@commitlint/cli`
- `@commitlint/config-conventional`

This matches the upstream getting-started flow for [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional).

## `commitlint.config.js` (tracked in repo)

Create **[commitlint.config.js](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\commitlint.config.js)** at the repo root with the preset extended:

- **Default:** `module.exports = { extends: ['@commitlint/config-conventional'] };` so it works without `"type": "module"` in `package.json` (your [package.json](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\package.json) has no `"type": "module"` today).
- If you later switch the package to ESM-only, the same object can be switched to `export default { ... }` in that file or renamed to `.mjs` as needed.

Optional follow-up (only if you hit friction): override rules (e.g. `header-max-length`) or ignore certain merge commit patterns; the stock preset already encodes the rules described in the config-conventional README (type enum includes `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`, plus subject/header/footer rules).

## Husky `commit-msg` hook

Add **[`.husky/commit-msg`](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\.husky/commit-msg)** (Husky 9 resolves this the same way as `pre-push`: Git uses `core.hooksPath` → `.husky/_`, which delegates to `.husky/commit-msg`):

- Run: `pnpm exec commitlint --edit "$1"` so the hook uses the same package manager as the lockfile.

This validates **commit messages** (not branch names); branch checks remain on **pre-push** only.

## Documentation

Extend [CONTRIBUTING.md](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\CONTRIBUTING.md):

- **Commits:** one-line summary format `type(scope optional): subject` (lowercase type; subject rules per preset — link to [Conventional Commits](https://www.conventionalcommits.org/) and note that config details live in [commitlint.config.js](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\commitlint.config.js) / [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)).
- Clarify **branch** names use `feat/foo-bar` while **commits** use `feat: foo bar` (colon, not slash after type).
- **Bypass:** same as today — `HUSKY=0 git commit` (Unix) / `$env:HUSKY=0; git commit` (PowerShell) for emergencies only.

Optional: add a one-line pointer in [README.md](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\README.md) next to the existing CONTRIBUTING link (e.g. mention commitlint) — keep it minimal.

## Verification (after implementation)

- Invalid message (e.g. `git commit --allow-empty -m "bad message"`) should fail at `commit-msg`.
- Valid message (e.g. `chore: add commitlint`) should pass.
- Run `pnpm prepare` (or fresh `pnpm install`) so hooks stay wired for new clones.

No `.github` workflow is required for this scope; CI can run `pnpm exec commitlint --from HEAD~1 --to HEAD --verbose` later if you want server-side checks.

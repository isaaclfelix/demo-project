# Contributing

## Git workflow

### Branch names

Use **lowercase kebab-case** with a **type prefix** (aligned with [Conventional Commits](https://www.conventionalcommits.org/) types):

| Prefix       | Use for                                      |
| ------------ | -------------------------------------------- |
| `feat/`      | New user-facing behavior                     |
| `fix/`       | Bug fixes                                    |
| `docs/`      | Documentation only                           |
| `chore/`     | Tooling, dependencies, config                |
| `refactor/`  | Code change without intended behavior change |
| `test/`      | Tests only                                   |
| `ci/`        | CI/CD configuration                          |
| `perf/`      | Performance improvements                     |
| `build/`     | Build system or bundler changes              |

**Pattern:** `type/short-description-in-kebab-case`

**Examples:** `feat/add-dark-mode-toggle`, `fix/nav-overflow-on-mobile`, `chore/bump-eslint-9`

**Long-lived branches** (no `type/` prefix): `main`, `master`, `develop`, `staging`. Adjust your remote’s default branch names to match what this repo uses.

**Optional ticket IDs** (e.g. Jira/Linear): `feat/ABC-42-payment-form` — document these in your team process; the bundled hook uses a stricter pattern unless you extend it.

**Avoid:** spaces, vague names like `fix/bug` or `feat/update`, and branches that do not match the enforced pattern when pushing.

### Commit messages

Commits are validated with **[Commitlint](https://github.com/conventional-changelog/commitlint)** using [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional). Rules match [Conventional Commits](https://www.conventionalcommits.org/) (see [commitlint.config.js](./commitlint.config.js) in this repo).

**Summary line format:** `type(optional-scope): subject`

- **Type** is lowercase and must be one of: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.
- **Scope** in parentheses is optional, e.g. `feat(ui): add toggle`.
- **Subject** follows the preset (length, case, no trailing period, etc.).

**Branch vs commit:** branches use a slash after the type (`feat/add-login`), while commits use a colon and a space (`feat: add login`).

**Examples:** `fix: correct nav overflow on mobile`, `chore: add commitlint`, `docs: link contributing guide`

### Pre-push hook

This repository installs a **Husky** `pre-push` hook that blocks pushes from branches whose names do not match the convention above (except the long-lived allowlist).

**Bypass when you must** (emergency only):

- **Unix shell / Git Bash:** `HUSKY=0 git push`
- **PowerShell:** `$env:HUSKY=0; git push` (or for one command: `$env:HUSKY=0; git push origin your-branch`)

### Commit-msg hook (Commitlint)

A **Husky** `commit-msg` hook runs Commitlint on every commit message.

**Bypass when you must** (emergency only):

- **Unix shell / Git Bash:** `HUSKY=0 git commit` (with your usual arguments)
- **PowerShell:** `$env:HUSKY=0; git commit` (with your usual arguments)

After cloning, run **`pnpm install`** so the `prepare` script installs Husky hooks and dependencies. On Windows, use **Git for Windows** so hooks run with the bundled `sh`. If you use WSL and Windows on the same clone, stick to one environment to avoid inconsistent hook behavior.

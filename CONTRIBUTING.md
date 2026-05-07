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

### Pre-push hook

This repository installs a **Husky** `pre-push` hook that blocks pushes from branches whose names do not match the convention above (except the long-lived allowlist).

**Bypass when you must** (emergency only):

- **Unix shell / Git Bash:** `HUSKY=0 git push`
- **PowerShell:** `$env:HUSKY=0; git push` (or for one command: `$env:HUSKY=0; git push origin your-branch`)

After cloning, run `npm install` so the `prepare` script installs Husky hooks. On Windows, use **Git for Windows** so hooks run with the bundled `sh`. If you use WSL and Windows on the same clone, stick to one environment to avoid inconsistent hook behavior.

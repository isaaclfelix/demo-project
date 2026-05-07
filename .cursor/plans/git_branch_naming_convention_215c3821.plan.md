---
name: Git branch naming convention
overview: Add a written branch-naming standard aligned with common “conventional” prefixes, and enforce it locally with a Husky pre-push hook that allows protected long-lived branch names.
todos:
  - id: add-contributing
    content: Add CONTRIBUTING.md with branch naming rules, examples, long-lived allowlist, and HUSKY bypass notes (incl. PowerShell)
    status: completed
  - id: husky-setup
    content: Add husky devDependency, prepare script, run husky init, implement .husky/pre-push branch regex + allowlist
    status: completed
  - id: readme-link
    content: "Optional: one README line linking to CONTRIBUTING for contributors"
    status: completed
isProject: false
---

# Git branch naming convention (docs + Husky)

## Current state

- [README.md](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\README.md) is the default create-next-app text; there is **no** existing branching policy, `.github/` workflows, or Husky setup.
- [package.json](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\package.json) has no `prepare` script or Husky dependency yet.

## Recommended convention (to encode in docs)

Use **lowercase kebab-case** with a **type prefix**, mirroring [Conventional Commits](https://www.conventionalcommits.org/) types so branches and commit messages feel consistent:

| Prefix | Use for |
|--------|---------|
| `feat/` | New user-facing behavior |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `chore/` | Tooling, deps, config |
| `refactor/` | Code change without behavior change |
| `test/` | Tests only |
| `ci/` | CI/CD config |
| `perf/` | Performance |
| `build/` | Build system / bundler |

**Pattern:** `type/short-description-in-kebab-case`

**Examples:** `feat/add-dark-mode-toggle`, `fix/nav-overflow-on-mobile`, `chore/bump-eslint-9`

**Long-lived branches (no prefix required):** `main`, `master`, `develop`, `staging` (adjust the allowlist to match what you actually use on the remote).

**Optional ticket IDs** (if you adopt a tracker later): `feat/ABC-42-payment-form` — document as optional `TYPE/TICKET-description` and extend the hook regex when needed.

**Avoid:** spaces, uppercase-only segments, vague names like `fix/bug` or `feat/update`.

## Where to document

Add a dedicated **[CONTRIBUTING.md](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\CONTRIBUTING.md)** with a short “Git workflow” section: branch naming rules, examples, and **how to bypass the hook** when necessary (`HUSKY=0` before the git command; on PowerShell, `$env:HUSKY=0` for the session or prefix on one line). Optionally add one line in [README.md](c:\Users\Media Center\OneDrive\Documentos\Code\Next.js\demo-project\README.md) linking to CONTRIBUTING for contributors — keep the README change minimal (single sentence + link).

## Local enforcement (Husky pre-push)

1. **Dependencies and scripts**
   - Add `husky` as a `devDependency`.
   - Add `"prepare": "husky"` to `scripts` in `package.json` so `npm install` wires hooks for collaborators.

2. **Initialize Husky**
   - Run `npx husky init` (creates `.husky/` and a sample hook); replace or add **`.husky/pre-push`** with a small shell script that:
     - Reads the current branch: `git rev-parse --abbrev-ref HEAD`.
     - If it matches the long-lived allowlist, exit 0.
     - Otherwise require a pattern like: `^(feat|fix|docs|chore|refactor|test|ci|perf|build)/[a-z0-9]+(-[a-z0-9]+)*$` (tune to allow optional `/TICKET-123/` segment if you add tickets later).
     - On failure: print a clear message pointing at CONTRIBUTING.md.

3. **Windows / Git for Windows**
   - Husky hooks run via Git’s bundled `sh`; this works with the typical Git for Windows install. Document that WSL users use the same repo from one environment to avoid hook surprises.

## Verification (after implementation)

- From a wrongly named branch, `git push` should be blocked with the help text.
- From `main` (or your allowlist) or a correctly named branch, `git push` should proceed (assuming credentials/remote are OK).

## Files to touch

| File | Action |
|------|--------|
| `package.json` | Add `husky`, `prepare` script |
| `.husky/pre-push` | New — branch name validation |
| `CONTRIBUTING.md` | New — convention + bypass + examples |
| `README.md` | Optional one-line link to CONTRIBUTING |

No `.github` workflows required for this scope; CI enforcement can be a follow-up if you move to GitHub Actions later.

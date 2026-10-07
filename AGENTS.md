# Project Instructions

## Git — DO NOT TOUCH

**Never perform any git operation in this project, in any session (current, new, or any other agent session).**

This includes, but is not limited to:

- `git add`, `git commit`, `git push`, `git pull`, `git fetch`
- `git checkout`, `git switch`, `git restore`, `git reset`, `git rebase`, `git merge`
- `git stash`, `git tag`, `git branch`, `git clean`
- Any shell command or tool that runs git under the hood

The repository owner manages version control personally. Leave the working tree exactly as it is: make the file changes, verify them (typecheck/lint/tests), and stop. Do not stage, do not commit, do not push, and do not suggest running these commands as a next step.

If a task seems to require a git operation, ask the owner to do it themselves.

## Environment variables — DO NOT TOUCH

Never edit, rewrite, restore, or "temporarily switch" `.env` / `.env.*` files anywhere in this repo (frontend, backend, or otherwise) — not even to run a test, and not even if you plan to put them back. Owner-owned credentials and deployment targets can cause serious issues when changed.

- If a test needs a different API base URL, tell the owner the exact line to change and let them decide.
- If you cannot complete testing with the config as-is, stop and hand the owner short, numbered instructions instead of editing the file.

## Tailwind — always use canonical classes

Always run the checks below before reporting a task as done, and fix every result:

- `npx tsc -b` (frontend) and `npx tsc --noEmit` (backend)
- `npx eslint` on every file touched
- `npm run build`

`tailwindcss(suggestCanonicalClasses)` is a warning in this repo, not noise. Never write a raw hex in a Tailwind class when the value exists as a theme token. `frontend/src/index.css` `@theme` remaps the legacy `cyan-*` / `teal-*` names onto the crimson/cream/gold palette, so:

| Raw hex | Canonical class |
| --- | --- |
| `#fdf8f0` | `cyan-50` |
| `#faefdc` | `cyan-100` |
| `#f5ddba` | `cyan-200` |
| `#efc48c` | `cyan-300` |
| `#e5a457` | `cyan-400` |
| `#d18029` | `cyan-500` |
| `#b5691f` | `cyan-600` |
| `#96521d` | `cyan-700` |
| `#7a431d` | `cyan-800` |
| `#64381b` | `cyan-900` |
| `#361c0c` | `cyan-950` |
| `#fdf3f4` | `teal-50` |
| `#fbe4e7` | `teal-100` |
| `#f6c8ce` | `teal-200` |
| `#efa1ac` | `teal-300` |
| `#e26d7e` | `teal-400` |
| `#d33c53` | `teal-500` |
| `#c01e2e` | `teal-600` |
| `#a11526` | `teal-700` |
| `#84121f` | `teal-800` |
| `#6d121c` | `teal-900` |
| `#3d050c` | `teal-950` |

Also prefer these over their hex forms — they are tokens too:

| Raw hex | Canonical class | Raw hex | Canonical class |
| --- | --- | --- | --- |
| `#c01e2e` | `brand` | `#faf6ee` | `cream` |
| `#9e1526` | `brand-dark` | `#f3ead9` | `cream-deep` |
| `#3d050c` | `brand-deep` | `#ece1cf` | `sand` |
| `#d18029` | `gold` | `#2f211b` | `ink` |
| `#96521d` | `gold-dark` | `#d48b92` | `rose` |

Opacity must use the plain modifier form too: `bg-brand/4`, never `bg-brand/[0.04]`; `bg-brand/3.5`, never `bg-brand/[0.035]`.

A raw hex is only acceptable when it is genuinely not a theme token (e.g. `#f7ecdb`, `#f2e2cc`, `#8d1222`). This rule applies to CSS *classes* only — hexes inside inline `style`, `<svg>`, recharts props, and `<style>` blocks are fine.

Search the whole file for the same hex elsewhere before you consider the task complete; the editor only flags files that are open.

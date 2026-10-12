# Changelog — fysigo-mcp

## 1.1.1 — 2026-10-12

Written against tool catalog `86fb279bb5d9`. The tools now carry MCP annotations (read-only, replaces existing content, safe to repeat). The skill names the two writes that replace what was there and the three that are not safe to repeat.

## 1.1.0 — 2026-10-12

Written against tool catalog `90b68c942796`. Changes after a dry run in which an agent holding only this skill did the three jobs against a real account:

- What to do when `fysigo-program-builder` is not installed (copy the shape of an existing program; let `validate_program` name the gaps), and that `validate_program` returns `warnings`.
- Read the program back after `edit_program`, and check the program's own prose after adding or removing a drill.
- Assignments carry a client id, not a name. Which assignment to pick for adherence.
- `history` percentages use a different base than `completionPct` and must not be compared with it.
- `marketplace` visibility exists and cannot be set here.

## 1.0.0 — 2026-10-12

Initial release. Written against tool catalog `f1a74bd8b103` (11 tools).

- The three jobs: build or change a program, give a program to someone and see who has what, review the week and log drills.
- How to read `evidence` and `unknowns`, and how to report them to the coach.
- What each error code means and what to do next.
- `references/tools.md` is generated from the server's code (`npm run gen:mcp-catalog` in the Fysigo repo). Do not edit it by hand.

## How this skill stays true

`metadata.catalog_version` in `SKILL.md` is set by hand. When a tool changes, the catalog version changes and CI fails until someone re-reads this skill against the new tools and updates that line.

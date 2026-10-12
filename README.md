<div align="center">

# Fysigo Coach Skills

**Build training programs in Claude. Upload to Fysigo. Done.**

Open-source [Claude Skills](https://www.anthropic.com/news/skills) and AI tooling for coaches on [Fysigo](https://fysigo.com).

</div>

---

## What this is

A small set of Claude-native skills that turn a coach's plain-English thinking into the *exact* JSON files Fysigo accepts for upload. No web app to learn, no schema to memorize — you describe the program, Claude writes the file, you drag it into Fysigo.

The first skill ships today:

| Skill | What it builds | Status |
| --- | --- | --- |
| [`fysigo-program-builder`](./skills/fysigo-program-builder) | Corrective training programs | ✅ Stable |
| [`fysigo-mcp`](./skills/fysigo-mcp) | Nothing to upload. It teaches your AI to use the Fysigo MCP tools: build and change programs, assign them, review the week | ✅ Stable |
| `fysigo-program-builder` — strength | 4/5-day strength cycles | 🚧 Phase 2 |
| `fysigo-program-builder` — HEP | Home-exercise protocols | 🚧 Phase 3 |
| `fysigo-supplement-builder` | Supplement schedules | 🚧 Next |

---

## How it works

```
  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
  │  1. Paste skill │ ──▶ │  2. Describe    │ ──▶ │  3. Drag JSON   │
  │     into Claude │     │     the program │     │     into Fysigo │
  └─────────────────┘     └─────────────────┘     └─────────────────┘
```

You talk to Claude the way you'd brief a junior coach. Claude asks the right questions, drafts the program, hands you a `program.json` that Fysigo's upload endpoint accepts on the first try.

---

## Quick start (90 seconds)

Pick whichever Claude surface you already use.

### Claude.ai (Projects)

1. Create a new **Project** at [claude.ai](https://claude.ai).
2. Open **Project instructions** → paste the full contents of [`skills/fysigo-program-builder/system-prompt.md`](./skills/fysigo-program-builder/system-prompt.md).
3. **Upload** these two files to the Project:
   - [`skills/fysigo-program-builder/schema/corrective.schema.json`](./skills/fysigo-program-builder/schema/corrective.schema.json)
   - [`skills/fysigo-program-builder/examples/daniel-corrective.json`](./skills/fysigo-program-builder/examples/daniel-corrective.json)
4. Start a chat in that Project with: *"Help me build a corrective program for a client with anterior pelvic tilt and a desk job."*

### Claude Desktop / Claude Code

1. Clone this repo:
   ```bash
   git clone https://github.com/GutenGroup/fysigo-coach-skills.git
   ```
2. Install the skill:
   ```bash
   # Claude Code
   cp -R fysigo-coach-skills/skills/fysigo-program-builder ~/.claude/skills/
   cp -R fysigo-coach-skills/skills/fysigo-mcp ~/.claude/skills/

   # or symlink so updates flow through
   ln -s "$(pwd)/fysigo-coach-skills/skills/fysigo-program-builder" ~/.claude/skills/fysigo-program-builder
   ln -s "$(pwd)/fysigo-coach-skills/skills/fysigo-mcp" ~/.claude/skills/fysigo-mcp
   ```
3. In any Claude session, type **`/fysigo-program-builder`** (or just say *"build me a Fysigo corrective program"*).

### Smoke test

Once installed, run:

> *"Smoke test: generate the smallest valid corrective program for a client named **Test User**, 4 weeks, problem is **mild thoracic kyphosis**."*

You should get back a JSON block with `schemaVersion: 1`, `type: "corrective"`, one category, one drill, and a signed `from_coach` block. Save it to `test.json` and run:

```bash
node skills/fysigo-program-builder/validate.mjs test.json
# ✓ Valid — ready to upload to Fysigo
```

---

## Working live with the Fysigo MCP

If your AI is connected to Fysigo (Fysigo → **Settings → Integrations**), you do not need to drag files. Install [`fysigo-mcp`](./skills/fysigo-mcp) next to `fysigo-program-builder` and your AI can:

- build a program, check it and save it to your library;
- assign it to a client or to yourself, and show who is on what;
- review a client's week drill by drill.

Every answer names the records it came from and what it could not tell you. The skill teaches your AI to pass both on instead of guessing. The full tool list is in [`skills/fysigo-mcp/references/tools.md`](./skills/fysigo-mcp/references/tools.md); it is generated from Fysigo's code.

---

## What a great program looks like

The skill enforces six rules so the output isn't just *valid*, it's *good*:

1. **One principle, one sentence.** `metadata.principle_md` should fit on one line.
2. **Name the mechanism.** `from_coach.problem_md` says *why* this body is doing what it's doing, not just the symptom.
3. **Weekly targets, not daily counts.** `weekly_targets[].target_count` is sessions/sets per week — coaches who want daily rigor are usually disguising a fragile plan.
4. **≤ ~12 drills total.** Anything past that is a wishlist, not a program.
5. **`inject_into_strength` is opt-in.** Only fill it if the coach explicitly wants drills folded into a strength program.
6. **Sign and date it.** `from_coach.signature` is the coach's name + today's date.

Open [`examples/daniel-corrective.json`](./skills/fysigo-program-builder/examples/daniel-corrective.json) for a real, complete one.

---

## Validating before upload

Every skill ships with a zero-install CLI validator:

```bash
node skills/fysigo-program-builder/validate.mjs my-program.json
# or, for the markdown form:
node skills/fysigo-program-builder/validate.mjs my-program.md
```

Output is either `✓ Valid — ready to upload to Fysigo` or a list of issues with the field path, what's wrong, and how to fix it. Same error language as the live Fysigo upload endpoint.

---

## Uploading to Fysigo

See [`docs/UPLOAD.md`](./docs/UPLOAD.md) for the 3-click upload flow.

Short version: sign in as a coach → `/coach/programs/new` → drag the file → confirm.

---

## Roadmap

| | |
| --- | --- |
| **v1.0** | Corrective programs — ships today |
| **v1.1** | Strength programs (4/5-day splits, primary/accessory roles, deload weeks) |
| **v1.2** | HEP (home exercise) programs |
| **v1.3** | Supplement schedules |
| **v2.0** | Multi-skill bundle + auto-update via `git pull` |

---

## Contributing

Found a coach workflow that doesn't fit? Open an issue. The skills here are versioned per skill — patch a skill without breaking the others.

The corrective JSON schema is **generated from Fysigo's server-side zod schema**, not hand-written. If the contract changes upstream, run `node scripts/export-program-schema.mjs` in the Fysigo repo and commit the regenerated file here. Drift is impossible by design.

---

## License

MIT. Build whatever you want on top of this.

---

<div align="center">
<sub>Made by <a href="https://fysigo.com">Fysigo</a>. Coach-first, AI-native, human-signed.</sub>
</div>

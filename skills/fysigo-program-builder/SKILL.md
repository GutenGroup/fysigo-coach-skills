---
name: fysigo-program-builder
description: Author Fysigo corrective training programs as Claude. Coach describes the client and the problem in plain English; the skill asks the right questions, drafts every markdown field in the coach's voice, kebab-cases ids, and emits a JSON file that Fysigo's upload endpoint accepts on the first try. Use whenever a coach says "build a Fysigo program", "make a corrective for <client>", "Fysigo JSON", or any synonym about authoring a Fysigo program. Currently supports type=corrective (Phase 1). Strength and HEP types are Phase 2 / Phase 3 — refuse politely and point to the in-app builder.
version: 1.0.0
license: MIT
---

# Fysigo Program Builder

You are an extension of the coach using Fysigo. The coach thinks in language; you turn that language into a Fysigo-valid program JSON file.

## How to use this skill

When this skill loads, follow this protocol exactly. Do not skip phases. Do not output JSON before Phase B.

### Phase A — Discovery (one short turn)

Ask the coach 5-7 questions in a single message. Numbered list. No preamble.

1. **Client first name** (used in the program name and prose — never their last name).
2. **What's the problem, in your words?** (one or two sentences — this becomes `problem_md` after you sharpen it).
3. **What does the client already do in the gym?** (this informs `why_gym_alone_md` and `inject_into_strength`).
4. **Duration in weeks** (integer; 4-12 is typical).
5. **Drill categories you have in mind**, or *"you pick"*. (e.g. `hip-mobility`, `thoracic-extension`, `breathing`.)
6. **What does success look like at the end of the program?** (becomes `what_to_expect_md`).
7. **Your name and title for the signature.** (e.g. `Dr. Jane Smith, DPT`.)

Wait for answers before continuing.

### Phase B — Draft (one turn)

Produce a single JSON code block. Every `*_md` field must be **written in the coach's voice** — never a placeholder, never lorem ipsum. Follow `system-prompt.md` (the canonical instructions doc) for tone and the six quality rules.

Kebab-case rules:

- `volume_targets[].category` and `volume_targets[].weekly_targets[].id` must match `^[a-z0-9-]+$`. Lowercase, hyphens between words, no spaces or slashes. Do this automatically — don't ask.

Required structure:

```jsonc
{
  "schemaVersion": 1,
  "type": "corrective",
  "metadata": { "name": "...", "duration_weeks": 6, "principle_md": "..." },
  "from_coach": {
    "problem_md": "...",
    "why_gym_alone_md": "...",
    "what_correctives_do_md": "...",
    "why_this_approach_md": "...",
    "what_to_expect_md": "...",
    "signature": { "name": "...", "title": "...", "date": "<today YYYY-MM-DD>" }
  },
  "volume_targets": [
    {
      "category": "hip-mobility",
      "category_label": "Hip Mobility",
      "description_md": "...",
      "weekly_targets": [
        {
          "id": "90-90-hip-rotation",
          "name": "90/90 Hip Rotation",
          "target_count": 3,
          "unit": "sessions",
          "instructions_md": "...",
          "why_md": "...",
          "tags": ["priority"]
        }
      ]
    }
  ]
}
```

Reference [`examples/daniel-corrective.json`](./examples/daniel-corrective.json) for a real, fully-written program.

### Phase C — Review (in the same turn as Phase B, immediately after the JSON)

Print this 6-point checklist with ✓ / ✗ next to each, based on the JSON you just drafted:

- [ ] `metadata.principle_md` fits on one sentence.
- [ ] `from_coach.problem_md` names the mechanism, not just the symptom.
- [ ] All `weekly_targets[].target_count` are *weekly* counts, not daily.
- [ ] Total drill count across all categories is ≤ 12.
- [ ] `inject_into_strength` is only present if the coach asked for it.
- [ ] `from_coach.signature.date` is today.

If any line is ✗, fix the JSON before showing it. Do not ask the coach to fix it.

### Phase D — Output (one short turn)

After the coach signs off, offer two artifact options:

> "**Download options.** Two files, same content — pick one and drag it into [fysigo.com/coach/programs/new](https://fysigo.com/coach/programs/new):
> 1. `program.json` (recommended)
> 2. `program.md` (markdown with frontmatter, useful for git / sharing)
>
> Want to validate locally first? Save to a folder and run:
> `node validate.mjs program.json`"

Then produce both files as separate artifacts/code blocks.

## Hard rules

1. **Never** invent medical claims. Mechanism-level language only (*"trains hip internal rotation"*, not *"cures hip pain"*).
2. **Never** ship JSON that fails `corrective.schema.json`. If a field is unclear, ask the coach.
3. **Never** output `type: "strength"` or `type: "hep"` — those are Phase 2/3. If asked, reply:
   > "Strength / HEP authoring isn't supported by this skill yet — Phase 2/3 of Fysigo's roadmap. For now, use the in-app builder at /coach/programs/new → 'Build with the form'."
4. **Always** include `schemaVersion: 1` and `type: "corrective"`.
5. **Always** sign with the coach's actual name and today's date.

## Files in this skill

| File | Purpose |
| --- | --- |
| [`SKILL.md`](./SKILL.md) | This file. The Claude Skill manifest. |
| [`system-prompt.md`](./system-prompt.md) | The canonical instructions. Paste this into Claude.ai Project instructions. |
| [`schema/corrective.schema.json`](./schema/corrective.schema.json) | JSON Schema, generated from Fysigo's server-side zod. Authoritative. |
| [`schema/corrective.types.md`](./schema/corrective.types.md) | Plain-English field reference. |
| [`examples/daniel-corrective.json`](./examples/daniel-corrective.json) | Real, complete example program. |
| [`examples/daniel-corrective.md`](./examples/daniel-corrective.md) | Same payload, frontmatter form. |
| [`examples/minimal.json`](./examples/minimal.json) | Smallest valid program (for smoke tests). |
| [`templates/corrective.template.json`](./templates/corrective.template.json) | Scaffold with `{{placeholders}}`. |
| [`validate.mjs`](./validate.mjs) | Zero-dep CLI validator. |

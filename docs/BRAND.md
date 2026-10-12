# Fysigo brand cheatsheet — for skill output

When the skill writes a program, the prose lives inside Fysigo and inherits Fysigo's voice. Match it.

## Tone

- **Direct.** No hedging. *"Spend 3 sessions a week on hip mobility"*, not *"Try to maybe aim for some hip mobility work when you can."*
- **Kind.** The client is reading this. Talk to them, not about them.
- **No medical theatre.** Skip *"may help with"*, *"could potentially"*, *"some studies suggest"*. Say what the work does or don't say it.
- **No jargon walls.** *"Forward head posture"* > *"upper crossed syndrome with cervical anterior displacement"*. If a word would lose them, use a different one.

## Voice in each markdown field

| Field | Voice |
| --- | --- |
| `metadata.principle_md` | One sentence. The single bet of the program. |
| `from_coach.problem_md` | What's actually happening in their body, in plain English. |
| `from_coach.why_gym_alone_md` | Honest: why their current training won't fix it on its own. |
| `from_coach.what_correctives_do_md` | What the correctives do at the mechanism level. |
| `from_coach.why_this_approach_md` | Why *this* program, not a generic mobility routine. |
| `from_coach.what_to_expect_md` | A specific 6-week arc — week-by-week if useful. |
| `weekly_targets[].description_md` | Why this category, in two sentences max. |
| `weekly_targets[].weekly_targets[].instructions_md` | How to execute. Cues, reps, position. Bullet points OK. |
| `weekly_targets[].weekly_targets[].why_md` | One sentence: what tissue/system this drill is addressing. |

## Visual identity (for README badges, headers in coach-facing docs)

- **Lime** `#D0F229` — accent, never as a full background.
- **Black canvas** `#0F0F0F` — base.
- **Off-white** `#F3F3F3` — primary ink.
- **Mono labels** in `uppercase tracking-wide` — for the small section labels above blocks.
- **Type** — Montserrat for everything; mono for labels and code.

These tokens come from Fysigo's brand book, which is the source of truth.

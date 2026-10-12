# Corrective program — field reference

Plain-English companion to `corrective.schema.json`. If you only read one schema doc, read this one.

## Top level

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `schemaVersion` | `1` | ✅ | Literal. Pinned at 1 for now. |
| `type` | `"corrective"` | ✅ | Literal. Strength and HEP types are Phase 2/3. |
| `metadata` | object | ✅ | Program-level identity. |
| `from_coach` | object | ✅ | The letter to the client. Markdown. |
| `volume_targets` | array | ✅ | At least one category. |
| `inject_into_strength` | object | ❌ | Only if you want drills folded into a strength program. |
| `missing_piece_md` | string | ❌ | "Here's what this program won't fix" — optional honesty box. |

## `metadata`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | ✅ | Free text. Becomes the program slug. |
| `duration_weeks` | positive integer | ✅ | 4-12 typical. |
| `principle_md` | string (markdown) | ✅ | **One sentence.** The single bet. |

## `from_coach`

All fields are markdown strings. Trimmed; non-empty.

| Field | Voice |
| --- | --- |
| `problem_md` | What's actually happening in their body. Mechanism, not symptom. |
| `why_gym_alone_md` | Honest: why their current training won't fix it on its own. |
| `what_correctives_do_md` | What these drills do at the mechanism level. |
| `why_this_approach_md` | Why *this* program, not a generic mobility routine. |
| `what_to_expect_md` | Specific 6-week arc. Week-by-week if useful. |
| `signature.name` | Coach's full name. |
| `signature.title` | Optional credential (e.g. `DPT`, `CSCS`). |
| `signature.date` | `YYYY-MM-DD`. Today. |

## `volume_targets[]`

Each entry is a **category** (e.g. hip mobility, breathing, thoracic extension).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `category` | kebab-case id | ✅ | `^[a-z0-9-]+$`. |
| `category_label` | string | ✅ | Display name. |
| `description_md` | markdown | ❌ | 1-2 sentences max. |
| `weekly_targets` | array | ✅ | ≥ 1 drill. |

### `weekly_targets[]` (drills)

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | kebab-case id | ✅ | Globally unique within the program. |
| `name` | string | ✅ | Display name. |
| `target_count` | positive integer | ✅ | **Weekly** count. Default unit = `sessions`. |
| `unit` | enum | ❌ | `sessions` \| `sets` \| `minutes` \| `reps`. Default `sessions`. |
| `duration_per` | string | ❌ | Free text e.g. `"10 min"`. |
| `instructions_md` | markdown | ✅ | How to perform. Cues, position, breath. |
| `why_md` | markdown | ❌ | One-sentence rationale. |
| `tags` | array | ❌ | Subset of `daily \| weekly \| priority \| unilateral \| gym`. |
| `video_url` | URL or null | ❌ | Optional reference video. |

## `inject_into_strength` (optional)

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `enabled` | boolean | ✅ | Master switch. |
| `target_program_slug` | string | ❌ | The strength program to inject into, by slug. |
| `injections` | array | ✅ | Per-workout-type injection rules. |

### `injections[]`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `match.workout_type` | string | ✅ | e.g. `"regular"`, `"deload"`. |
| `exercises[]` | array | ✅ | ≥ 1 exercise. |
| `exercises[].name` | string | ✅ | Display name. |
| `exercises[].sets` | positive integer | ❌ | |
| `exercises[].reps` | string | ❌ | Free text e.g. `"8-10"`, `"to failure"`. |
| `exercises[].cues_md` | markdown | ❌ | One-line cue. |

## Conventions

- **Kebab-case** is non-negotiable for `category` and `weekly_targets[].id`. The skill kebabs them automatically; don't fight it.
- **Dates** are `YYYY-MM-DD` (ISO 8601 date only). No times, no timezones.
- **Markdown** in `*_md` fields is rendered with line breaks and lists. Keep it short.
- **No extra keys.** The schema is strict — unknown keys are rejected on upload.

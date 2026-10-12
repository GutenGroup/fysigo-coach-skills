# Troubleshooting

Common validation errors and how to fix them. Issue paths match the field that's wrong.

| Error | Path | Fix |
| --- | --- | --- |
| `Missing or unrecognized program type` | `type` | Set `"type": "corrective"`. Phase 1 supports corrective only. |
| `Expected number` on `duration_weeks` | `metadata.duration_weeks` | Use a positive integer like `6`, not `"6 weeks"`. |
| `Expected YYYY-MM-DD` | `from_coach.signature.date` | Date must be `2026-05-26` style, not `May 26 2026`. |
| `drill id must be kebab-case` | `volume_targets.*.weekly_targets.*.id` | `90-90-hip-rotation`, not `90/90 Hip Rotation`. |
| `category must be kebab-case` | `volume_targets.*.category` | `hip-mobility`, not `Hip Mobility`. |
| `Remove unknown keys: ...` | varies | Strict mode rejects extra fields. Delete what the schema doesn't define. |
| `Minimum 1` on `weekly_targets` | `volume_targets.*.weekly_targets` | Every category needs at least one drill. |
| `Phase 1 supports the corrective type only` | (server) | Only `type: "corrective"` is accepted at upload right now. Strength/HEP are Phase 2/3. |

## Re-running validation

```bash
node skills/fysigo-program-builder/validate.mjs path/to/program.json
```

The CLI prints the *exact* same `issues[]` array the server would return on a failed upload. Fix until you see `✓ Valid`, then upload.

## When the file uploads but the page looks wrong

The schema is structural — it can't catch *bad coaching*. If a program uploads cleanly but reads weird, check the six principles in [`README.md` → "What a great program looks like"](../README.md#what-a-great-program-looks-like) and re-run the skill with those in mind.

## When you're stuck

Open an issue on this repo with:

1. The exact prompt you gave Claude.
2. The JSON the skill produced.
3. The validator's output.

That's enough for us to repro every time.

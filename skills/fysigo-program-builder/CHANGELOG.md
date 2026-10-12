# Changelog — fysigo-program-builder

## 1.0.0 — 2026-05-26

Initial release.

- Corrective program authoring (Phase 1 of Fysigo's program upload contract).
- Skill prompt with discovery → draft → review → output protocol.
- JSON Schema (`corrective.schema.json`) generated from the server-side zod via `scripts/export-program-schema.mjs`.
- Zero-dep CLI validator (`validate.mjs`) — output mirrors the server's `ValidationIssue` shape.
- Two examples (`daniel-corrective.json/.md`) + smoke-test minimal payload.
- Setup guides for Claude.ai Projects, Claude Desktop, Claude Code.

## Roadmap

- 1.1.0 — Strength program authoring (gated on server-side `validateStrengthPayload`).
- 1.2.0 — HEP authoring.
- 2.0.0 — Multi-skill bundle (corrective + strength + HEP + supplements) with shared validator.

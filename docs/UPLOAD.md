# Uploading a program to Fysigo

You generated a `program.json` (or `program.md`) with the skill. Here's how it gets into Fysigo.

## 1. Sign in as a coach

Go to [fysigo.com](https://fysigo.com) and sign in. You need the `coach` (or `admin`) role on your tenant — if you don't have it, ask the Fysigo team.

## 2. Open the authoring workspace

Navigate to **`/coach/programs/new`** — or from the coach dashboard: **Programs → New program**.

## 3. Drag the file in

The workspace has three sources:

- **Upload JSON** — drag your `program.json` straight onto the dropzone.
- **Upload Markdown** — drag your `program.md` (frontmatter form) onto the same dropzone.
- **Build with the form** — the in-app fallback if you ever skip the Claude flow.

Fysigo validates against the same zod schema you validated against locally. If anything is off you'll get the same human-readable issues as the CLI validator showed — only this time inline, next to the offending field.

## 4. Pick visibility

- **Private** — only you can see this program. Default.
- **Tenant** — everyone on your coaching practice's tenant can assign it.
- **Marketplace** — *deferred, Phase 6*. Coming when Fysigo opens the public program marketplace.

## 5. Save & assign

Hit **Publish**. You land on the program detail page (`/coach/programs/<slug>`) where you can **Assign to client**. Assignment is calendar-aware: pick a starting Monday in the client's local timezone, the rest is handled.

---

## What the upload endpoint expects

The skill outputs exactly what `POST /api/programs/upload` validates. For the curious or the API-driven:

```http
POST /api/programs/upload
Content-Type: application/json
Cookie: <fysigo session>

{
  "payload": { /* the JSON the skill produced */ },
  "source": "fysigo-skill",
  "visibility": "private"
}
```

Successful response:

```json
{
  "id": "...",
  "slug": "anterior-tilt-reset",
  "type": "corrective",
  "payload": { ... },
  "visibility": "private",
  "status": "published"
}
```

Failure response (HTTP 400):

```json
{
  "error": "Payload validation failed.",
  "type": "corrective",
  "issues": [
    { "path": "metadata.duration_weeks", "reason": "Expected number", "code": "invalid_type" }
  ]
}
```

The `issues[]` shape matches what `validate.mjs` prints — so a clean local run guarantees a clean upload.

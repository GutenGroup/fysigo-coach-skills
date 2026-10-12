#!/usr/bin/env node
/**
 * validate.mjs — Fysigo corrective program payload validator.
 *
 * Zero-dependency. Mirrors the server-side zod schema at
 * src/lib/programs/schemas/corrective.ts in the main Fysigo repo. Output
 * uses the same `ValidationIssue` shape Fysigo's upload endpoint returns,
 * so a clean local run guarantees a clean upload.
 *
 * Usage:
 *   node validate.mjs path/to/program.json
 *   node validate.mjs path/to/program.md     # frontmatter form
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const KEBAB = /^[a-z0-9-]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ENUM_UNITS = ["sessions", "sets", "minutes", "reps"];
const ENUM_TAGS = ["daily", "weekly", "priority", "unilateral", "gym"];

const issues = [];

function add(path, reason, suggestion) {
  issues.push({ path: path || "(root)", reason, suggestion });
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}
function isPositiveInt(v) {
  return typeof v === "number" && Number.isInteger(v) && v > 0;
}

function checkSignature(sig, p) {
  if (!sig || typeof sig !== "object") return add(p, "Expected object");
  if (!isNonEmptyString(sig.name)) add(`${p}.name`, "Required non-empty string");
  if (sig.title !== undefined && typeof sig.title !== "string") add(`${p}.title`, "Must be a string");
  if (!isNonEmptyString(sig.date) || !ISO_DATE.test(sig.date)) {
    add(`${p}.date`, "Expected YYYY-MM-DD", "Use today's date in ISO form, e.g. 2026-05-26");
  }
}

function checkFromCoach(fc, p) {
  if (!fc || typeof fc !== "object") return add(p, "Expected object");
  for (const k of [
    "problem_md",
    "why_gym_alone_md",
    "what_correctives_do_md",
    "why_this_approach_md",
    "what_to_expect_md",
  ]) {
    if (!isNonEmptyString(fc[k])) add(`${p}.${k}`, "Required non-empty markdown string");
  }
  checkSignature(fc.signature, `${p}.signature`);
}

function checkDrill(d, p) {
  if (!d || typeof d !== "object") return add(p, "Expected object");
  if (!isNonEmptyString(d.id) || !KEBAB.test(d.id)) {
    add(`${p}.id`, "drill id must be kebab-case", "e.g. 90-90-hip-rotation");
  }
  if (!isNonEmptyString(d.name)) add(`${p}.name`, "Required non-empty string");
  if (!isPositiveInt(d.target_count)) add(`${p}.target_count`, "Required positive integer");
  if (d.unit !== undefined && !ENUM_UNITS.includes(d.unit)) {
    add(`${p}.unit`, `One of: ${ENUM_UNITS.join(", ")}`);
  }
  if (d.duration_per !== undefined && typeof d.duration_per !== "string") {
    add(`${p}.duration_per`, "Must be a string");
  }
  if (!isNonEmptyString(d.instructions_md)) add(`${p}.instructions_md`, "Required non-empty markdown");
  if (d.why_md !== undefined && typeof d.why_md !== "string") add(`${p}.why_md`, "Must be a string");
  if (d.tags !== undefined) {
    if (!Array.isArray(d.tags)) add(`${p}.tags`, "Must be an array");
    else d.tags.forEach((t, i) => {
      if (!ENUM_TAGS.includes(t)) add(`${p}.tags.${i}`, `One of: ${ENUM_TAGS.join(", ")}`);
    });
  }
  if (d.video_url !== undefined && d.video_url !== null) {
    try { new URL(d.video_url); } catch { add(`${p}.video_url`, "Must be a valid URL or null"); }
  }
}

function checkCategory(c, p) {
  if (!c || typeof c !== "object") return add(p, "Expected object");
  if (!isNonEmptyString(c.category) || !KEBAB.test(c.category)) {
    add(`${p}.category`, "category must be kebab-case", "e.g. hip-mobility");
  }
  if (!isNonEmptyString(c.category_label)) add(`${p}.category_label`, "Required non-empty string");
  if (c.description_md !== undefined && typeof c.description_md !== "string") {
    add(`${p}.description_md`, "Must be a string");
  }
  if (!Array.isArray(c.weekly_targets) || c.weekly_targets.length === 0) {
    add(`${p}.weekly_targets`, "At least one drill required");
  } else {
    c.weekly_targets.forEach((d, i) => checkDrill(d, `${p}.weekly_targets.${i}`));
  }
}

function checkInjectStrength(i, p) {
  if (i === undefined) return;
  if (!i || typeof i !== "object") return add(p, "Expected object");
  if (typeof i.enabled !== "boolean") add(`${p}.enabled`, "Required boolean");
  if (i.target_program_slug !== undefined && typeof i.target_program_slug !== "string") {
    add(`${p}.target_program_slug`, "Must be a string");
  }
  const inj = i.injections ?? [];
  if (!Array.isArray(inj)) return add(`${p}.injections`, "Must be an array");
  inj.forEach((rule, idx) => {
    const rp = `${p}.injections.${idx}`;
    if (!rule.match || !isNonEmptyString(rule.match.workout_type)) {
      add(`${rp}.match.workout_type`, "Required non-empty string");
    }
    if (!Array.isArray(rule.exercises) || rule.exercises.length === 0) {
      add(`${rp}.exercises`, "At least one exercise required");
    } else {
      rule.exercises.forEach((e, j) => {
        const ep = `${rp}.exercises.${j}`;
        if (!isNonEmptyString(e.name)) add(`${ep}.name`, "Required non-empty string");
        if (e.sets !== undefined && !isPositiveInt(e.sets)) add(`${ep}.sets`, "Must be a positive integer");
        if (e.reps !== undefined && typeof e.reps !== "string") add(`${ep}.reps`, "Must be a string");
        if (e.cues_md !== undefined && typeof e.cues_md !== "string") add(`${ep}.cues_md`, "Must be a string");
      });
    }
  });
}

function checkPayload(o) {
  if (!o || typeof o !== "object") return add("(root)", "Expected JSON object");
  if (o.schemaVersion !== 1) add("schemaVersion", "Must equal 1");
  if (o.type !== "corrective") {
    add("type", "Must equal 'corrective'", "Phase 1 supports the corrective type only");
  }
  const m = o.metadata;
  if (!m || typeof m !== "object") add("metadata", "Expected object");
  else {
    if (!isNonEmptyString(m.name)) add("metadata.name", "Required non-empty string");
    if (!isPositiveInt(m.duration_weeks)) add("metadata.duration_weeks", "Required positive integer");
    if (!isNonEmptyString(m.principle_md)) add("metadata.principle_md", "Required non-empty markdown");
  }
  checkFromCoach(o.from_coach, "from_coach");
  if (!Array.isArray(o.volume_targets) || o.volume_targets.length === 0) {
    add("volume_targets", "At least one category required");
  } else {
    o.volume_targets.forEach((c, i) => checkCategory(c, `volume_targets.${i}`));
  }
  checkInjectStrength(o.inject_into_strength, "inject_into_strength");
  if (o.missing_piece_md !== undefined && typeof o.missing_piece_md !== "string") {
    add("missing_piece_md", "Must be a string");
  }
}

function readPayloadFromFile(path) {
  const raw = readFileSync(path, "utf8");
  if (path.endsWith(".md")) {
    const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
    if (!m) throw new Error("No frontmatter block found in markdown file.");
    const fm = m[1];
    const payloadMatch = /(^|\n)payload:\s*\|\s*\n([\s\S]+)$/.exec(fm);
    if (!payloadMatch) throw new Error("Frontmatter must contain a `payload: |` block.");
    const indented = payloadMatch[2];
    // strip one level of indentation
    const dedented = indented.replace(/^[ \t]{2,}/gm, "");
    return JSON.parse(dedented);
  }
  return JSON.parse(raw);
}

const target = process.argv[2];
if (!target) {
  console.error("Usage: node validate.mjs <program.json | program.md>");
  process.exit(2);
}

let payload;
try {
  payload = readPayloadFromFile(resolve(target));
} catch (err) {
  console.error(`\x1b[31m✗ Could not read ${target}: ${err.message}\x1b[0m`);
  process.exit(2);
}

checkPayload(payload);

if (issues.length === 0) {
  console.log("\x1b[32m✓ Valid — ready to upload to Fysigo\x1b[0m");
  process.exit(0);
} else {
  console.log(`\x1b[31m✗ ${issues.length} issue(s) — fix and re-run\x1b[0m\n`);
  for (const i of issues) {
    console.log(`  • ${i.path}`);
    console.log(`      ${i.reason}`);
    if (i.suggestion) console.log(`      → ${i.suggestion}`);
  }
  process.exit(1);
}

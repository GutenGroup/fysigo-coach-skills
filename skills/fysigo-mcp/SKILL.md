---
name: fysigo-mcp
description: Run a Fysigo coaching practice through the Fysigo MCP server. Use when the Fysigo tools are connected and a coach or member asks to build, change, assign, review or log a training program, for example "put Maria on a hip program", "who is on what", "how did Anna do this week" or "log my drills". Teaches the eleven tools, the order to call them in, and how to report what a result is based on and what it cannot tell.
version: 1.1.1
license: MIT
metadata:
  catalog_version: "86fb279bb5d9"
---

# Fysigo MCP

You are working inside one person's Fysigo account through the Fysigo MCP server. Every call runs as
that person. Fysigo decides what they may see; you never get more than they would see in the app.

The full tool list, with every argument, is in [`references/tools.md`](./references/tools.md). It is
generated from the server's code. Read it when you need an argument you are not sure of.

## Before the first call

- **No Fysigo tools in this session?** The server is not connected. Send the person to
  **Settings → Integrations** in Fysigo; the steps for their AI app are there.
- **Two plans.** The personal plan covers the person's own programs. The Coach package also covers
  their clients. A call that needs the other plan answers `upgrade_required`. Say so and stop.
- **Ids are never guessed.** Every `programId`, `assignmentId` and `clientId` comes from an earlier
  result or from the person.

## Job 1: build or change a program

1. Draft the program payload. For a corrective program use the `fysigo-program-builder` skill if it
   is installed; it holds the payload schema and writes in the coach's voice. JSON and that skill's
   markdown are both accepted. Without it, read a program of the same type with `get_program` and
   follow its shape.
2. `validate_program`. It names every field that is missing or wrong, with its path. Fix each one
   and validate again. It also returns `warnings`: read them to the coach; they do not block
   saving. Nothing is saved yet.
3. Show the coach what you are about to save and wait for a yes.
4. `create_program`. The program is published in the coach's library and **assigned to no one**.
   Say that. Do not imply a client has it.

To change a program: `list_programs` → `get_program` (full payload) → edit the payload →
`validate_program` → coach's yes → `edit_program` → `get_program` again.

- `edit_program` replaces the whole payload. Send all of it, not a patch. A slip anywhere in what
  you re-send is saved, so after the edit read the program back and check that only what you meant
  to change is different.
- Adding or removing a drill can make the program's own text wrong ("six of these seven"). Read
  the prose around the change and tell the coach what no longer fits.
- **Keep drill ids stable.** Logs are stored per drill id. Rename an id and that drill's past logs
  stop showing per drill.
- The program type cannot change. Only the author can edit.
- `visibility: "tenant"` is a label for the coach's studio. It does not give anyone the content. A
  client reads a program only while they hold an active or paused assignment. A program can also
  show `marketplace`; this server cannot set or change that.
- `archive_program` shelves a program. It deletes nothing and ends no assignment. Clients running
  it keep it. `archived: false` brings it back.
- Home-exercise (HEP) programs are not supported.

## Job 2: give a program to someone, and see who has what

1. `list_programs` for the `programId`.
2. The `clientId`. There is **no tool that lists clients**. Take it from `list_assignments` if the
   client already has a program. Otherwise ask the coach to copy it from the client's page in
   Fysigo (the id is the part of that page's address right after `/coach/clients/`).
3. Coach's yes, then `assign_program`. Leave `clientId` out to assign to the person themselves.
4. `list_assignments` with that `clientId` to confirm.

- An assignment names its client by id, not by name. `self: true` marks the person's own. For
  anyone else, show the id and ask the coach who it is; do not guess a name.
- An assignment is `active`, `paused` or `ended`. Say which when you list them.
- Corrective and crossfit programs only. Strength programs cannot be assigned through this server.
- Only published programs can be assigned.
- Assigning to a client needs the Coach package and an active engagement with that client.
- `list_assignments` shows what this account can see. A client who is missing from it may still
  have assignments from someone else. Never report "no programs" as a fact about the client; report
  it as "none that you can see".

## Job 3: review the week and log drills

1. `list_assignments` for the `assignmentId`. Adherence exists for corrective programs only. Use
   the `active` assignment unless the coach names another; `paused` and `ended` ones keep their
   history.
2. `get_adherence`. Pass `weekIso` (`2026-W42`) when the coach names a week. Without it you get the
   server's current week, which near the week's edge may not be the client's. Early in a week
   "this week" has little in it: fetch the week before as well.
3. Report, per drill, the target and the completed count, then the week's `completionPct`.

- **`completed: 0` is "nothing logged", not "skipped".** Fysigo cannot tell them apart. Say
  "no sessions logged", never "did not do it".
- `history` has one entry per week that has a log record. A gap means nothing was logged that week.
- **`history` percentages are not comparable with the week's `completionPct`.** `history` counts
  only the drills that were logged that week; `completionPct` counts every drill. The same week can
  read 18% in `history` and 16% as `completionPct`. Report `completionPct` and the per-drill counts,
  and use `history` only to say which weeks had any logging.
- Counts are weekly totals. There are no days or times to report.
- `log_drill` adds or removes one completed session for one drill in one week. **Only the client
  can log their own drills.** A coach who tries gets `forbidden`; that is correct, not a bug.

## Supplements

`edit_client_supplement_schedule` needs the Coach package. It **replaces the client's whole
schedule**, and this server has no tool to read the current one. Call it only when the coach has
given you the complete schedule. Never send a partial one.

## Reading a result

Every result carries `evidence` and `unknowns`.

- `evidence.sources` says which records the answer came from and how many. `evidence.window` is the
  week it covers. `evidence.filters` is how a list was narrowed.
- `unknowns` is what the answer cannot tell you.

When you report to the coach:

1. Give the answer.
2. Say what it rests on: how many records, which program or assignment, which week.
3. Pass on every unknown that could change what the coach does next, in plain words.

Never present a result as more than its evidence. "Anna completed 4 of 9 logged sessions in week
42" is a result. "Anna is falling behind" is your opinion; mark it as one.

## When a call fails

| `code` | What it means | What you do |
| --- | --- | --- |
| `auth_required`, `invalid_token` | Not signed in, or the sign-in ended. | Ask the person to reconnect Fysigo. |
| `insufficient_scope` | The token lacks the permission named in the message. | Tell them which one. |
| `upgrade_required` | The plan does not cover this. Nothing was changed. | Say which plan it needs. Stop. |
| `rate_limit_exceeded` | Too many calls. | Wait `retryAfterSec`, then retry once. |
| `validation_failed` | The arguments or payload are wrong. `issues` lists each path. | Fix and retry. |
| `not_found` | The record does not exist, **or this account cannot see it**. Fysigo gives the same answer for both. | Say both. Do not try another route to it. |
| `forbidden` | This account may not do that. | Say so. |
| `internal_error` | The call failed. On a write it may have been saved in part. | **Read the record back before retrying.** After a failed `assign_program`, call `list_assignments` first. |

## Hard rules

1. No write without the coach's yes to that specific change. The writes are `create_program`,
   `edit_program`, `archive_program`, `assign_program`, `log_drill` and
   `edit_client_supplement_schedule`. Two of them replace what was there, and the old version is
   gone: `edit_program` and `edit_client_supplement_schedule`. Say so when you ask for the yes.
   `create_program`, `assign_program` and `log_drill` are not safe to repeat: after an unclear
   failure, read back before calling again or you make a second one.
2. Never invent an id, a count or a week.
3. This is health data. Discuss a client only with the person whose account you are in.
4. No medical claims. Say what the training does, not what it cures.
5. A `not_found` is an answer. Do not work around it.

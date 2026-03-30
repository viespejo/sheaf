# SHEAF Quickstart

A compact daily guide to run SHEAF with consistency and momentum.

## See also

- [README.md](./README.md) — full philosophy, workflows, references, and conventions

## Install SHEAF (once on your machine/workspace)

```bash
npx sheaf --to global
```

or local to current repository:

```bash
npx sheaf --to local
```

(Optional) With Claude Code support:

```bash
npx sheaf --to local --claude
```

Preview install without writing files:

```bash
npx sheaf --to local --dry-run
```

## 1) First-time setup (once per project)

Required docs:

- `docs/prd.md`
- `docs/architecture.md`

Run:

```text
/sheaf:init
```

This creates `.sheaf/` and routes you to `/sheaf:plan`.

## 2) Core loop (every work unit)

```text
PLAN → APPLY → UNIFY
```

- `/sheaf:plan` → create/approve one plan
- `/sheaf:apply [plan-path]` → execute tasks with explicit per-task decision
- `/sheaf:unify [plan-path]` → reconcile actual results, create summary, update state

Never skip UNIFY after APPLY.

## 3) Session continuity commands

- `/sheaf:resume` → start of session, restore context, get ONE next action
- `/sheaf:progress` → mid-session checkpoint, get ONE next action
- `/sheaf:handoff` → end session safely with continuity document
- `/sheaf:brainstorm [topic]` → run/continue a structured ideation session with persistent notes

Quick rule:

- new session → `resume`
- active session + unsure next step → `progress`
- need solution exploration before planning → `brainstorm`
- ending session / context risk → `handoff`

## 4) Daily routine

Start of day:

1. `/sheaf:resume`
2. follow the suggested next action

During work:

1. `/sheaf:brainstorm [topic]` (optional, when you need ideation first)
2. `/sheaf:plan`
3. `/sheaf:apply [plan-path]`
4. `/sheaf:unify [plan-path]`
5. `/sheaf:progress` if you need a checkpoint

End of day:

1. `/sheaf:handoff`
2. next session starts with `/sheaf:resume`

## 5) APPLY decisions (per task)

For each task in APPLY choose one:

1. manual (you apply, then confirm)
2. SHEAF apply (agent writes)
3. skip (logged deviation)

Outcomes are logged for UNIFY.

## 6) Routing cheat-sheet

- PLAN ○ → `/sheaf:plan`
- PLAN ✓, APPLY ○ → `/sheaf:apply [plan-path]`
- PLAN ✓, APPLY ✓, UNIFY ○ → `/sheaf:unify [plan-path]`
- PLAN ✓, APPLY ✓, UNIFY ✓ → `/sheaf:plan`
- blocked → resolve blocker first

Always choose one next action.

## 7) Essential files to trust

- `.sheaf/STATE.md` → current position and continuity
- `.sheaf/ROADMAP.md` → phase progress and scope
- `.sheaf/PROJECT.md` → project intent and constraints
- `.sheaf/phases/*/*-PLAN.md` → intended work
- `.sheaf/phases/*/*-SUMMARY.md` → actual delivered work

## 8) Good habits

- keep plans single-concern
- require explicit approval before APPLY
- keep `STATE.md` concise and current
- write handoff before context is lost
- end every command with one concrete next step

<loop_phases>

## Purpose

Explain the semantics of SHEAF's three loop phases: PLAN, APPLY, UNIFY. Every unit of work follows this loop. Skipping phases breaks traceability and increases risk.

## The Loop

```
    ┌─────────────────────────────────────────┐
    │                                         │
    ▼                                         │
  PLAN ────────► APPLY ────────► UNIFY ───────┘
    │              │               │
    │              │               │
 Define work   Execute with decisions   Reconcile
 Get approval  Apply/log tasks   Update state
```

## PLAN Phase

**Purpose:** Define what will be built, how it will be verified, and what's out of scope.

**Artifacts Created:**

- `{phase}-{plan}-PLAN.md` in `.sheaf/phases/{phase-name}/`

**Activities:**

1. Analyze requirements and context
2. Define objective (Goal, Purpose, Output)
3. Write acceptance criteria (Given/When/Then)
4. Break down into tasks with Files, Action, Verify, Done
5. Set boundaries (DO NOT CHANGE, SCOPE LIMITS)
6. Define verification checklist
7. **Wait for approval before proceeding**

**Entry Condition:**

- Prior plan completed (UNIFY done) OR first plan
- ROADMAP indicates this phase is next

**Exit Condition:**

- PLAN.md created with all required sections
- User has approved the plan
- STATE.md updated to show "ready for APPLY"

**Loop Position:**

```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ○        ○     [PLAN complete, awaiting APPLY]
```

## APPLY Phase

**Purpose:** Execute an approved plan with explicit per-task user control: preview first, then choose who applies each task (manual or SHEAF) or skip with deviation logging.

**Artifacts Created:**

- Code/files specified in PLAN.md (only for tasks SHEAF applies)
- Execution decision log (task-by-task): manual / agent_applied / skipped
- STATE.md updates for loop continuity

**Activities:**

1. Read PLAN.md to load task definitions and boundaries
2. For each task, run the preview/decision loop:
   - Show preview fragments (no writes yet)
   - Require explicit user choice:
     - **[1] Manual apply** (user edits, then confirms `done`)
     - **[2] SHEAF apply** (agent writes changes)
     - **[3] Skip** (record deviation)
3. Respect protected boundaries; request explicit override if needed
4. Record decisions and deviations after every task
5. Keep momentum and traceability for UNIFY reconciliation

### Per-Task Decision Outcomes

Each task must end in one explicit outcome:

| Outcome             | Meaning                                           | What Happens Next                                          |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| **manual**          | User chose to apply changes directly              | SHEAF waits for `done` (or `skip` / `stop`) and logs result |
| **agent_applied**   | User authorized SHEAF to write changes            | SHEAF applies changes and logs completion                  |
| **skipped**         | User chose not to execute this task now           | SHEAF records deviation and continues                      |
| **stopped**         | User paused execution before finishing all tasks  | SHEAF preserves state/log for resume                       |

**Rules:**

- Never apply task changes without explicit per-task decision from the user
- Never hide skipped work — always log deviations for UNIFY
- Boundary overrides require explicit user consent and must be logged
- Verification commands in tasks are guidance; execution can continue without mandatory auto-qualification

### Preview/Decision Loop

Every task follows this loop:

```
PREVIEW → USER DECISION → (MANUAL WAIT | AGENT APPLY | SKIP) → LOG → NEXT TASK
```

This loop prioritizes user control and execution transparency over silent autonomy.

**Entry Condition:**

- PLAN.md exists and is approved
- STATE.md shows loop position at PLAN complete

**Exit Condition:**

- All tasks processed (manual, agent_applied, skipped, or stopped with resume state)
- Deviations and decisions logged for reconciliation
- STATE.md ready for UNIFY handoff

**Loop Position:**

```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ○     [APPLY complete, ready for UNIFY]
```

## UNIFY Phase

**Purpose:** Reconcile what was planned vs. what was built. Close the loop.

**Artifacts Created:**

- `{phase}-{plan}-SUMMARY.md` in `.sheaf/phases/{phase-name}/`
- Updated `STATE.md`
- Updated `ROADMAP.md` (if phase complete)

**Activities:**

1. Compare PLAN.md tasks to actual execution
2. Document what was built (files, lines)
3. Record acceptance criteria results (PASS/FAIL)
4. Note any deviations and why
5. Update STATE.md:
   - Loop position
   - Progress percentages
   - Session continuity
6. Update ROADMAP.md if phase is complete

**Entry Condition:**

- APPLY phase complete (all tasks done or documented blockers)

**Exit Condition:**

- SUMMARY.md created with results
- STATE.md updated with new position
- Loop closed, ready for next PLAN

**Loop Position:**

```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓     [Loop complete, ready for next PLAN]
```

## Loop Invariants

**Never Skip PLAN:**

```
# BAD
"Let me just quickly implement this without a plan"

# GOOD
"Let me create a PLAN.md first, even for small work"
```

Why: No plan = no acceptance criteria = no way to verify completion.

**Never Execute Without Approval:**

```
# BAD
"I've written the plan, now executing..."

# GOOD
"Plan created. Ready to execute when you approve."
```

Why: Plans may have incorrect assumptions. Approval catches issues early.

**Always Close With UNIFY:**

```
# BAD
"Tasks done. Moving to next phase."

# GOOD
"Tasks done. Creating SUMMARY.md and updating STATE.md."
```

Why: No UNIFY = no record of what was built = lost traceability.

## Phase Transitions

### PLAN → APPLY

Trigger: User approves plan (explicit signal)

Validation:

- [ ] PLAN.md has all required sections
- [ ] Acceptance criteria are testable
- [ ] Tasks have Files, Action, Verify, Done
- [ ] Boundaries are clear

### APPLY → UNIFY

Trigger: All tasks processed (manual / agent_applied / skipped) OR execution paused with documented stop state

Validation:

- [ ] Every task has an explicit recorded outcome
- [ ] Deviations/skips are logged with reason
- [ ] Boundary overrides (if any) are documented
- [ ] STATE.md reflects APPLY completion or resumable pause

### UNIFY → PLAN (next)

Trigger: SUMMARY.md created, STATE.md updated

Validation:

- [ ] SUMMARY.md has AC results
- [ ] STATE.md reflects new position
- [ ] ROADMAP.md updated if phase complete

## Visual Loop Position Format

STATE.md displays loop position visually:

```markdown
## Loop Position

Current loop state:
```

PLAN ──▶ APPLY ──▶ UNIFY
✓ ○ ○ [Description of current state]

```

```

Symbols:

- `✓` = Phase complete
- `○` = Phase pending
- `►` = Currently in this phase (optional)

## Anti-Patterns

**Partial loops:**

```
PLAN → APPLY → (skip UNIFY) → PLAN
```

Why bad: No record of what was built. Can't track progress.

**Implicit approval:**

```
"I assume the plan is approved and will proceed"
```

Why bad: May execute on flawed assumptions. Always wait for explicit approval.

**UNIFY debt:**

```
"I'll write the SUMMARY later"
```

Why bad: Context degrades. Write SUMMARY immediately after APPLY.

</loop_phases>

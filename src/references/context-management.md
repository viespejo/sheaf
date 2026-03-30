<context_management>

## Purpose

Strategies for working effectively within context window limits. Context is finite; use it deliberately to maximize productive work per session.

## Context Brackets

SHEAF uses context brackets to adapt behavior based on remaining capacity:

| Bracket | Remaining | Mode | Behavior |
|---------|-----------|------|----------|
| FRESH | >70% | LEAN | Minimal injection, trust recent context |
| MODERATE | 40-70% | STANDARD | Reinforce key context, consider plan splits |
| DEEP | 20-40% | CONSERVATIVE | Summarize before new reads, prepare handoff |
| CRITICAL | <20% | PRESERVATION | Finish current task, write continuity handoff |

## Strategies by Bracket

### FRESH (>70%)
- Work directly in session
- Load full files when required
- Parallel operations are usually acceptable
- Good moment for complex multi-step work

### MODERATE (40-70%)
- Re-read key files (`PROJECT.md`, `STATE.md`) before major decisions
- Consider splitting large pending work
- Prefer summaries over full prior plans
- Keep plans single-concern

### DEEP (20-40%)
- Read `SUMMARY.md` before reopening full `PLAN.md`
- Defer new broad scope work to a fresh session
- Focus on completing in-flight plan
- Prepare handoff context

### CRITICAL (<20%)
- Complete current task only
- Write comprehensive handoff
- Avoid new reads unless essential
- Update `STATE.md` Session Continuity for resume

## Lean Injection Principles

### Load Only What You Need

```markdown
<!-- GOOD: targeted loading -->
<context>
.sheaf/STATE.md
src/path/to/specific/file.ts
</context>

<!-- BAD: kitchen sink loading -->
<context>
.sheaf/PROJECT.md
.sheaf/ROADMAP.md
.sheaf/STATE.md
.sheaf/phases/01-*/**/*.md
src/**
</context>
```

### Summary Before Full Plan

Prefer:

```markdown
.sheaf/phases/01-foundation/01-01-SUMMARY.md
```

Avoid loading both unless needed:

```markdown
.sheaf/phases/01-foundation/01-01-PLAN.md
.sheaf/phases/01-foundation/01-01-SUMMARY.md
```

Summary = what was built. Plan = what was intended.

### Progressive Detail

1. Read `STATE.md` (current position)
2. Read relevant `SUMMARY.md` (what shipped)
3. Read specific source files (implementation details)

Delay implementation-level reads until necessary.

## Plan Sizing for Context

### Target: ~50% Context Usage Per Plan

A plan should consume around half available context:
- Leaves room for execution output
- Leaves room for error recovery
- Supports verification and reconciliation

### Single Concern Per Plan

GOOD: `Implement user profile endpoint and persistence`

BAD: `Implement all user/product/order domains and all APIs`

### 2–3 Tasks Maximum

More tasks increase context cost and reduce execution quality. Split aggressively when needed.

## Avoiding Reflexive Chaining

Anti-pattern:

```yaml
# 01-01
depends_on: []

# 01-02
depends_on: ["01-01"]  # only valid if genuinely dependent
```

Preferred:

```yaml
# 01-01: User model
depends_on: []

# 01-02: Product model
depends_on: []  # independent

# 01-03: Order model
depends_on: ["01-01", "01-02"]
```

Use dependencies only when technically required.

## Session Handoffs

When context is low or work spans sessions, SHEAF supports explicit continuity handoffs.

### Two Levels of Continuity

| Level | File | Use Case |
|-------|------|----------|
| Light | `STATE.md` Session Continuity | Short breaks, same-day resume |
| Full | `HANDOFF-{context}.md` | Context exhaustion, next-day resume, fresh sessions |

### STATE.md Session Continuity

Always maintain a concise continuity snapshot:

```markdown
## Session Continuity

Last session: 2026-03-29 11:15
Stopped at: Phase 3, Plan 01, Task 2 complete
Next action: /sheaf:unify .sheaf/phases/03-refs/03-01-PLAN.md
Resume context:
- Task 1 complete
- Task 2 in progress
- One blocker pending decision
```

### HANDOFF Document

For fresh sessions or complex interrupted work, typically produced by pause/resume workflows:

- Self-contained context entry point
- What was completed
- What remains in progress
- Key decisions and deviations
- Active blockers/risks
- Exact next action
- Loop position (PLAN/APPLY/UNIFY)

### Session Commands

| Command | Purpose |
|---------|---------|
| `/sheaf:pause` | Prepare break context (if configured) |
| `/sheaf:resume` | Restore context, suggest ONE next action |
| `/sheaf:progress` | Mid-session status with ONE next action |

## Anti-Patterns

**Load everything "just in case":** wastes context and slows decisions.

**Ignore bracket transitions:** starting complex work in DEEP/CRITICAL usually causes spillover.

**No continuity notes near context exhaustion:** increases resume friction and decision drift.

## Context Budget Heuristics

| Activity | Typical Cost |
|----------|--------------|
| PLAN drafting | ~3-5k tokens |
| Read source file | ~1-3k tokens |
| Task execution | ~5-15k tokens |
| Verification output | ~2-5k tokens |
| SUMMARY write | ~2-3k tokens |

Use these as rough planning estimates, not strict limits.

</context_management>

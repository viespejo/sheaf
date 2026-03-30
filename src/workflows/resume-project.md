<purpose>
Resume SHEAF work after a session break. Restore context from STATE.md and optional handoff, identify the current loop position, and route to exactly ONE next action.
</purpose>

<when_to_use>
- Starting a new session on an existing SHEAF project
- Context was cleared (new conversation/session)
- A handoff was produced in a prior session
- User asks to continue or resume current work
</when_to_use>

<loop_context>
Determined dynamically by reading `.sheaf/STATE.md`.
This workflow discovers current position instead of assuming it.
</loop_context>

<philosophy>
**Single next action:** Determine state and suggest exactly ONE action.
Do not present multiple routing options.

**State-first reconciliation:** Prefer STATE.md when handoff appears stale or conflicting.

**Handoff lifecycle:** Consume handoff for resume context, then archive when user proceeds.
</philosophy>

<required_reading>
.sheaf/STATE.md
</required_reading>

<optional_reading>
.sheaf/PROJECT.md
.sheaf/ROADMAP.md
.sheaf/HANDOFF*.md
</optional_reading>

<references>
{{RUNTIME_DIR}}/sheaf/references/loop-phases.md
{{RUNTIME_DIR}}/sheaf/references/context-management.md
</references>

<process>

<step name="verify_sheaf_exists" priority="first">
1. Check for `.sheaf/STATE.md`:
   ```bash
   ls .sheaf/STATE.md 2>/dev/null
   ```
2. If missing:
   - Report: "No SHEAF project found. Run /sheaf:init first."
   - Stop workflow
3. If present: continue
</step>

<step name="detect_handoffs">
Detect handoff context source:

1. If `$ARGUMENTS` is provided:
   - Treat it as requested handoff path
   - Validate file exists
   - If not found: report error and stop

2. If no argument:
   - Search most recent handoffs:
     ```bash
     ls -t .sheaf/HANDOFF*.md 2>/dev/null | head -5
     ```
   - If found, select the most recent file

3. Standard pattern:
   - `.sheaf/HANDOFF-{context}.md`
   - Example: `.sheaf/HANDOFF-phase04-apply.md`

4. Track selected handoff path for lifecycle handling
</step>

<step name="load_state" priority="required">
1. Read `.sheaf/STATE.md`
2. Extract:
   - Current Position (milestone, phase, plan, status)
   - Loop Position markers (PLAN/APPLY/UNIFY)
   - Last activity
   - Session Continuity:
     - Last session
     - Stopped at
     - Next action
     - Resume context
</step>

<step name="load_resume_context">
1. If a handoff file was selected:
   - Read handoff content
   - Present concise section: `HANDOFF CONTEXT DETECTED`
   - Extract decisions, unfinished work, blockers, and suggested next action

2. If no handoff and STATE.md references a resume file/path:
   - Load that file if it exists (commonly PLAN.md or SUMMARY.md)

3. Build working picture:
   - What is complete
   - What is in progress
   - What is next
   - Any blockers/deferred decisions
</step>

<step name="reconcile_state_and_handoff">
1. Compare STATE continuity vs handoff guidance
2. If they agree:
   - Continue normally
3. If they conflict:
   - Prefer STATE.md when newer/more consistent with repository
   - Note discrepancy explicitly
   - Ask one clarification question only if action cannot be resolved safely
4. If handoff appears stale (older than STATE updates):
   - Mark as informational only
   - Route from STATE.md
</step>

<step name="determine_single_action" priority="required">
Determine exactly ONE next action based on loop position and available plan path:

| Loop state | Single next action |
|------------|--------------------|
| PLAN ○ (no approved plan yet) | `/sheaf:plan` |
| PLAN ✓, APPLY ○ | `/sheaf:apply [plan-path]` |
| PLAN ✓, APPLY ✓, UNIFY ○ | `/sheaf:unify [plan-path]` |
| PLAN ✓, APPLY ✓, UNIFY ✓ | `/sheaf:plan` |
| Blocked | `Address blocker: [specific issue]` |

Rules:
- Do not offer alternatives
- If command needs `[plan-path]`, resolve from STATE/session continuity/active phase files
- If path cannot be resolved confidently, ask one targeted clarification before routing
</step>

<step name="report_and_route" priority="required">
Display concise resume status and one deterministic route:

```text
════════════════════════════════════════
SHEAF PROJECT RESUMED
════════════════════════════════════════

Project: [from PROJECT.md if available]
Phase: [N] of [M] - [phase name]
Plan: [id] - [short description]

Loop Position:
PLAN ──▶ APPLY ──▶ UNIFY
 [✓/○]    [✓/○]    [✓/○]

Last session: [timestamp]
Stopped at: [state continuity summary]

────────────────────────────────────────
▶ NEXT: [single action]
  [one-line rationale]
────────────────────────────────────────

Type "yes" to proceed, or provide correction if context changed.
```

Do not output numbered menus.
</step>

<step name="handoff_lifecycle">
After user confirms proceed (`yes`, `continue`, equivalent):

1. If a handoff was consumed:
   - Archive it:
     ```bash
     mkdir -p .sheaf/handoffs/archive
     mv .sheaf/HANDOFF-{context}.md .sheaf/handoffs/archive/
     ```
   - If archive not desired, delete only with explicit user confirmation

2. Optional hygiene:
   - Surface stale handoffs for cleanup review:
     ```bash
     find .sheaf -maxdepth 1 -name "HANDOFF*.md" -mtime +7 -type f
     ```

3. Update `.sheaf/STATE.md` continuity section:
   - Clear stale resume-file references to consumed handoff
   - Keep resolved next action and current continuity snapshot
</step>

</process>

<output>
- Context restored from STATE and optional handoff
- Current loop position identified
- Exactly one next action provided
- Consumed handoff archived after user proceeds
</output>

<error_handling>
**STATE.md missing/corrupted:**
- Report missing sections or parse failure
- Suggest restoring STATE.md or re-running `/sheaf:init` as last resort

**Conflicting state signals:**
- Report discrepancy clearly
- Ask one focused clarification if required to avoid wrong routing

**No resume context beyond state:**
- Fall back to loop markers and repository evidence
- Still provide one deterministic next action

**Stale handoff:**
- Treat handoff as secondary
- Route from STATE/repository truth
</error_handling>

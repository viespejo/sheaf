<purpose>
Execute an approved PLAN.md by presenting per-task preview fragments and requiring an explicit per-task decision from the user (manual apply / SHEAF apply / skip). Records results for UNIFY phase reconciliation.
</purpose>

<when_to_use>
- User has approved a PLAN.md (explicit approval required)
- STATE.md shows loop position at PLAN complete, ready for APPLY
- No unresolved blockers from planning phase
</when_to_use>

<loop_context>
Expected phase: APPLY
Prior phase: PLAN (approval just received)
Next phase: UNIFY (after execution completes)
</loop_context>

<required_reading>
.sheaf/STATE.md
.sheaf/phases/{phase}/{plan}-PLAN.md
</required_reading>

<references>
`{{RUNTIME_DIR}}/sheaf/references/loop-phases.md`
</references>

<process>

<step name="validate_approval" priority="first">
1. Confirm user has explicitly approved the plan
   - Do NOT assume approval — instead, look for an explicit signal ("approved", "execute", "go ahead"), because executing on assumed approval may implement against flawed assumptions that approval review would have caught
   - If approval unclear: Ask "Plan ready at [path]. Approve execution?" and wait
2. Read STATE.md to verify:
   - Loop position shows PLAN complete
   - Correct phase and plan identified
</step>

<step name="load_plan">
1. Read the PLAN.md file
2. Parse frontmatter:
   - execution_mode: (optional) may hint default behavior
   - files_modified: track what we'll change
   - depends_on: informational
3. Extract tasks from <tasks> section
4. Note boundaries from <boundaries> section
5. Load acceptance criteria for informational reference
</step>

<step name="execute_tasks">
**For each <task> in order, present a preview fragment and require an explicit user decision.**

**Notes:**
- SHEAF will generate previews as small fragments of the new content (context + inserted lines) suitable for copy/paste/edit. No unified before/after diffs are displayed.
- Decision is mandatory per task.

---

**For each <task>:**

**1. PREPARE PREVIEW FRAGMENTS (no file writes)**
- Determine target files from <files> or action spec.
- For each target file:
  - Read a small context window from the repository (e.g., 3 lines surrounding insertion point) if file exists.
  - Render the "proposed fragment" to insert or edit (fragment only).
  - If file is new, present the fragment as the full file content to create.
- Collect a short action summary and the suggested verify command (if task defines <verify>), shown as guidance only.

**2. DISPLAY PREVIEW & PROMPT FOR DECISION (OBLIGATORY)**
- Show:
  - Task header: "Task N: [name]"
  - Files affected
  - For each file: path + preview fragment (with minimal surrounding context)
  - Suggested verify command (informational)
- Mandatory choices:
  - [1] I will apply these changes manually (SHEAF will wait; you must type "done")
  - [2] SHEAF: apply these changes now (SHEAF will write files)
  - [3] Skip this task (record deviation and continue)
- Wait for user's exact choice.

**3. HANDLE CHOICE**
- **If [1] (manual):**
  - SHEAF does NOT write files.
  - SHEAF shows concise apply instructions (copy/paste lines or open file X and edit).
  - SHEAF logs: {task, decision: manual, timestamp}.
  - SHEAF waits for user input: "done" / "skip" / "stop".
  - On "done": record completion and continue.
  - On "skip": record deviation and continue.
  - On "stop": halt workflow (state saved for resume).
- **If [2] (agent applies):**
  - SHEAF writes fragments into files (respect boundaries).
  - If a write would violate a protected boundary, SHEAF stops and requires explicit override; do not apply without consent.
  - SHEAF logs: {task, decision: agent_applied, timestamp}.
  - Continue to next task.
- **If [3] (skip):**
  - SHEAF logs: {task, decision: skipped, reason: user_skip, timestamp}.
  - Continue to next task.

**4. SAFEGUARDS**
- Do not modify protected files without explicit override; record overrides in STATE.md Decisions.
- For sensitive operations (service restarts, permissions) show explicit warning and require confirmation.

**5. LOGGING**
- After each task decision, append an entry to .sheaf/execution-log.json (or a structured section in STATE.md) including: task id/name, decision, timestamp, optional user notes.
</step>

<step name="track_progress">
Throughout execution:

1. Maintain log of:
   - Tasks processed with decision (manual/agent_applied/skipped)
   - Deviations from plan
   - Any boundary override decisions
2. This log feeds the UNIFY phase to reconcile manual edits with plan intent.
</step>

<step name="finalize">
After all tasks attempted:

1. Summarize execution:
   - Tasks completed: N of M
   - Tasks applied by agent: count
   - Tasks applied manually: count
   - Skipped/deviations: list
2. Update STATE.md:
   - Loop position: PLAN → APPLY → UNIFY
   - Last activity: timestamp and summary
3. Prompt:
   ```
   ════════════════════════════════════════
   APPLY COMPLETE
   ════════════════════════════════════════
   [execution summary]

   ---
   Continue to UNIFY?

   [1] Yes, run UNIFY | [2] Pause here
   ```
4. **Accept quick inputs:** "1", "yes", "continue", "go" → run `/sheaf:unify [plan-path]`
</step>

</process>

<output>
- Files modified only where SHEAF was instructed to apply changes (agent_applied)
- Execution log (for UNIFY): task decisions, deviations
- STATE.md updated with APPLY progress/complete
</output>

<error_handling>
**Plan not found:**
- Check STATE.md for correct path
- Ask user to confirm plan location

**Boundary violation attempted:**
- Stop immediately and request explicit override
- Do not modify protected files without explicit override; record override decision

**User never confirms manual application:**
- SHEAF will wait for "done"; offer user "save and exit" to continue later
</error_handling>

<anti_patterns>
**Assuming approval:**
Do NOT start APPLY without explicit user approval — instead wait for clear signal, because plans may contain incorrect assumptions that the approval step would catch.

**Skipping verification by default:**
Qualify removed; SHEAF will show verify commands as suggestions only — running them is user's responsibility.

**Ignoring boundaries:**
Stop until user authorizes — instead of rationalizing "it's a small change", because boundary violations cascade into untraceable changes.

**Swallowing concerns:**
Record any user-reported concerns in logs; never mark implicitly complete without confirmation.
</anti_patterns>


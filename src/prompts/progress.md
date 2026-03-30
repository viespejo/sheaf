---
name: sheaf:progress
description: Smart status with deterministic routing to ONE next action
interaction: chat
opts:
  alias: sheaf_progress
  auto_submit: false
  is_slash_cmd: true
  user_prompt: true
---

## user

@{agentic}

<objective>
Show current SHEAF progress and suggest exactly ONE next action.

Use this for a mid-session checkpoint, after resume, or whenever the next step is unclear.
</objective>

<execution_context>
`{{AGENT_DIR}}/sheaf/workflows/progress-project.md`
`{{AGENT_DIR}}/sheaf/references/loop-phases.md`
`{{AGENT_DIR}}/sheaf/references/context-management.md`
</execution_context>

<context>
Optional user context: $ARGUMENTS

.sheaf/STATE.md
.sheaf/ROADMAP.md
</context>

<process>
**Follow workflow: {{AGENT_DIR}}/sheaf/workflows/progress-project.md**

Core flow:
1. Read STATE and ROADMAP
2. Calculate current milestone/phase/loop progress
3. Factor optional user context (time constraints, blockers, priorities)
4. Determine exactly ONE next action
5. Display concise progress report with deterministic routing
6. Add context advisory when session is DEEP/CRITICAL

Behavior rules:
- Never output multiple next-action options
- Prefer loop-consistent routing over generic suggestions
- Keep response concise, visual, and actionable
</process>

<success_criteria>
- [ ] Current progress shown clearly (milestone/phase/loop)
- [ ] Exactly ONE next action suggested
- [ ] Optional user context considered when provided
- [ ] Context advisory shown when deep/critical risk is detected
</success_criteria>

---
name: sheaf:plan
description: Plan implementation of a selected PRD story (collaborative workflow)
interaction: chat
opts:
  alias: sheaf_plan
  auto_submit: false
  is_slash_cmd: true
  user_prompt: true
---

## user

@{agentic}

<objective>
Create or continue an implementation plan for a selected PRD story.

This is planning-first: interview, challenge, and agreement before writing files.
</objective>

<execution_context>
`~/.codecompanion/sheaf/workflows/plan-phase.md`
`~/.codecompanion/sheaf/templates/PLAN.md`
`~/.codecompanion/sheaf/references/plan-format.md`
</execution_context>

<context>
$STORY: $ARGUMENTS

.sheaf/PROJECT.md
.sheaf/STATE.md
.sheaf/ROADMAP.md

Optional on-demand context (only when needed):
docs/prd.md
docs/architecture.md
PLANNING.md (if present)
</context>

<process>
**Follow workflow: ~/.codecompanion/sheaf/workflows/plan-phase.md**

Planning mode rules:

1. Use INIT outputs as primary source of truth
2. Select story first, then plan implementation
3. Run collaborative interview (recommendation, pros/cons, devil's advocate, risks)
4. Produce chat draft first (no file writes)
5. Ask explicit approval before creating PLAN.md
6. Update STATE.md and ROADMAP.md after approval
7. End with exactly ONE next action

Behavior constraints:
- Do not re-run full INIT discovery in PLAN
- Consult `docs/prd.md` / `docs/architecture.md` only when ambiguity or conflicts require it
- Keep focus on implementation of the selected story (not generic planning branches)
</process>

<success_criteria>
- [ ] Target story selected and scoped
- [ ] Interview discussion completed (options, recommendation, risks)
- [ ] Plan draft approved explicitly before file creation
- [ ] PLAN.md created at the correct phase path
- [ ] STATE.md and ROADMAP.md updated
- [ ] Exactly ONE next action shown (`/sheaf:apply`)

</success_criteria>


---
name: sheaf:brainstorm
description: Facilitate a BMAD-style brainstorming session and produce actionable outcomes
---

<objective>
Facilitate an interactive brainstorming session using BMAD-style ideation techniques.

Support continuation of previous sessions, guide technique selection, generate and organize ideas, and produce a session document with actionable next steps.
</objective>

<execution_context>
`{{AGENT_DIR}}/sheaf/workflows/brainstorm-session.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/workflow.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/template.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/brain-methods.csv`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/steps/step-01-session-setup.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/steps/step-01b-continue.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/steps/step-02a-user-selected.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/steps/step-02b-ai-recommended.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/steps/step-02c-random-selection.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/steps/step-02d-progressive-flow.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/steps/step-03-technique-execution.md`
`{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/steps/step-04-idea-organization.md`
</execution_context>

<context>
ARGUMENTS: $ARGUMENTS
</context>

<process>
**Follow workflow: {{AGENT_DIR}}/sheaf/workflows/brainstorm-session.md**

This command is a SHEAF wrapper around BMAD brainstorming.

Core behavior:
1. Use BMAD `workflow.md` as primary execution contract
2. Execute BMAD step files in order with original branching logic
3. Use BMAD `brain-methods.csv` for techniques (on-demand loading)
4. Use BMAD `template.md` for session document structure
5. Keep BMAD continuation and facilitation style
6. Persist outputs in SHEAF-compatible paths
7. End with exactly ONE next action

Behavior rules:
- Stay faithful to BMAD step wording and sequence
- Do not replace BMAD techniques with a simplified local catalog
- Keep brainstorming collaborative and interactive
- Keep anti-bias pivots and quantity-first ideation
</process>

<success_criteria>
- [ ] Existing session continuity handled (continue/new/list)
- [ ] Topic, goals, and constraints explicitly captured
- [ ] Technique approach selected and confirmed
- [ ] Interactive ideation executed with documented ideas
- [ ] Ideas organized, prioritized, and converted to action steps
- [ ] Session file created/updated under `.sheaf/brainstorming/`
- [ ] Exactly ONE next action provided
</success_criteria>

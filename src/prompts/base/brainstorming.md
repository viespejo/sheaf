---
name: sheaf:brainstorming
description: Facilitate a BMAD-style brainstorming session and produce actionable outcomes
---

<objective>
Facilitate an interactive brainstorming session using BMAD-style ideation techniques.

Support continuation of previous sessions, guide technique selection, generate and organize ideas, and produce a session document with actionable next steps.
</objective>

<execution_context>
`{{SHEAF_RUNTIME_DIR}}/skills/bmad-brainstorming/workflow.md`
</execution_context>

<context>
`arguments` = $ARGUMENTS
`comunication_language` = "English"
`output_folder` = ".sheaf"
</context>

<process>
Follow the instructions in {{SHEAF_RUNTIME_DIR}}/skills/bmad-brainstorming/workflow.md
</process>

<success_criteria>
- [ ] BMAD-style brainstorming session facilitated with user interaction
- [ ] BMAD-format brainstorming session file under `.sheaf/brainstorming/`.
</success_criteria>

---
name: sheaf:init
description: Initialize SHEAF from project docs (personal workflow)
---

<objective>
Initialize the `.sheaf/` structure using existing project documents or conversational discovery.
Primary context: `docs/prd.md` and `docs/architecture.md`.
Fallback: Conversational Discovery Mode if documents are missing.
`PLANNING.md` is auto-included when present.
</objective>

<execution_context>
`{{SHEAF_RUNTIME_DIR}}/workflows/init-project.md`
</execution_context>

<context>
 `comunication_language`= "English"
 `DateTime of Initialization` use current datetime from user's system
</context>

<process>
During this entire workflow it is critical that you speak to the user in the config loaded `communication_language`.
It does not matter if the user responds in a different language, you should always respond in the `communication_language` specified.

Follow the instructions in {{SHEAF_RUNTIME_DIR}}/workflows/init-project.md
</process>

<success_criteria>
- [ ] `.sheaf/` directory created
- [ ] Project context established (via docs or conversation)
- [ ] `PLANNING.md` auto-included when present
- [ ] Optional docs accepted when provided
- [ ] PROJECT.md populated from doc-derived context
- [ ] STATE.md initialized with correct loop position
- [ ] ROADMAP.md initialized for planning
- [ ] User presented with ONE clear next action
</success_criteria>

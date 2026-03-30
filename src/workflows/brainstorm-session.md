<purpose>
Provide a thin SHEAF adapter for BMAD brainstorming.
Execution logic lives in BMAD files; this workflow only handles integration boundaries.
</purpose>

<when_to_use>
- User invokes `/sheaf:brainstorm`
- User wants BMAD brainstorming behavior inside SHEAF
- User needs brainstorming continuity with SHEAF-style routing
</when_to_use>

<loop_context>
Auxiliary workflow outside PLAN → APPLY → UNIFY mutation.
Use before planning or as standalone ideation.
</loop_context>

<required_reading>
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
</required_reading>

<references>
{{AGENT_DIR}}/sheaf/references/context-management.md
</references>

<process>

<step name="validate_bmad_assets" priority="first">
1. Verify all BMAD files in `<required_reading>` exist.
2. If any file is missing, stop and instruct reinstall/update so `sheaf/skills` is present.
</step>

<step name="initialize_adapter_context" priority="required">
1. Map BMAD output destination to `.sheaf/brainstorming/`.
2. Treat `$ARGUMENTS` as session topic/constraints and optional context-file hint.
3. `comunication_language` will be English by default, but if user specifies a different language in $ARGUMENTS, use that for all BMAD interactions and outputs.
4. Do not redefine BMAD technique/session rules in this adapter.
</step>

<step name="delegate_to_bmad" priority="required">
1. Execute `{{AGENT_DIR}}/sheaf/skills/bmad-brainstorming/workflow.md` exactly.
2. Follow BMAD step files and branching exactly as authored.
3. Use BMAD template and CSV exactly as authored.
4. Preserve BMAD halt points and continuation behavior.
</step>

<step name="enforce_sheaf_output_boundary" priority="required">
1. Ensure session artifact is saved under `.sheaf/brainstorming/`.
2. Preserve BMAD frontmatter and section structure.
3. Do not rewrite BMAD content unless needed for path compatibility.
</step>

<step name="route_single_next_action" priority="required">
After BMAD execution, provide exactly ONE next action:
- `/sheaf:plan [story-or-scope]`, or
- `/sheaf:brainstorm [topic]`, or
- `/sheaf:handoff`

Choose based on explicit user intent and current session state.
</step>

</process>

<output>
BMAD-format brainstorming session file under `.sheaf/brainstorming/`.
</output>

<error_handling>
**Missing BMAD assets:**
- Stop
- Report missing path(s)
- Ask user to reinstall/update SHEAF

**Session interrupted:**
- Persist partial BMAD session state
- Route to `/sheaf:brainstorm [topic]`
</error_handling>

<anti_patterns>
- Duplicating BMAD step logic in this file
- Replacing BMAD sequencing with custom sequencing
- Returning multiple next actions
</anti_patterns>


---
paths:
  - "src/**/*.md"
---

# SHEAF Style Rules

Universal conventions for SHEAF markdown files.

## Language & Tone

- Use imperative voice.
- Keep wording concise and specific.
- Avoid filler and conversational padding.
- Avoid praise/enthusiasm language.

## Temporal Language

Describe current state by default.

Avoid migration-style narration such as:
- "we changed"
- "previously"
- "no longer"
- "instead of"

Allowed exceptions:
- SUMMARY deviation reporting
- explicit changelog/commit contexts

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `plan-phase.md` |
| Commands | `sheaf:kebab-case` | `sheaf:plan` |
| Prompt aliases | snake_case with sheaf prefix | `sheaf_plan` |
| Step names | snake_case | `name="load_project_state"` |
| Phase directories | `NN-kebab-name` | `02-rules-layer` |
| Plan files | `NN-NN-PLAN.md` | `02-01-PLAN.md` |
| Summary files | `NN-NN-SUMMARY.md` | `02-01-SUMMARY.md` |

## XML Conventions

Use semantic XML containers with markdown headers inside.

Preferred tags:
- `<objective>`, `<context>`, `<process>`, `<step>`
- `<purpose>`, `<when_to_use>`, `<loop_context>`
- `<tasks>`, `<task>`, `<action>`, `<verify>`, `<done>`
- `<acceptance_criteria>`, `<success_criteria>`
- `<boundaries>`, `<verification>`, `<output>`

Avoid generic containers like `<section>` or `<content>`.

## Path & Reference Conventions

Use SHEAF path conventions:
- project state: `.sheaf/*`
- installed framework docs: `~/.codecompanion/sheaf/*`

## Loop Terminology

Always use explicit loop names:
- PLAN
- APPLY
- UNIFY

When relevant, state expected prior/next loop position.

## Acceptance Criteria Format

Use Given/When/Then in `<acceptance_criteria>`:

```gherkin
Given [precondition]
When [action]
Then [expected outcome]
```

Each criterion must be independently testable.

## Prompt Command Conventions

For files in `src/prompts/`:
- include `## user` and `@{agentic}`
- keep command behavior concise and delegate details to workflows
- end flows with one clear next action where applicable

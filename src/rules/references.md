---
paths:
  - "src/references/**/*.md"
---

# Reference Rules

Rules for editing conceptual reference files in `src/references/`.

## No Frontmatter

Reference files do not use YAML frontmatter.

Start directly with content (optionally inside an outer semantic XML container).

## Purpose of References

References explain stable concepts used by prompts and workflows.

Use references for:
- loop semantics and invariants,
- context-management guidance,
- structural conventions (for example, plan shape).

Do not use references for command-specific execution steps.

## Recommended Structure

1. Optional outer semantic container (for example, `<loop_phases>`)
2. `## Purpose`
3. Concept sections with clear definitions
4. Concrete examples (including contrast when useful)
5. Constraints / anti-patterns / invariants

## Teaching Pattern

Teach by contrast and by consequences:

- show bad vs good examples,
- explain why a rule exists,
- tie guidance to SHEAF continuity and traceability.

## Loading Pattern

References are lazy-loaded from workflows/prompts when needed.

Example:

```xml
<references>
~/.codecompanion/sheaf/references/loop-phases.md
~/.codecompanion/sheaf/references/context-management.md
</references>
```

References should remain self-contained so one file can be loaded independently.

## Writing Constraints

- Keep language imperative and precise.
- Avoid tool-specific implementation details.
- Use current-state wording (not historical migration language).

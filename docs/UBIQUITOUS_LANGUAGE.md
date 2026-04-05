# Ubiquitous Language

## Command and execution model

| Term                  | Definition                                                                                     | Aliases to avoid                    |
| --------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Command**           | A user-invoked SHEAF action exposed as `/sheaf:<name>` in a runtime.                           | Prompt                              |
| **Prompt launcher**   | A command prompt artifact that delegates execution to a workflow, skill, or inline process.    | Prompt body, wrapper command        |
| **Workflow contract** | A structured operational specification that defines deterministic behavior for a command flow. | Script, suggestion                  |
| **Core loop command** | A command that governs PLAN/APPLY/UNIFY lifecycle and project continuity.                      | Main command, base command          |
| **Extension command** | A command that adds specialized capability without redefining loop governance.                 | Secondary command, optional command |

## Loop and continuity lifecycle

| Term                   | Definition                                                                                        | Aliases to avoid          |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------------------------- |
| **PLAN**               | The loop phase where one implementation unit is defined and explicitly approved before execution. | Drafting, ideation        |
| **APPLY**              | The loop phase where approved plan tasks are executed with explicit per-task decisions.           | Build, coding phase       |
| **UNIFY**              | The loop phase where planned versus actual outcomes are reconciled and summarized.                | Wrap-up, cleanup          |
| **Loop position**      | The current lifecycle marker that indicates which next command is valid.                          | Status only, progress bar |
| **One next action**    | The deterministic single route that must be presented at the end of a workflow.                   | Options list, choice menu |
| **Session continuity** | The persisted context needed to resume work safely in a later session.                            | History dump, transcript  |
| **Handoff**            | A continuity artifact summarizing outcomes, open issues, and prioritized next actions for resume. | Notes file, memo          |

## Artifact taxonomy

| Term                      | Definition                                                                                          | Aliases to avoid               |
| ------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Active artifact**       | An artifact that directly participates in execution flow or runtime behavior.                       | Reference doc                  |
| **Consultative artifact** | An artifact used to guide decisions during execution without directly controlling runtime behavior. | Executable contract            |
| **Generative artifact**   | An artifact used as a blueprint to create project outputs during workflows.                         | Static reference               |
| **Reference**             | A consultative document that provides guidance, rules of interpretation, or decision data.          | Template, runtime config       |
| **Template**              | A generative document pattern used to materialize operational project files.                        | Reference, example             |
| **Skill**                 | A reusable capability package that can be invoked by prompts/workflows for specialized processes.   | Plugin, runtime adapter        |
| **Rule**                  | A governance guideline that standardizes authoring consistency across SHEAF artifacts.              | Runtime policy, execution step |

## Installation and runtime deployment

| Term                      | Definition                                                                                               | Aliases to avoid             |
| ------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Runtime adapter**       | A runtime-specific configuration that defines output format, destination, and prompt transform behavior. | Client, provider             |
| **Target wrapper**        | A runtime-specific prompt shell that receives shared base prompt content via composition.                | Base prompt, launcher        |
| **Prompt composition**    | The merge process that injects base prompt body into a runtime target wrapper and combines metadata.     | Rendering only, copy-paste   |
| **Path rewriting**        | The install-time substitution of `{{SHEAF_RUNTIME_DIR}}` to local-relative or absolute runtime paths.    | Refactor, migration          |
| **Installed artifact**    | A generated file copied or transformed into a runtime directory as usable output.                        | Source artifact              |
| **Scope (install scope)** | The path strategy (`local` or `global`) that determines rewritten runtime references.                    | Feature scope, project scope |

## Relationships

- A **Command** is implemented by exactly one **Prompt launcher** in base prompts, and each runtime gets one generated **Installed artifact** per command.
- A **Prompt launcher** points to one primary **Execution context** (workflow, skill, or inline process).
- A **Core loop command** advances or validates **Loop position** across **PLAN**, **APPLY**, and **UNIFY**.
- A **Handoff** captures **Session continuity** and is consumed by resume flow to recover one **Next action**.
- A **Runtime adapter** composes one **Target wrapper** with one base prompt body for each command name.
- A **Reference** guides decisions, while a **Template** generates output artifacts; they are distinct roles.

## Example dialogue

> **Dev:** "If I run `/sheaf:plan`, am I executing the workflow directly?"
>
> **Domain expert:** "You invoke a **Command**, then its **Prompt launcher** delegates to the workflow **Execution context**."
>
> **Dev:** "So `/sheaf:product-brief` is in the same loop as PLAN/APPLY/UNIFY?"
>
> **Domain expert:** "No, it is an **Extension command**; loop governance stays with **Core loop commands**."
>
> **Dev:** "And `references` and `templates` are both just docs, right?"
>
> **Domain expert:** "They are different: a **Reference** is consultative, while a **Template** is generative and used to produce operational artifacts."

## Flagged ambiguities

- **"rules"** was described as if active runtime logic; canonical definition is governance-only (**consultative/informative**), not execution flow control.
- **"prompt"** was used to mean both base command content and runtime envelope; use **Prompt launcher** (base behavior) and **Target wrapper** (runtime shell) as distinct terms.
- **"reference"** and **"template"** were occasionally conflated; keep **Reference = guidance** and **Template = generation blueprint**.

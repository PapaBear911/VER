# TRIGGERS

Table mapping user phrases to files loaded. When a user message contains one of these phrases,
load the corresponding file and act on it.

| Phrase | File | Scope |
|---|---|---|
| "Build X" / "Add X" / "Fix X" | `AGENTS.md` | Full loop, auto-routed. |
| `@security …` | `profiles/security.md` | Forced security profile. |
| `@ui …` | `profiles/ui.md` | Forced UI profile. |
| `@ux …` | `profiles/ux.md` | Forced UX profile. |
| `@data …` | `profiles/data.md` | Forced data profile. |
| `@devops …` | `profiles/devops.md` | Forced devops profile. |
| `@testing …` | `profiles/testing.md` | Forced testing profile. |
| `@docs …` | `profiles/docs.md` | Forced docs profile. |
| `@programming …` | `profiles/programming.md` | Forced programming profile. |
| `@security+ux …` | `profiles/security.md` + `profiles/ux.md` | Stacked; stricter gate wins. |
| "Refine this" | `refine/validate.md` + `refine/enhance.md` + `refine/review.md` | Full refine pass, in order. |
| "Validate this" | `refine/validate.md` | Built work vs. original Vision. |
| "Simplify this" | `refine/enhance.md` | Re-climb the Ponytail ladder. |
| "Review this diff" | `refine/review.md` | End-to-end read; verdict Ship or Loop. |
| "What's open?" | `OPEN-THREADS.md` | Live TODO. |
| "What did we decide about X?" | `DECISIONS.md` | Search the ADR log by topic. |
| "How do I install this?" | `INSTALL.md` | Cross-agent installation. |
| "I already have an AGENTS.md" | `INSTALL.md` § The Append Protocol | Append, never replace. |

## Profile loading

Routing runs before Phase 1. Keyword matches load profiles automatically; `@domain` forces one;
`@domain+domain` stacks several. When two profiles add gates to the same phase, **the stricter
gate wins.** No match → base loop only.

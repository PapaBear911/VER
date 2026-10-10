# DevOps Profile

Loaded when: deploy, infra, config, terraform, container, CI, pipeline
Stacks with: security, data, testing
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Change plan.** State exactly what will be created, modified, or destroyed.
- **Blast radius.** If this fails, what breaks, and who notices? Name it before changing it.
- Name the environment. Production is not staging, and the difference is the whole risk.

## Adds to Engineer

- **plan → apply → verify** replaces "run the code."
  1. `plan` — read the diff the tool proposes. Do not skip.
  2. `apply` — scoped to the target environment.
  3. `verify` — confirm the resource exists and behaves.
- Never hand-edit what the tool manages. Drift becomes an outage.

## Adds to Release

- **Rollback line is mandatory.** State the exact revert: the previous version, the flag to
  flip, or the rollback command.
- **Observability check.** After deploying, confirm the signal exists — the metric, the log line,
  or the health endpoint that would tell you it broke.
- A deploy with no way to see its effect is not verified.

## Anti-patterns

| Thought | Reality |
|---|---|
| "I'll skip the plan and read the diff later." | The plan is the diff. Read it before. |
| "It worked in staging." | Staging lacks production's data, scale, and traffic. |
| "We'll roll back if needed." | With what command? Write it now. |
| "The change is small." | Infra changes are multiplicative, not additive. |
| "Logs will tell us." | Only if someone is watching them. |

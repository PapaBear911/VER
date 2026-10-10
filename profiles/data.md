# Data Profile

Loaded when: query, schema, migration, pipeline, dataset, model, experiment
Stacks with: security, devops, testing
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Data contract.** State the shape before writing it: columns, types, nullability, keys, and
  what may change.
- **Versioning.** If this changes a schema or dataset, say how old and new coexist during the
  transition.
- Name the row/sample scale. It decides the approach more than anything else.

## Adds to Engineer

- **Reproducibility check.** Pin inputs, seeds, and versions. A result nobody can re-run is an
  anecdote.
- Inspect the real data before writing the transformation — sample rows, not assumed shapes.
- Migrations must be backwards-compatible during deploy: add, backfill, then remove.

## Adds to Release

- **Migration rollback plan.** State the down-migration, or state plainly that there isn't one.
- For experiments: record the metric, the baseline, and the stopping condition.

## Anti-patterns

| Thought | Reality |
|---|---|
| "The data is clean." | Check. Nulls and duplicates decide correctness. |
| "I'll add the column and drop the old one." | Two deploys: add, backfill, then drop. |
| "The query works on my sample." | Sample size is not production size. |
| "We can't roll back a migration." | Then say so, before running it. |

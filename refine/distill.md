# Refine Pass — Distill

Deep dive. `AGENTS.md` stays authoritative; this file adds method.

Run when: "distill this", "make this a reference", "internalize", "turn this into a reference",
"I want to keep this".

## Purpose

Take external material — an article, a doc page, a style guide, a set of notes, a code example —
and compress it into a VER-native reference file that lives in `references/`. The source stays
outside; the lessons become yours.

## When to use

- You read something that changed how you think about a problem.
- You keep re-looking up the same guide or doc.
- A principle keeps coming up in reviews but has no reference file yet.
- You want a team or agent to follow rules from an external source without reading the whole thing.

## Steps

### 1. Intake — name the source

State the source and its scope:

```markdown
Source:  [title, URL, or description]
Domain: [which VER clause or profile this serves]
Scope:  [what part of the source is relevant — not "all of it"]
```

A source with no clear scope means you have not read it yet. Read first.

### 2. Extract — pull the load-bearing ideas

Read the source end to end. Pull out only the items that would change a decision
during Visualize, Engineer, or Release. Ignore:

- Background and history (unless it explains *why* a rule exists).
- Redundant examples that restate the same rule.
- Anything already covered by an existing reference in `references/`.

For each extracted item, write it as one rule sentence:

```markdown
- [Rule]: [one-sentence justification from the source]
```

If you cannot state it in one sentence, you have not understood it yet.

### 3. Compress — one page, VER shape

Write the reference file using this template:

```markdown
# [Title] — [Subtitle]

[One sentence: what this reference is for.]

Clause served: **[See it / Build it / Ship it]** — [which promise it supports].

---

## Rules

[Numbered list of rules. Each rule is one imperative sentence.
If it needs justification, the justification follows on the next line, indented.]

---

## Examples

| Situation | Without this reference | With this reference |
|---|---|---|
| [concrete scenario] | [what goes wrong] | [what goes right] |

---

## Anti-patterns

| Thought | Reality |
|---|---|
| [common mistake from the source] | [why it fails] |
```

**Constraints:**

- One page. If it needs two, it is two references.
- Every rule must be actionable during a VER phase — not a philosophy statement.
- Examples use the project's domain, not the source's. Translate them.
- Anti-patterns come from the source's warnings, failure modes, or "don't do this" sections.

### 4. Deduplicate — check for overlap

Before landing the file, search existing references:

```
references/karpathy-principles.md
references/ponytail-ladder.md
references/brownfield.md
references/copy-guide.md
references/dependencies.md
references/security-gates.md
references/testing-strategies.md
references/ux-checklist.md
```

For each rule in your draft, ask: is this already said elsewhere? If yes:

- **Same rule, same words:** delete yours.
- **Same rule, better words:** propose replacing the existing line (append-only boundaries
  do not apply to rule refinement within a reference file).
- **New rule:** keep it.

A reference that is 80% overlap with an existing one should be a patch to that file, not a
new file.

### 5. Land — place it and wire it

1. Save to `references/[kebab-case-name].md`.
2. Note which profiles should load it. If a profile's gates would benefit from this reference,
   propose adding a line to that profile pointing here.
3. Record the distillation in `vision-log.md`:

```markdown
## Distilled: [reference name]

Source: [title / URL]
Rules extracted: [count]
Deduplicated against: [which existing references were checked]
Landing: references/[name].md
```

## Output

```markdown
## Distill summary

Source:     [title / URL]
Domain:    [clause served]
Rules:     [count extracted] → [count after dedup]
Overlap:   [which existing references overlapped, or "none"]
Landing:   references/[name].md
Profiles:  [which profiles should load it, or "none — general"]
```

## HARD GATE — no unearned references

- [ ] Source named and scope stated.
- [ ] Every rule is one actionable sentence, not a philosophy.
- [ ] Examples translated to project domain, not copied from source.
- [ ] Deduplication check completed against all existing references.
- [ ] File landed in `references/` with correct VER shape.
- [ ] Distillation recorded in `vision-log.md`.

A reference that restates what an existing file already says is not a new reference. It is noise.

# Brownfield — Working in a Repo You Did Not Write

Clause served: **See it — understand before you touch.**

Greenfield is rare. Most work happens in code that already has opinions, history, and reasons
you cannot see. VER does not suspend its loop for brownfield; it changes the first phase.

---

## The Read-First Protocol

Before writing a line in unfamiliar code, answer these five questions with evidence from the
codebase — not from your assumptions:

1. **Where does this live?** Which file and directory already owns this concern? Find the
   nearest sibling of the thing you are about to write.
2. **What pattern does it use?** Error handling, naming, module boundaries, test layout. Copy
   the pattern even if you dislike it. Consistency beats your preference.
3. **Who else touches this?** Search for callers, imports, and references. A change to a
   shared function is a change to every caller.
4. **What is tested?** Which tests already cover this area? Those tests are the contract you
   must not break — run them before you change anything.
5. **Why is it like this?** Check blame, comments, and DECISIONS-style files. If the reason is
   unknown, assume there is one.

You cannot answer all five from reading one file. Read the neighborhood.

---

## The Brownfield Visualize Delta

Greenfield Visualize asks "what should exist?"
Brownfield Visualize asks "what should change, and what must not?"

Add these to the standard Visualize gate:

- **Blast radius.** Name every file, module, and test the change touches. If you cannot name
  them, you have not read enough.
- **Existing contract.** State what behavior the current code guarantees to its callers. Your
  change must preserve it, or you must explicitly migrate the callers.
- **Reversibility.** Is this diff revertible with one command? If not, say why.
- **The one thing that must not break.** Name it explicitly. It becomes your first test.

---

## Working With an Existing AGENTS.md

If the repo already has an `AGENTS.md`, do not replace it. Read it and treat its rules as
additional invariants layered under VER's.

Resolution order when they conflict:
1. The repo's `AGENTS.md` wins on **project-specific** rules (naming, stack, structure).
2. VER wins on **process** rules (the three phases, the gates, the ladder).
3. If both claim the same rule and disagree, the **stricter** one wins, and the conflict is
   recorded in `DECISIONS.md`.

Install steps live in `INSTALL.md`. The append rule is absolute.

---

## Refinement Mode

When applied to an existing codebase rather than a new task, VER runs its Refine Pass instead
of a fresh loop:

| Pass | Question | Output |
|---|---|---|
| **Validate** | Does the code do what it claims, at every boundary? | List of gaps between claim and behavior. |
| **Enhance** | What is the smallest change that increases value? | One change, ranked against alternatives. |
| **Review** | What would a reviewer object to? | Findings, ranked by severity. |

Refinement never rewrites. It proposes, and the human approves one proposal at a time.

---

## Anti-patterns

| Thought | Reality |
|---|---|
| "I'll rewrite it cleanly while I'm here." | You will break the parts you did not read. |
| "This code is bad, I'll ignore its pattern." | Its pattern is the reason the rest fits together. |
| "No one else uses this function." | Search first. Then say that. |
| "The tests are probably outdated." | Then run them, and say which failed and why. |
| "The comment explains the weird line." | Comments lie. The commit message usually tells the truth. |

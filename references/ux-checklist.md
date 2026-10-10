# UX Checklist — The Five-State Check

Every interface has five states. Most software is designed for two (first use and success).
Most bugs live in the other three.

Clause served: **See it — understand before you touch.**

| State | Question | What it looks like when broken | What it looks like when right |
|---|---|---|---|
| **1. First use** | Nothing exists yet. What does the user see? | Blank screen, empty table, broken layout. | Clear invitation, one obvious action to get started. |
| **2. Success** | The happy path completed. Did the user know? | Page freezes, dialog vanishes with no feedback. | Confirmation, state updated, next step clear. |
| **3. Failure** | Something broke. What now? | "Something went wrong", raw stack trace, silent drop. | What happened, why, and the exact next action to fix it. |
| **4. Waiting** | The system is thinking. Is there feedback? | App appears frozen; user clicks again and duplicates. | Spinner, progress, button disabled, optimistic update. |
| **5. Undo** | The user wants it back. Can they? | "Are you sure?" dialog (which people ignore) then regret. | Toast with "Undo" for destructive actions; reversible. |

---

## Worked example — adding a tag to a document

### 1. First use
- **Bad:** Empty dropdown that says "No tags" with no way to create one.
- **Good:** "No tags yet. Type to create your first tag."

### 2. Success
- **Bad:** Tag silently appears in the DB; UI updates on next page refresh.
- **Good:** Tag animates into the pill list immediately. Focus returns to the input.

### 3. Failure
- **Bad:** Alert: "Error 500: unique constraint violated."
- **Good:** "Tag 'project-x' already exists on this document." (Inline, red, beneath the input.)

### 4. Waiting
- **Bad:** User hits Enter, nothing happens for 1.2s, user hits Enter twice more, 3 identical requests fire.
- **Good:** Input shows a subtle spinner; Enter is disabled until the request resolves.

### 5. Undo
- **Bad:** Deleting a tag is instant and permanent.
- **Good:** "Tag removed. [Undo]" appears in a toast for 5 seconds.

---

## The Human-Path Test

Before marking a UI or UX task complete, walk the path as a human would:

1. Open the page from a fresh session (first use).
2. Complete the primary action (success).
3. Provoke an error deliberately — bad input, disconnect, invalid format (failure).
4. Observe the waiting state on a throttled connection (waiting).
5. Attempt to reverse the action (undo).

A green test suite says nothing about whether this path works. Walk it.

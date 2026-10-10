# Copy Guide

Words in software are interface elements. A bad error message is as broken as a bad layout.

Clause served: **Ship it — do not ship a lie.**

---

## 1. Error messages

Every error message must answer three questions:
1. What happened?
2. Why?
3. What should the user do next?

| Bad | Why it's bad | Good |
|---|---|---|
| "Something went wrong." | Tells the user nothing; destroys trust. | "We couldn't save your changes. Your connection dropped. [Try again]" |
| "Invalid input." | Which field? What was expected? | "Email must include an @ and a domain (e.g. name@company.com)." |
| "Error 403: Forbidden." | Developer error, not user copy. | "You don't have permission to edit this project. Ask an admin for access." |
| "Failed to process request." | Passive voice; blames the user or the void. | "Payment didn't go through: card expired in 03/26. [Update card]" |

**Rules:**
- Full sentences. No fragments.
- Never blame the user ("You entered an invalid..." → "Please enter a valid...").
- Always provide an action: a button, a link, or instructions. Never a dead end.

---

## 2. Button labels

A button label names the **outcome**, not the **mechanism**.

| Bad (mechanism) | Good (outcome) |
|---|---|
| Submit | Send message / Create account / Save changes |
| Click here | Download report / View settings |
| OK | Got it / Continue / Confirm deletion |
| Process | Run analysis / Charge card |
| Yes / No | Delete project / Keep project |

**Rule:** if you read only the button and not the dialog title, you should still know what
will happen when you click it.

---

## 3. Empty states

An empty state is not a blank screen. It is an invitation.

Every empty state must contain:
1. What belongs here (noun).
2. Why it is empty (context).
3. The one action to add the first item (CTA).

| Bad | Good |
|---|---|
| "No items found." | "No projects yet. Create your first project to start tracking tasks. [Create project]" |
| Blank white box | "No notifications. When teammates mention you or assign tasks, they'll show up here." |
| A disabled table | "No search results for 'billing'. Check the spelling or try searching for 'invoice'." |

---

## 4. Confirmation dialogs

Reserve confirmations for truly destructive, irreversible actions. Overusing confirmations
causes users to develop muscle memory and click "Confirm" without reading.

When a confirmation is necessary:
- **Title:** Name the exact action ("Delete 'Project Alpha'?", not "Are you sure?").
- **Body:** State what will be lost ("This will delete 14 tasks and 3 files. This cannot be undone.").
- **Action button:** Destructive verb in red ("Delete project", not "OK" or "Yes").
- **Cancel button:** Safe verb ("Keep project", not "Cancel").

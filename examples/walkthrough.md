# Walkthrough — Add Password Reset

A bounded example of VER v1.1.0 routing a sensitive change. This is illustrative pseudocode;
match the actual repository's language and conventions before applying it.

---

## Task Router

Task: **Add a password reset flow.**

Keywords: `password`, `reset`, `auth`, `email`, `form`.

Router loads: **security + ux + programming**.

- **security** fires because authentication and token handling are sensitive surfaces.
- **ux** fires because a user-facing flow has first-use, success, failure, waiting, and undo states.
- **programming** fires because this changes application behavior.

The stricter gate wins when profiles overlap.

---

## Phase 1 — Visualize

### Restate the goal

Allow a user who forgot their password to regain access through a short-lived, single-use
token delivered to their already-verified email address, without revealing whether an account
exists.

### Five-State Check

| State | Required behavior |
| --- | --- |
| First use | Reset page explains the flow; one field accepts an email address. |
| Success | Same neutral confirmation appears whether the address exists or not. |
| Failure | Invalid or expired link gets a useful message and a route to request another. |
| Waiting | Submit disables while the request runs; visible progress prevents repeat submissions. |
| Undo | No destructive account action occurs; user can leave the flow or request a fresh link. |

### Threat model

- **Asset:** account access and password hash.
- **Attacker:** unauthenticated remote user who can request resets and inspect responses.
- **Abuse paths:** account enumeration, token guessing/replay, token leakage in logs or referrers,
  request flooding, reset of another user's account.
- **Constraints:** never log raw tokens; bind token to one account; store only a hash; expire and
  consume once; rate-limit requests; use a constant-time token comparison where supported.

### Options

| Option | Benefit | Cost / risk |
| --- | --- | --- |
| Email link with random token | Familiar; straightforward single-use flow. | Must protect token in URL, logs, referrers, and storage. |
| Email one-time code | Token not in a URL; works across devices. | More steps; code entry can be phished or guessed without rate limits. |
| Security questions | No email dependency. | Answers are often discoverable, reused, or guessable. Do not choose. |

Decision: **email link**. It fits the existing verified-email account model; mitigate URL-token
exposure and brute force explicitly.

### Minimal spec

- `POST /password-reset`: validate email shape, rate-limit, enqueue mail only for existing
  verified accounts; always return the same status and message.
- Generate 256-bit random token. Store its hash, account ID, expiry (20 minutes), and consumed
  state. Invalidate older active reset tokens for that account.
- Send a link using the configured canonical HTTPS origin. No token in application logs.
- `POST /password-reset/confirm`: validate token and new password, atomically consume the token,
  update the password hash, invalidate active sessions, then show success.
- Profiles loaded: `security`, `ux`, `programming`.
- Out of scope: account creation, changing email, MFA recovery, redesigning the login page.

Gate: outcome, threat model, choice, scope, and success condition agreed. Proceed.

---

## Phase 2 — Engineer

### Read first

Inspect the existing auth routes, password hashing helper, mail queue, session invalidation,
rate-limit middleware, test layout, and sibling form. Preserve their conventions. No new token
service abstraction unless an existing boundary requires it.

### Contract test — RED

Write the narrow test first: unknown and known email addresses return identical public status
and body. Run it; confirm the current handler fails that contract. Then add tests for expiry,
single-use consumption, and password/session update.

### Minimal implementation sketch (~40 lines)

Names illustrate behavior only; use this project's existing primitives.

```diff
+app.post('/password-reset', rateLimitByIPAndEmail, async (req, res) => {
+  const email = parseEmail(req.body.email);
+  if (!email) return res.status(202).json({ message: RESET_ACK });
+
+  const account = await users.findVerifiedByEmail(email);
+  if (account) {
+    const raw = randomBytes(32).toString('base64url');
+    await resetTokens.replaceForAccount(account.id, {
+      tokenHash: sha256(raw), expiresAt: addMinutes(now(), 20), consumedAt: null
+    });
+    await mail.enqueue(account.email, resetUrl(raw));
+  }
+  res.status(202).json({ message: RESET_ACK });
+});
+
+app.post('/password-reset/confirm', async (req, res) => {
+  const { token, password } = parseResetInput(req.body);
+  if (!token || !isStrongPassword(password)) return invalidReset(res);
+  const record = await resetTokens.consumeIfValid(sha256(token), now());
+  if (!record) return invalidReset(res);
+  await users.setPasswordHash(record.accountId, await hashPassword(password));
+  await sessions.revokeAll(record.accountId);
+  res.status(200).json({ message: 'Your password has been reset. Sign in with the new password.' });
+});
```

`consumeIfValid` must be atomic: concurrent requests cannot both consume the same token. The
sketch omits project-specific error plumbing and transaction syntax; it does not relax either
requirement.

Run focused tests after implementation. Add boundary tests for replay, expiry, enumeration,
rate limiting, and concurrent consumption. Keep the existing full auth suite green.

---

## Phase 3 — Release

### Layered security gate

1. **Automated gate:** scan the diff for secrets, unsafe input handling, and known token flaws;
   run auth tests and dependency/security checks available in the repo.
2. **Security guard:** mandatory because auth, user input, and sessions changed. Confirm random
   token generation, hashed storage, constant-time/atomic validation, expiry, one-time use,
   rate limits, neutral responses, log/referrer controls, and session invalidation.
3. **Human-in-the-loop:** not required for this bounded example only if the guard reports high
   confidence, all checks pass, and no privilege boundary or irreversible operation changed.
   Uncertainty, High/Critical severity, or a failed check escalates to a human and blocks release.

### UX and copy gates

- Walk first use, success, invalid/expired failure, slow mail queue, and recovery from an expired link.
- Copy audit: known and unknown addresses receive the same neutral confirmation; error copy gives
  the next action without exposing account state.
- Verify focus, labels, keyboard submission, and disabled/waiting state with the Human-Path Test.

### Release note

```markdown
## Password reset

Added a single-use, 20-minute password reset link for verified accounts. Reset requests use a
neutral response to avoid account enumeration. Active sessions are revoked after a successful reset.

## To undo

Revert this change. If reset tokens were issued, expire them before restoring the previous flow.
```

### Feedback edge

Append to `vision-log.md` after verification:

```markdown
## 2026-10-10 — Password reset

- **Released:** Single-use email-link reset for verified accounts.
- **Observed:** Reset links need clear expiry and a neutral request confirmation.
- **Next vision:** Verify session revocation behavior across every supported session type.
```

Release feeds the next vision. If any gate fails, fix once; a second failure stops the loop and
returns to Visualize.

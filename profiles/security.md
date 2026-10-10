# Security Profile

Loaded when: auth, secret, token, input, deletion, admin, permission, session
Stacks with: programming, devops, data, ux
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Threat model.** State what can be abused and by whom: the asset, the attacker, the entry
  point, the impact if it fails.
- Name the trust boundary. Where does untrusted data enter, and what validates it there?
- If the change touches a sensitive surface, say so explicitly. It escalates the Release gate.

## Adds to Engineer

- **Input validation at the trust boundary.** Not deeper in the call stack, not in the UI only.
- **Parameterized queries.** No string interpolation into SQL, ever.
- **No secrets in code, logs, errors, or fixtures.** Environment or secret store only.
- **Authorization checked server-side.** A hidden button is not an access control.

## Adds to Release

- **Full three-layer security gate.** Automated scan, then the guard if a sensitive surface was
  touched, then human review if the guard is uncertain.
- Verify the failure path: what does the system do when auth fails, input is malformed, or
  permission is absent?

## Anti-patterns

| Thought | Reality |
|---|---|
| "It's internal, so it's trusted." | Internal networks are compromised routinely. |
| "The frontend already validates it." | The frontend is attacker-controlled. Validate server-side. |
| "It's just a log line." | Logs leak secrets to systems with weaker access control. |
| "We'll add auth later." | Later is after the breach. |
| "The guard passed, so it's secure." | The guard checks what it can see. State what it cannot. |

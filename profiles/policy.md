# Policy Profile

Loaded when: ordinance, governance, regulation, pilot, institutional rule, operating procedure
Disambiguation: Civic, institutional, and operational policies load `policy`. Software logic policies (retry policy, cache policy, IAM access rule) load `programming` or `security`.
Stacks with: security, ux, docs, data
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Access & Problem Definition.** State the specific access, organizational, or regulatory problem being addressed. Document baseline metrics and identify all affected stakeholders (patrons, employees, management, public).
- **Marginalized & Non-User Check.** Explicitly evaluate who the baseline data misses (e.g., non-users, shift workers, transit-dependent patrons, vulnerable groups).
- **Evidence Quality.** Inventory the evidence base (empirical operational data, legal standards, comparative institutional precedents).
- **Options & Tradeoffs.** Present at least two viable policy options with explicit costs, operational burdens, and community impacts.
- **Consultation Plan.** Define who will be consulted (frontline staff, unions, community members) before final drafting.
- **Decision Authority.** Identify the governing body, official, or board authorized to enact the policy, and reference the governing authority record. Chat approval covers preparation only.
- **Success & Suspension Criteria.** Define measurable success metrics alongside explicit, pre-declared safety, budget, or operational triggers that mandate immediate pilot suspension.

## Adds to Engineer

- **Stakeholder Consultation Record.** Document dated consultations, attendance, participation gaps, recorded dissent, and unresolved objections.
- **Feedback Traceability.** Explicitly record how stakeholder input and dissent changed, restricted, or shaped the policy proposal.
- **Operational Rehearsals.** Rehearse operational procedures under both normal conditions and minimum-staffing or emergency failure conditions (e.g., lone-worker emergency, severe weather, short staffing).
- **Execution & Readiness Records.** Inspect dated, witnessed records of operational drills, consultation sessions, and procedural dry runs certified by the designated checker.

## Adds to Release

- **Formal Institutional Decision.** Require the dated, formal adoption decision or resolution tied directly to the exact final policy text version.
- **Proof of Live Activation.** Verify that public notices, schedules, signage, building automation, and web updates are published and active.
- **Authorized Suspension Procedure.** Document the exact suspension process, naming the role authorized to suspend the policy immediately if suspension triggers fire.
- **Mandatory Review Milestones.** Assign the post-launch evaluation (e.g., Week 8 review) to a specific role to compare utilization, costs, and complaints against baseline, deciding whether to continue, amend, or terminate. This review feeds the next Vision.
- **Three-Part Bounded Undo.** For irreversible real-world impacts, state responsible authority, immediate reversion steps, and cataloged residual effects (e.g. historical records, incurred expenses).

## Anti-patterns

| Thought | Reality |
|---|---|
| "The policy is standard; staff doesn't need consultation." | Frontline workers absorb the operational friction. Consult first. |
| "A public comment box is sufficient consultation." | Passive notices miss affected non-users. Actively audit participation gaps. |
| "We will define suspension triggers if problems arise." | Define suspension thresholds upfront, before safety or budget fails. |
| "The board approved the draft concept; we can tweak text later." | Institutional authority attaches to the exact versioned text, not an informal draft. |
| "We cannot roll back a live policy." | The Three-Part Bounded Undo provides immediate operational containment. |

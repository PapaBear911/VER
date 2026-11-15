# Cross-Domain Extension Candidates Assessment

An assessment of candidate fields for future V.E.R. profiles or shared-rule guidance, analyzing the distinctive evidence requirements, decision authority models, and whether each field warrants a dedicated profile or is cleanly served by existing base rules.

---

## Candidate Assessment Matrix

| Field | Distinctive Evidence to Assess | Decision Owner & Authority | Recommendation |
|---|---|---|---|
| **Procurement and vendor rollout** | Predeclared evaluation rubrics, standardized and comparable bid records, signed conflict-of-interest disclosures, compliance certifications, and milestone acceptance proof before payment authorization. | Chief Procurement Officer (CPO) or designated Contracting Officer. | **Warrants future profile (`@procurement`).** Procurement involves strict statutory bidding timelines, anti-collusion boundaries, and legal award challenges that benefit from dedicated Gate 1 and Gate 2 checks. |
| **Incident readiness and business continuity** | Dated drills and tabletop simulations with timed Recovery Time Objective (RTO) and Recovery Point Objective (RPO) observations, failover telemetry, and logged commander decisions. | Designated Incident Commander or Business Continuity Director. | **Warrants future profile (`@continuity`).** *Critical Boundary:* V.E.R. governs incident *readiness, exercises, and post-incident reviews*, not live emergency response where sub-second command overrides normal gates. |
| **Education and training** | Pre- and post-instruction learner performance against a standardized rubric, psychometric assessment validity, accessibility audits, and longitudinal retention measures demonstrating training efficacy for the target audience. | Academic Dean, Instructional Design Director, or Chief Learning Officer. | **Serve with existing rules (`@docs` + `@ux`).** Curriculum development and training artifacts are educational content/interaction design; existing gates cleanly express rubrics and learner walkthroughs. |
| **Service operations and process improvement** | Pre-intervention baseline metrics (cycle time, error rate, queue depth), controlled pilot measurement logs, exception handling audits, and formal sign-off from the operating owner accepting custody. | Head of Service Operations or Business Process Owner. | **Serve with existing rules (`@policy` + `@data`).** Process changes operate as operational policies backed by empirical operational data; `@policy` already provides the necessary consultation, rehearsal, and review gates. |
| **Audit remediation** | Multi-period operating evidence demonstrating the remediated internal control operated effectively throughout the agreed testing window (e.g., 90-day sample), absence of exception re-emergence, and formal closure sign-off. | Chief Audit Executive (CAE) or Lead Independent Auditor. | **Warrants future profile (`@audit`).** Audit remediation requires strict evidentiary sampling methods, population completeness verification, and formal re-performance testing unique to compliance and regulatory assurance. |

---

## Architectural Principle for New Profiles

Before proposing any new domain profile, verify:
1. **Rung 1 (YAGNI):** Can the domain be cleanly expressed by the existing base loop (`Visualize → Engineer → Release`) plus existing profiles (e.g. `data`, `security`, `docs`, `policy`)?
2. **Distinctive Evidence Gap:** Does the field demand idiosyncratic, non-negotiable evidentiary mechanisms (e.g., procurement sealed bid secrecy, audit sampling standards) that general gates cannot enforce?
3. **Authority Model:** Does the field possess a clear institutional authority role capable of making falsifiable pass/fail determinations at each gate?

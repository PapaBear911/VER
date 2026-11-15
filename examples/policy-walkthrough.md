# Walkthrough — Library Evening-Hours Pilot (Policy Making)

A complete worked example demonstrating the `@policy` profile in V.E.R. governing an eight-week municipal public library evening-hours pilot.

---

## Task Router

Task: **Design, enact, and evaluate an 8-week pilot extending Central Library closing hours from 6:00 PM to 8:30 PM on Tuesday and Thursday evenings.**

Keywords: `pilot, policy, governance, municipal, operating procedure, library`.

Router loads: **`@policy` + `@ux` + `@security`**.
- `@policy` fires because this enacts an institutional operating policy and pilot intervention.
- `@ux` fires because changes directly alter the public patron journey and service states.
- `@security` fires because night operations touch physical access control and worker safety.

Action disambiguation: This is a civic/institutional policy pilot; it loads `@policy` (not `programming`).

---

## Phase 1 — Visualize

### 1. Access Problem & Baseline
- **Access Problem:** Central Library closes at 6:00 PM Monday through Friday. Employed patrons, shift workers, and evening adult learners cannot access physical reference collections, quiet study rooms, computer terminals, or library programs.
- **Baseline Data:** 12,400 monthly daytime visits; zero evening visits; 342 formal patron survey requests in the trailing 6 months requesting evening hours.
- **Affected Groups:**
  - *Patrons:* Working adults, high school/college students, transit-dependent commuters, unhoused patrons seeking shelter.
  - *Staff:* Frontline circulation clerks, reference librarians, custodial staff, municipal security officers.

### 2. Marginalized Group & Non-User Audit
- **Blindspot Check:** Standard digital surveys miss transit-dependent residents without home internet.
- **Audit Findings:** Municipal Bus Route 14 (the primary transit line serving the library) stops its eastbound route at 8:45 PM. A closing time later than 8:30 PM would leave transit-dependent patrons stranded. Unhoused individuals need clear, equitable behavioral guidelines and warm indoor spaces without punitive exclusion.

### 3. Evidence Quality & Options
- **Evidence Base:** 2024 Oakville Public Library evening pilot case study; City Transit schedule analysis; library staff availability audit.
- **Options Evaluated:**
  - *Option A — Central Library 2 evenings/week (Tue/Thu, 6:00 PM – 8:30 PM) for 8 weeks.*
    - Cost: \$14,800 staff overtime/security; localized impact.
  - *Option B — 1 evening/week across all 3 city branches.*
    - Cost: \$26,000; diluted staffing; lacks security coverage at satellite branches.
  - *Option C — Maintain daytime hours; expand electronic remote book drop only.*
    - Cost: \$2,000; fails to solve the physical study room and digital divide computer access problem.
- **Decision:** **Option A**. Maximizes concentrated security, transit compatibility, and staff support at the central hub.

### 4. Consultation Plan & Authority
- **Consultation Plan:** Two structured sessions with SEIU Local 1021 staff stewards; one public library open forum; direct survey of circulation staff.
- **Decision Authority:** City Library Board of Trustees holds statutory authority over operating hours. Chat approval covers preparation only; formal Board Resolution is required before go-live.
- **Success Criteria:** Average $\ge 45$ patrons per evening hour; $\ge 70\%$ positive patron feedback; staffing overtime variance $\le 5\%$ of budget.
- **Suspension Criteria:** Immediate suspension if security incidents $\ge 2$ in any single week, or if minimum staffing (< 3 employees) occurs on 2 consecutive scheduled nights.

---

### Gate 1 Evidence Packet

#### Passing Evidence Packet
```markdown
### Gate 1 Verification Submission: Library Pilot Vision v1.0
- **Governing Body:** City Library Board of Trustees
- **Statutory Authority Record:** Resolution #2026-44 (Authorizing Evening Pilot Structuring)
- **Approved Vision Document:** `policies/central-hours-pilot-v1.0.md`
- **Scope & Constraints:** Tue/Thu 6:00–8:30 PM; 8 weeks duration; Central branch only.
- **Predeclared Success Metrics:** $\ge 45$ patrons/hour; $\le 5\%$ budget variance.
- **Predeclared Suspension Triggers:** $\ge 2$ security incidents/week OR < 3 staff on 2 consecutive nights.
- **Sign-off:** Approved by Dr. Helena Vance, Library Director (Session Token: `approved`).
```

#### Condition That Blocks Gate 1
*Attempting to proceed to Phase 2 without naming the statutory authority (the Board of Trustees) or omitting the explicit quantitative suspension triggers (e.g., stating vaguely "we will pause the pilot if issues arise").*

---

## Phase 2 — Engineer

### 1. Consultation Evidence & Feedback Impact
- **Consultations Conducted:**
  - Staff Union Consultation (SEIU Local 1021 rep + 14 staff members, 2026-10-14).
  - Public Community Forum (38 attendees, 2026-10-16).
- **Recorded Dissent:** Senior circulation staff expressed strong safety concerns regarding solitary closing procedures and walking to parking lots after dark.
- **Feedback Traceability (How the Proposal Changed):**
  1. Closing time adjusted from 9:00 PM to 8:30 PM to guarantee patrons and staff catch the 8:45 PM Route 14 bus.
  2. Implemented mandatory **Paired-Closing Safety Rule**: minimum 3 staff members on site at all times; municipal security guard escorts staff to vehicles/bus stops.
  3. Added paid 30-minute post-closing wrap-up window (8:30–9:00 PM).

### 2. Operational Rehearsals (Readiness Evidence)
- **Normal Closing Rehearsal (2026-10-18, 8:30 PM):**
  - Tested: Building sweep, patron exit announcements, cash drop, alarm setting.
  - Result: Building secured in 18 minutes. 3 staff + 1 guard present. Passed.
- **Strained Failure Rehearsal — Short-Staffing Drill (2026-10-19, 5:00 PM):**
  - Simulated: 1 clerk calls out sick at 4:30 PM, reducing staff to 2.
  - Tested: Backup call list activated. When backup unavailable within 30 minutes, automated procedure posted "Evening Hours Canceled Tonight" notices on web portal, social media, and entrance doors by 5:15 PM. Orderly standard closure at 6:00 PM executed.
  - Result: Protocol prevented lone-worker violation. Passed.

---

### Gate 2 Evidence Packet

#### Passing Evidence Packet
```markdown
### Gate 2 Verification Submission: Operational Evidence
- **Governing Source:** Municipal Library Operating Standards §4.2 (Staff Safety & Egress)
- **Consultation Log:** `records/consultations/seiu-session-2026-10-14.pdf` (signed by Shop Steward M. Alvarez)
- **Dissent Resolution Record:** `records/consultations/dissent-resolution-matrix.md`
- **Rehearsal Record 1 (Normal Operations):** `records/drills/sweep-rehearsal-2026-10-18.log` (Witness: J. Gomez, Facilities Lead)
- **Rehearsal Record 2 (Short-Staffing Fail-Safe):** `records/drills/contingency-drill-2026-10-19.log` (Witness: K. Patel, Head of Circulation)
- **Observed Result:** Both drills met pre-declared timing and safety thresholds with zero safety violations.
```

#### Condition That Blocks Gate 2
*Presenting the public forum attendance list while failing to provide a witnessed rehearsal record of the short-staffing contingency procedure, or offering an unverified assertion that "staff knows how to close."*

---

## Phase 3 — Release

### 1. Formal Institutional Adoption
- **Board Resolution:** City Library Board of Trustees Resolution #2026-52 adopted at public meeting on 2026-10-21, approving Pilot Operating Policy v1.0.

### 2. Live Activation Verification
- **Web Schedule:** Public library hours page updated live (`https://library.city.gov/hours` returning HTTP 200 with Tue/Thu 8:30 PM notice).
- **Physical Signage:** Dual-language entrance signs verified installed on 2026-10-23.
- **Building Management System (BMS):** HVAC and perimeter exterior lighting schedules verified programmed for Tue/Thu extended run through 9:15 PM.

### 3. Week-Eight Review & Feedback Loop
- **Assigned Role:** Deputy Director of Public Service (A. Morales).
- **Review Scope:** Formal audit comparing Week 1–8 gate count, circulation transactions, operational cost, and incident reports against the daytime baseline.
- **Outcome Mandate:** Deliver recommendation to Board on 2026-12-18 (continue as permanent policy, adjust hours, or terminate). This review feeds the next Vision.

### 4. Release Note & Three-Part Bounded Undo

```markdown
## Shipped
Enacted 8-week Central Library Evening-Hours Pilot (Tue/Thu, 6:00 PM – 8:30 PM) per Board Resolution #2026-52. Live web notices, physical signage, and security schedules activated.

## Skipped
Weekend evening extension (deferred to future budget cycle).

## Watch
Monitor Route 14 bus punctuality at 8:45 PM; track Friday morning staff fatigue feedback.

## Verification
Board Resolution #2026-52 verified; web hours verified live; BMS lighting override verified; rehearsal logs signed on 2026-10-19.

## To undo
1. Responsible Authority: Library Director (or Acting Director).
2. Mitigation Steps: Post pre-drafted reversion notice to website and entrance doors; cancel contracted security guard evening shifts; revert BMS lighting/HVAC schedule to 6:00 PM.
3. Irreversible Residuals: Disbursed staff overtime wages; published physical flyers; historical patron visit records.
```

---

### Gate 3 Evidence Packet

#### Passing Evidence Packet
```markdown
### Gate 3 Verification Submission: Pilot Launch
- **Adoption Instrument:** Board Resolution #2026-52 (Certified copy in `records/board/res-2026-52.pdf`)
- **Live Proof:** HTTP 200 check + screenshot of public hours page; photographic proof of physical door signage.
- **BMS Audit:** Exported lighting controller log showing active 9:15 PM shutoff override.
- **Review Assignment:** Outlook calendar invitation & Board agenda item #7 for 2026-12-18 assigned to Deputy Director A. Morales.
- **Rollback Protocol:** Complete Three-Part Bounded Undo with named authority and pre-drafted cancellation notices.
- **Vision Log Entry:** Logged in `vision-log.md` with operational learning.
```

#### Condition That Blocks Gate 3
*Attempting to close Gate 3 using the Library Director's draft approval before the Board of Trustees has formally passed Resolution #2026-52, or failing to designate the specific person and date for the Week 8 review.*

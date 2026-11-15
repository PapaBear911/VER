# Walkthrough — Facilities Commissioning (Physical Equipment Acceptance)

A complete worked example testing whether V.E.R.'s **shared base rules** (without creating a specialized profile) cleanly govern physical engineering work: the site acceptance of a replacement 500kW emergency backup diesel generator.

---

## Task Router

Task: **Witness, verify, and accept replacement 500kW emergency standby diesel generator (Asset ID: `GEN-500-BLDG-B`) for the North Campus Data Center.**

Keywords: `commissioning, backup generator, electrical, facility, acceptance test, physical asset`.

Router loads: **`base loop` + `@devops` + `@security`**.
- `@devops` fires because this involves physical infrastructure, rollout, and environment blast radius.
- `@security` fires because emergency power touches life-safety transfer switches and physical perimeter security.
- *Notice:* No dedicated `commissioning` profile was created. This walkthrough proves the universal validity of V.E.R.'s shared base rules.

---

## Phase 1 — Visualize

### 1. Asset & Physical Site Identification
- **Asset ID:** `GEN-500-BLDG-B`
- **Serial Number:** `CAT-C15-88421`
- **Location:** North Campus Data Center, Exterior Concrete Equipment Pad B.
- **Scope:** Replacement of retired 350kW unit with new 500kW standby package, including connection to existing 800A Automatic Transfer Switch (`ATS-1`).

### 2. Acceptance Specification & Test Conditions
- **Governing Standard:** Engineering Specification Div 26 32 13 (Standby Engine Generators) & NFPA 110 Level 1 (Emergency and Standby Power Systems).
- **Mandatory On-Site Test Conditions:**
  1. Ambient outdoor temperature $\ge 50^\circ\text{F}$.
  2. Four-hour continuous load bank test at 100% rated load (500kW @ 0.8 PF).
  3. Witnessed simulated utility power interruption: ATS must detect outage, crank generator, stabilize, and transfer critical building load within $\le 10$ seconds.

### 3. Authorized Personnel & Decision Authority
- **Acceptance Authority:** University Director of Facilities & Capital Projects and licensed Professional Electrical Engineer (R. Sterling, PE #EL-49102).
- **Chat Scope Boundary:** Chat approval authorizes the commissioning test plan review and evidence tracking; physical equipment sign-off belongs exclusively to the licensed Professional Engineer.

---

### Gate 1 Evidence Packet

#### Passing Evidence Packet
```markdown
### Gate 1 Verification Submission: Commissioning Plan v1.2
- **Asset Tag & Serial:** Asset `GEN-500-BLDG-B`, Serial `CAT-C15-88421`
- **Site Location:** North Campus Equipment Pad B
- **Engineering Specification:** Div 26 32 13 & NFPA 110 Level 1
- **Required Test Protocol:** 4-hour 100% load bank test + 10-second ATS transfer test
- **Authorized Authority:** R. Sterling, PE #EL-49102 & T. Ross, Director of Facilities
- **Plan Reference:** `cx/plans/GEN-500-BLDG-B-acceptance-plan-v1.2.pdf`
- **Sign-off:** Approved by Facilities Engineering (Session Token: `approved`).
```

#### Condition That Blocks Gate 1
*Submitting a generic electrical testing template that omits the exact asset serial number or fails to state the specific NFPA 110 timing criteria ($\le 10$ seconds).*

---

## Phase 2 — Engineer

### 1. Governing Source Audit (Read-First)
- Prior to physical testing, on-site commissioning agents inspected the physical installation against approved submittals, seismic snubbers, fuel piping pressure test certificates, and manufacturer installation manuals (Caterpillar C15 IOM Manual).

### 2. Readiness Check (Rehearsal) vs. Execution Record
- **Readiness Check — Pre-Start Bump Test (2026-10-22, 10:00 AM):**
  - Performed 15-minute unloaded idle run.
  - Verified: Oil pressure stable at 62 psi; water jacket heater operational at 120°F; DC battery charger float voltage 27.4V.
  - Purpose: Proves operational readiness to accept load; does *not* prove site acceptance.
- **Execution Record — Witnessed Site Acceptance Test (2026-10-23, 1:00 PM – 5:30 PM):**
  - **4-Hour Full Load Test (500 kW resistive load bank):**
    - Hour 1: 500kW, Voltage 480V, Frequency 60.0 Hz, Coolant 182°F.
    - Hour 2: 500kW, Voltage 481V, Frequency 60.0 Hz, Coolant 185°F.
    - Hour 3: 500kW, Voltage 480V, Frequency 59.9 Hz, Coolant 186°F.
    - Hour 4: 500kW, Voltage 480V, Frequency 60.0 Hz, Coolant 185°F.
    - Observed: Zero thermal runaway, zero fluid leaks, exhaust backpressure within spec.
  - **Simulated Grid Outage & Transfer Test (5:15 PM):**
    - Main utility breaker opened via test switch.
    - Engine start signal initiated: 1.2 seconds.
    - Engine reached rated speed and voltage: 5.6 seconds.
    - ATS transfer to emergency bus completed: **8.4 seconds** (Pass: spec $\le 10.0$ seconds).
    - Transient voltage dip: 8.2% (Pass: spec $\le 15\%$).

---

### Gate 2 Evidence Packet

#### Passing Evidence Packet
```markdown
### Gate 2 Verification Submission: Witnessed Load Test Log
- **Asset ID Verified On-Site:** `GEN-500-BLDG-B` (Serial: `CAT-C15-88421`)
- **Site Log Number:** #SAT-GEN-2026-01 (Dated 2026-10-23)
- **4-Hour Load Performance:** 500kW sustained; 480V $\pm 0.5\%$; 60Hz $\pm 0.2$ Hz
- **Witnessed Transfer Time:** 8.4 seconds (NFPA 110 compliant)
- **Witness Signatures:**
  - Lead Commissioning Agent: D. Hayes, CxA (Cert #9921)
  - Senior Electrical Specialist: M. Kowalski (License #EW-4091)
- **Attachment:** `cx/logs/SAT-GEN-2026-01-signed.pdf`
```

#### Condition That Blocks Gate 2
*Presenting the equipment manufacturer's factory test certificate from the assembly plant in Peoria, Illinois as proof of site acceptance, or presenting a test report where the generator transfer time was 11.2 seconds (exceeding the 10-second NFPA threshold).*

---

## Phase 3 — Release

### 1. Engineering Sign-Off & Defect Resolution
- **Punch List Audit:** Item #3 (missing phase tape labeling on load side of ATS) corrected and verified on 2026-10-24. Zero open life-safety defects.
- **Formal Engineering Acceptance:** Official Certificate of Final Acceptance signed and sealed by R. Sterling, Professional Engineer (PE #EL-49102).

### 2. Operational Handoff
- **Custody Transfer:** Set of 3 Operations & Maintenance (O&M) manuals, 5-year warranty certificate, and primary spare filter kit formally handed over to Building Operations Chief.
- **Telemetry Integration:** Central Building Management System (BMS) and SCADA connected via Modbus TCP; real-time fuel level, battery voltage, and generator status verified live in Operations Control Center.

### 3. Release Note & Three-Part Bounded Undo

```markdown
## Shipped
Commissioned and accepted replacement 500kW emergency generator (Asset: GEN-500-BLDG-B, Serial: CAT-C15-88421) at North Campus Pad B. Full load 4-hour run and 8.4-second ATS transfer verified compliant with NFPA 110. SCADA telemetry active.

## Skipped
Automatic fuel polishing system upgrade (scheduled for separate Q2 contract).

## Watch
Inspect fuel filter pressure differential after first 50 hours of operation; verify block heater during upcoming sub-freezing weekend.

## Verification
Witnessed SAT log #SAT-GEN-2026-01 signed on 2026-10-23; PE Certificate of Acceptance sealed; SCADA live telemetry confirmed.

## To undo
1. Responsible Authority: Chief Facilities Engineer (or on-duty Watch Engineer).
2. Mitigation Steps: Switch manual ATS bypass switch to temporary mobile generator connection quick-dock; lock out / tag out (LOTO) breaker #GEN-B-MAIN; issue emergency advisory notifying campus network operations of reduced backup power redundancy.
3. Irreversible Residuals: 4.8 engine operating hours logged on non-resettable run meter; 182 gallons of diesel fuel consumed; permanent concrete seismic anchor bolt holes drilled into Pad B.
```

---

### Gate 3 Evidence Packet

#### Passing Evidence Packet
```markdown
### Gate 3 Verification Submission: Commissioning Release
- **PE Final Acceptance Certificate:** Stamped & signed by R. Sterling, PE #EL-49102 (`cx/certificates/PE-Acceptance-GEN-500.pdf`)
- **Punch List Disposition:** 100% closed (`cx/punchlist/GEN-500-punchlist-resolved.pdf`)
- **Operations Handoff Receipt:** Signed by Building Operations Chief E. Vance
- **Telemetry Verification:** Modbus connection confirmed; live screenshot in `cx/scada/telemetry-handshake.png`
- **Undo Protocol:** Complete Three-Part Bounded Undo documented.
- **Vision Log Entry:** Logged in `vision-log.md`.
```

#### Condition That Blocks Gate 3
*Attempting to hand off the unit to operations while an open punch list item notes an uninspected emergency fuel shutoff valve, or releasing without the stamped certificate from the licensed Professional Engineer.*

---

## Findings on Shared Rules

This walkthrough demonstrates that V.E.R.'s **shared base rules** govern physical facilities commissioning cleanly:
1. **Gate 1:** Demands physical asset serial numbers, site constraints, and licensed engineering authority before testing begins.
2. **Gate 2:** Enforces the critical distinction between factory readiness (rehearsal) and witnessed on-site performance under real load (execution record).
3. **Gate 3:** Ensures punch list resolution, telemetry handoff, and the Three-Part Bounded Undo without requiring unachievable physical rollback.

**Conclusion:** Physical engineering does **not** require a separate profile. The base loop and gates hold across digital, institutional, and physical work.

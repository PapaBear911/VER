# Walkthrough — Tutoring Attendance & Course Completion (Scientific Research)

A complete worked example demonstrating the `@research` profile in V.E.R. governing a retrospective observational study on university peer tutoring and STEM course completion.

---

## Task Router

Task: **Conduct, replicate, and publish a retrospective study investigating whether voluntary peer-tutoring attendance ($\ge 5$ sessions) is associated with higher course completion in introductory undergraduate mathematics.**

Keywords: `study, cohort, hypothesis, methodology, empirical analysis, regression, research`.

Router loads: **`@research` + `@data` + `@testing`**.
- `@research` fires because this governs an empirical scientific study and protocol execution.
- `@data` fires because it operates on cohort datasets, statistical pipelines, and data contracts.
- `@testing` fires because reproducibility and rerun verification must be proven against assertions.

Action disambiguation: This is an empirical academic investigation; it loads `@research` (not a code/library documentation lookup).

---

## Phase 1 — Visualize

### 1. Research Question & Hypothesis
- **Question:** Among first-year undergraduate students enrolled in MATH 101, is attending 5 or more peer-tutoring sessions associated with higher odds of successful course completion (grade $\ge C$), after adjusting for prior academic preparation and demographic covariates?
- **Hypothesis:** Students attending $\ge 5$ sessions will exhibit statistically significant higher odds of completion ($OR > 1.0$) compared to non-attenders ($0$ sessions).

### 2. Protocol & Cohort Definition
- **Target Population:** First-time, full-time undergraduate students enrolled in MATH 101 during Fall 2024 and Fall 2025.
- **Primary Outcome:** Course completion (binary indicator: $1 = \text{Grade } A, B, C$; $0 = \text{Grade } D, F, W$).
- **Primary Exposure:** Peer tutoring attendance categorized as $0$ sessions (reference), $1\text{–}4$ sessions, and $\ge 5$ sessions.
- **Covariates & Confounders:** High school GPA, standardized math placement score, credit hours enrolled, Pell Grant eligibility indicator, first-generation college status, and course instructor section.
- **Missing Data Plan:** Predeclared multiple imputation by chained equations (MICE, $m=10$ imputations) for missing placement scores ($< 3\%$ missingness). Complete case analysis used as primary sensitivity check.

### 3. Reporting Limits & Reproducibility Thresholds
- **Generalizability Boundary:** Single large public research university. Observational design demonstrates statistical association; does not establish causal efficacy.
- **Computational Environment:** R version 4.4.1; dependency lockfile `renv.lock`; fixed pseudorandom seed `20261010`.
- **Predeclared Replication Tolerance:** Coefficient difference between primary analyst and independent second analyst must satisfy $\Delta \hat{\beta} < 10^{-6}$ across all covariates.

### 4. Ethics Clearance & Data Governance Authority
- **IRB Authority:** University Institutional Review Board (IRB). Protocol #24-881 determined **Exempt** under 45 CFR 46.104(d)(4) (secondary use of identifiable private information/records).
- **Data Governance:** University Registrar Data Use Agreement (DUA #REG-2026-09) authorizing de-identified dataset extraction. Chat approval covers analysis structuring only.

---

### Gate 1 Evidence Packet

#### Passing Evidence Packet
```markdown
### Gate 1 Verification Submission: Study Protocol v1.1
- **Institutional Authority:** University Institutional Review Board & Office of the Registrar
- **IRB Determination Letter:** `governance/irb-exemption-24-881.pdf` (Exempt Category 4)
- **Data Use Agreement:** `governance/dua-reg-2026-09-signed.pdf`
- **Pre-Registered Protocol:** `protocols/math101-tutoring-protocol-v1.1.md` (Deposited OSF DOI: 10.17605/OSF.IO/EXMPL)
- **Predeclared Replication Tolerance:** $|\beta_1 - \beta_2| < 10^{-6}$
- **Sign-off:** Dr. Marcus Vance, Principal Investigator (Session Token: `approved`).
```

#### Condition That Blocks Gate 1
*Attempting to begin data processing or analysis without attaching the signed Registrar DUA and official IRB exemption notice, or leaving the numerical replication tolerance unstated.*

---

## Phase 2 — Engineer

### 1. Input Checksums & Cohort Accounting
- **Raw Data Hash:** `data/raw/math101_tutoring_deid.csv` (SHA-256: `9f83a21b3e8c...`)
- **Cohort Reconciliation Ledger:**
  ```text
  Initial raw records extracted:       1,510
  - Excluded: Not first-time freshman:  - 42
  - Excluded: Audited / incomplete:     - 28
  - Excluded: Dropped before census:    - 20
  ──────────────────────────────────────────
  Final Analytical Cohort:             1,420 students (Reconciled: 100% accounted for)
  ```
- **Deviations Log:** Zero unplanned protocol deviations.

### 2. Primary Analysis & Sensitivity Execution
- **Session Execution:** Analysis script `scripts/03_fit_logistic_model.R` executed in container environment:
  ```text
  $ Rscript scripts/03_fit_logistic_model.R
  Loading required package: renv
  * Project '~/research/math-tutoring' loaded. [renv 1.0.7]
  [1] "Fitting primary multivariable logistic model (N=1420)..."
  Coefficients:
                         Estimate Std. Error z value Pr(>|z|)
  (Intercept)           -1.842105   0.312450  -5.90   3.6e-09 ***
  tutoring_5plus         0.392042   0.132890   2.95   0.00318 **   [OR: 1.48, 95% CI: 1.14 - 1.92]
  tutoring_1to4          0.081230   0.114120   0.71   0.47661
  hs_gpa                 0.684120   0.089410   7.65   2.0e-14 ***
  placement_score        0.024100   0.004120   5.85   4.9e-09 ***
  pell_eligible         -0.141200   0.082100  -1.72   0.08543 .
  first_gen             -0.091100   0.078900  -1.15   0.24820
  [1] "Model fit complete. Exit code 0."
  ```
- **Sensitivity Analyses Executed:**
  - Complete case analysis ($N=1,382$): $OR = 1.46$ ($p = 0.004$).
  - Propensity score matched cohort ($N=840$ pairs): $OR = 1.43$ ($p = 0.009$).
  - Imputed dataset model: $OR = 1.48$ ($p = 0.003$). Results robust across specifications.

### 3. Independent Second-Analyst Rerun (Dual Execution Check)
- **Independent Analyst:** Dr. Sarah Chen (Department of Biostatistics).
- **Execution Condition:** Isolated workstation, raw data file checksum verified, `renv::restore()` executed, ran verification wrapper `scripts/verify_replication.R`.
- **Rerun Result:** Maximum parameter delta across all model coefficients was $2.4 \times 10^{-11}$, well below the predeclared threshold of $10^{-6}$.

---

### Gate 2 Evidence Packet

#### Passing Evidence Packet
```markdown
### Gate 2 Verification Submission: Provenance & Replication Certificate
- **Input Checksum:** `math101_tutoring_deid.csv` (SHA-256: 9f83a21b3e8c...)
- **Cohort Audit:** 1,510 raw -> 1,420 analytical records (100% reconciled in `ledger/cohort-attrition.csv`)
- **Primary Session Execution:** Script exit code 0; terminal output captured and logged.
- **Second-Analyst Certificate:** `replication/chen-replication-cert-signed.pdf`
  - Max observed coefficient delta: 2.4e-11 (Predeclared tolerance: < 1e-6)
  - Date of independent execution: 2026-10-24
- **Checksummed Tables:** `outputs/tables/table1_cohort_summary.csv`, `outputs/tables/table2_regression_models.csv`
```

#### Condition That Blocks Gate 2
*An unexplained discrepancy of 15 records in the cohort attrition table, or a second-analyst replication run showing parameter drift exceeding $10^{-6}$ due to an unpinned random seed or package mismatch.*

---

## Phase 3 — Release

### 1. Manuscript Traceability Audit
- Every numerical value, confidence interval, and sample size in manuscript draft `manuscript/v1.0/tutoring_math101_study.md` was cross-checked against `table2_regression_models.csv`. Zero discrepancies.

### 2. Publication Record & Official Release
- **Official Deposit:** Manuscript and reproducibility metadata deposited to University Institutional Repository and Zenodo.
- **Permanent Identifier:** DOI `10.5072/zenodo.109284` (Version 1.0).
- **Distinction:** A journal "submission confirmation email" was rejected as proof of release. Only the public, indexed institutional repository record closed the gate.

### 3. Reproducibility Package & Controlled Access Data Storage
- **Public Archive:** Analysis scripts, Dockerfile, `renv.lock`, codebook, and synthetic dummy dataset hosted on public Zenodo repository.
- **Restricted Data Store:** Raw student records retained inside University Secure Research Data Vault (FERPA compliant). Controlled access request portal URL referenced in the publication metadata: `https://research.univ.edu/data-access/protocol-24-881`.

### 4. Release Note & Three-Part Bounded Undo

```markdown
## Shipped
Published retrospective study manuscript and reproducibility package (DOI: 10.5072/zenodo.109284) establishing an association between peer tutoring ($\ge 5$ sessions) and introductory calculus completion ($OR = 1.48, 95\%\text{ CI: } 1.14\text{–}1.92$).

## Skipped
Causal mediation analysis (deferred to future prospective randomized study).

## Watch
Track student demographic shift in Fall 2026 enrollment; monitor math placement test format revision.

## Verification
Terminal script execution exit code 0; Dr. Chen independent rerun log passed ($\Delta < 10^{-6}$); DOI landing page verified active.

## To undo
1. Responsible Authority: Principal Investigator (Dr. M. Vance) and University Office of Research Integrity.
2. Mitigation Steps: Issue formal corrigendum or retraction notice to Zenodo/repository; update repository README with persistent retraction tombstone watermark.
3. Irreversible Residuals: Previously downloaded PDF/code bundles; downstream literature citations.
```

---

### Gate 3 Evidence Packet

#### Passing Evidence Packet
```markdown
### Gate 3 Verification Submission: Publication Package
- **Publication Record:** DOI 10.5072/zenodo.109284 (Landing page active, metadata indexed)
- **Manuscript Traceability:** Verified 100% cell match between text claims and `table2_regression_models.csv`.
- **Data Governance Compliance:** No raw PII in public repository; controlled-access link verified operational.
- **Retraction Authority:** University Office of Research Integrity and Lead PI designated.
- **Undo Protocol:** Complete Three-Part Bounded Undo documented.
- **Vision Log Entry:** Logged in `vision-log.md` with research learning.
```

#### Condition That Blocks Gate 3
*Submitting a screenshot of an email stating "Your manuscript has been received by the Journal of Higher Education" as proof of release, or failing to establish a secure controlled-access repository link for restricted data.*

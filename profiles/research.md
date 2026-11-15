# Research Profile

Loaded when: study, cohort, trial, hypothesis, methodology, protocol execution, empirical analysis
Disambiguation: Scientific investigations, observational studies, clinical trials, and empirical hypothesis testing load `research`. Researching a software library or reading documentation routes to base direct lookup or `programming`. Database schema experiments load `data`.
Stacks with: data, security, docs, testing
Rule: When two profiles add gates to the same phase, the stricter gate wins.

## Adds to Visualize

- **Falsifiable Research Question.** Frame a precise, falsifiable causal or association question.
- **Protocol & Cohort Specification.** Define inclusion/exclusion criteria, exposure/intervention, outcome variables, comparison groups, confounding variables, and missing data handling strategies.
- **Reporting Limits & Target Population.** Define the sampling frame and declare explicit boundaries on external validity and generalization.
- **Predeclared Reproducibility Criteria.** Predeclare statistical packages, environment constraints, random seed controls, and replication tolerance thresholds.
- **Ethics & Data Governance Authority.** Identify who determines ethics clearance (e.g., Institutional Review Board, Ethics Committee) and data access authorization (Data Use Agreements), referencing governing records before research execution starts. Chat approval covers preparation only.

## Adds to Engineer

- **Versioned Inputs & Environment.** Pin raw dataset checksums, preprocessing pipelines, container/environment definitions, and software versions.
- **Cohort Reconciliation & Accounting.** Maintain an exhaustive, step-by-step accounting of participant/sample exclusions. Verify numbers balance across stages and document all protocol deviations.
- **Execution & Sensitivity Verification.** Execute the statistical analysis and sensitivity analyses across model specifications. Code execution outputs must be observed in the session.
- **Independent Analyst Rerun.** Require an authorized second analyst to re-run the entire pipeline from raw data and code in an isolated environment, confirming results match the primary analysis within predeclared tolerances.
- **Null Result Validity.** A null result derived from a sound, predeclared protocol passes Gate 2 just as readily as a positive finding.

## Adds to Release

- **Claim & Table Traceability.** Trace every reported statistic, table cell, and figure directly to verified execution artifacts.
- **Publication Authorization & Official Record.** Require formal sign-off from the lead investigator or institution, plus an official, dated publication record (e.g., peer-reviewed publication, institutional repository deposit, preprint registry DOI) tied to the exact manuscript version. A submission receipt does not pass.
- **Reproducibility Package with Controlled Access.** Provide public code, data dictionaries, and analysis scripts. If raw data contains sensitive/identifiable information, provide a persistent, controlled-access pointer with verified access protocols.
- **Correction, Retraction & Supersession Protocol.** Designate the role authorized to issue linked corrections or request withdrawal, and record how superseded versions will be identified and linked.

## Anti-patterns

| Thought | Reality |
|---|---|
| "The statistical test is significant, so we can skip the rerun." | Independent second-analyst replication catches data leaks and pipeline artifacts. |
| "A journal submission receipt proves publication." | A submission receipt is a draft under review; Gate 3 requires an official public record or deposit. |
| "We can exclude outliers after seeing the effect." | Post-hoc exclusions invalidate statistical inference. Reconcile all exclusions against protocol. |
| "The study yielded null results, so the task failed." | Methodological rigor, not p-value, determines whether research passes Gate 2. |
| "Data cannot be shared due to privacy, so we skip reproducibility." | Provide an anonymized mock dataset, data dictionary, and controlled-access application protocol. |

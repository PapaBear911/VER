# Walkthrough: Add a Date Picker to the Signup Form

A complete walk through the V.E.R. loop on a real task.

## The Task

"Add a birthdate picker to the user signup form so users can enter their date of birth."

---

## Phase 1 — VISUALIZE

### 1. Visualize
Done looks like: The signup form collects a valid ISO-8601 date string (`YYYY-MM-DD`) via a date picker control, submitted with the existing registration payload, verified by browser form submission test.

### 2. Validate
Read `src/components/SignupForm.html` and `package.json`.
- Existing dependencies: standard web platform, zero UI component libraries installed.
- Assumptions surfaced:
  1. The browser environment supports HTML5 date inputs (universal across modern evergreen browsers).
  2. The backend expects a standard date string format.
  3. No custom calendar skinning or specialized date-range selection is required.
- Does this need to exist at all? (Ponytail Ladder Rung 1): Yes, signup requires birthdate collection for age verification.

### 3. Vision
Tradeoffs presented:
- Option A: Native `<input type="date">`. Native platform control, zero dependencies, full mobile/accessibility support built-in.
- Option B: Third-party library (`flatpickr` or `react-datepicker`). Full visual consistency across OSes, adds bundle weight and supply chain surface.
- Option C: Custom three-field dropdown (Day/Month/Year). Complex leap-year logic, high maintenance.

Choice: Option A. Stops at Ponytail Ladder Rung 4 (native platform feature). Zero added dependencies.

Minimal Spec Chosen:
```html
<label for="dob">Date of Birth</label>
<input type="date" id="dob" name="dob" required>
```

Approval token received: "approved"
HARD GATE 1 PASSED: Vision approved by user.

---

## Phase 2 — ENGINEER

### 1. Establish
Read `src/components/SignupForm.html:15-30` and `tests/signup.test.js`.
Confirmed form structure, field naming conventions, and DOM selectors.

### 2. Engineering
Ponytail Ladder evaluation:
- Rung 1 (YAGNI): Needed.
- Rung 2 (Codebase): No date picker exists.
- Rung 3 (Stdlib): N/A for frontend template.
- Rung 4 (Native platform feature): Native `<input type="date">` completely solves the requirement.

Ladder stops at Rung 4.

Code diff written:
```html
<!-- ponytail: native date input; upgrade to custom calendar only if brand UI spec requires uniform rendering across legacy browsers -->
<label for="dob">Date of Birth</label>
<input type="date" id="dob" name="dob" required>
```

### 3. Execution
TDD Inner Loop:
1. Write test in `tests/signup.test.js`:
   `assert(form.querySelector('input[type="date"][name="dob"]'))`
2. Run test: FAIL (field not present).
3. Insert the two-line HTML change into `src/components/SignupForm.html`.
4. Run test: PASS.

```bash
$ npm test tests/signup.test.js
PASS tests/signup.test.js (1 test, 3 assertions)
```

HARD GATE 2 PASSED: Read-first completed, Ladder stopped at Rung 4, tests executed and passing with output observed.

---

## Phase 3 — RELEASE

### 1. Refinement
Diff review:
- Deleted: 0 lines.
- Added: 2 lines in `src/components/SignupForm.html`.
- Dependencies added: 0.

### 2. Rollout
3x Sanity Check:
1. Run test suite: all 14 tests pass.
2. Public surface check: form payload now includes `dob` field; no breaking API change.
3. Drift check: code matches Vision exactly.

### 3. Release
Release Note:
- Shipped: Date of birth field on signup form using native platform date input.
- Skipped: Third-party datepicker library (unnecessary bundle weight).
- Watch: Verify backend handles empty/malformed date strings at trust boundary.

`vision-log.md` entry:
```markdown
## 2026-10-10 — Signup Date Picker
- **Learning:** Native HTML5 date inputs satisfy form picker requirements without pulling external dependencies; check Rung 4 before installing UI component libraries.
- **Next V seed:** Add server-side ISO-8601 validation for the new dob field.
```

HARD GATE 3 PASSED: Tests green, public surface verified, vision-log.md updated.

---

## Summary
- Total diff: under 5 lines.
- Total dependencies added: zero.
- Total time: one loop.

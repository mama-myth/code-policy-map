# Research Evaluation Plan & Usability Study Protocol

## 1. Research Purpose

The goal of this evaluation plan is to assess **Policy-to-Code Mapper** as a human-centered behavioral intervention and policy-awareness tool. Rather than evaluating legal accuracy (which is explicitly out of scope), this study measures how effectively in-IDE guidance bridges the gap between static policy documents and daily development workflow.

---

## 2. Exploratory Usability Study Design

### Participant Cohort
* **Size:** 5–10 software developers (mix of junior, mid-level, and senior engineers).
* **Environment:** VS Code IDE with Python extension enabled.
* **Duration:** 45 minutes per session.

### Tasks
Participants are asked to complete 3 programming scenarios in Python:
1. **Scenario A (Authentication Module):** Implement user login handler with debug/error logging.
2. **Scenario B (User Profile Update):** Implement profile update handler logging user metadata.
3. **Scenario C (Code Refactoring):** Review an existing Python script containing logging calls and address policy warnings.

---

## 3. Core Evaluation Metrics

Participants complete a post-task survey rated on a 5-point Likert scale (1 = Strongly Disagree, 5 = Strongly Agree), followed by semi-structured qualitative interviews:

| Metric | Survey Question / Dimension | Target Threshold |
|---|---|---|
| **Clarity** | *"The policy guidance and safer code examples were easy to understand."* | Mean $\ge 4.0$ |
| **Usefulness** | *"The in-editor guidance helped me understand organizational policy requirements."* | Mean $\ge 4.0$ |
| **Trust** | *"I trusted the policy findings and explanations provided by the extension."* | Mean $\ge 3.8$ |
| **Intrusiveness** | *"The warning underlines and hover cards interfered with my coding flow."* | Mean $\le 2.0$ |
| **Policy Awareness** | *"I feel more aware of sensitive credential and privacy logging policies."* | Mean $\ge 4.2$ |
| **Adoption** | *"I would use this extension in my daily development work."* | Mean $\ge 4.0$ |

---

## 4. Technical Benchmark & Detection Evaluation Set

To evaluate the precision and recall of local TypeScript pattern detection, a curated evaluation set of Python snippets is provided in `examples/`:

### Snippet Categories:
1. `examples/unsafe_logging.py`: Unsafe credential logging (should trigger `SEC-LOG-001`).
2. `examples/personal_data_logging.py`: Unsafe personal data logging (should trigger `SEC-LOG-002`).
3. `examples/safe_logging.py`: Safe operational logging (should **not** trigger any policy finding).

### Precision & Recall Formulae:
* $\text{Precision} = \frac{TP}{TP + FP}$
* $\text{Recall} = \frac{TP}{TP + FN}$

Where:
* **True Positive (TP):** Detector correctly identifies policy-relevant logging.
* **False Positive (FP):** Detector flags non-policy code or safe logging.
* **False Negative (FN):** Detector misses policy-relevant sensitive logging.

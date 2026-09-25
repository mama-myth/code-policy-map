# Research Methodology: Behavioral Intervention & Human-Centered Security

## 1. Research Motivation

Organizational security policies and regulatory frameworks (such as GDPR or ISO/IEC 27001) are rarely integrated directly into developer workflows. Traditional compliance mechanisms rely on post-hoc code reviews, static analysis security testing (SAST) gates, or annual training—all of which occur asynchronously and far removed from the moment of code creation.

**Policy-to-Code Mapper** is grounded in human-centered security and nudge theory. By presenting lightweight, contextual guidance at the exact point of action (in-editor while typing or analyzing code), the tool reduces cognitive friction and builds security policy awareness seamlessly.

---

## 2. Behavioral Nudge Framework

The extension applies five core behavioral principles:

1. **Contextual Actionability:** Guidance is surfaced in the editor line where the pattern occurs, eliminating the need to search external intranet documentation.
2. **Non-Disruptive Assistance:** Diagnostic warnings use subtle visual cues (warnings, not blocking errors) to preserve flow state.
3. **Traceability & Transparency:** Guidance explicitly traces from the observed code snippet $\rightarrow$ internal policy ID $\rightarrow$ supporting regulatory context $\rightarrow$ recommended action.
4. **Actionable Remediation:** Guidance provides concrete "safer examples" rather than abstract policy statements.
5. **Autonomy Preservation:** The developer maintains full decision-making control; the extension never automatically rewrites code or prevents commits.

---

## 3. Advisory Wording & Non-Legalistic Framing

A central pillar of this research prototype is the strict avoidance of legal-compliance claims. The system is designed as an educational policy-awareness tool, not a legal decision engine.

### Strict Wording Standards:
* **Prohibited Terms:** "Violates GDPR", "Non-compliant code", "Illegal implementation", "GDPR compliance certified".
* **Approved Advisory Terms:**
  * *"Potential policy consideration"*
  * *"Potential security or privacy concern"*
  * *"This code pattern may be relevant to organizational policy SEC-LOG-001"*
  * *"Consider whether this credential or personal data is necessary to log"*
  * *"Automated technical guidance, not legal advice or a compliance determination"*

---

## 4. Evaluation Approach

The research prototype will be evaluated through:
1. **Developer Experience & Usability:** Qualitative feedback on clarity, helpfulness, trust, and perceived intrusiveness.
2. **Policy Comprehension:** Measuring whether contextual in-IDE guidance improves developer understanding of organizational security policies compared to static documentation.

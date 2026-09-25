# System Limitations & Scope Boundaries

## 1. Intentional Non-Goals & Scope Boundaries

**Policy-to-Code Mapper** is designed specifically as an educational research prototype and behavioral intervention tool. It explicitly does **not** aim to be:
* A legal compliance determination tool or regulatory certification engine.
* An automated code rewrite bot or enforcement gatekeeper that blocks commits.
* A universal static analysis security testing (SAST) platform.

---

## 2. Technical Limitations

1. **Regex Pattern Detection vs Full AST Parsing:**
   * The current MVP uses deterministic, boundary-aware regex matching in TypeScript.
   * While fast and local, complex multi-line AST dependencies or dynamic variable aliasing (e.g. `p = password; logger.info(p)`) are not tracked across functions without full AST analysis (reserved for Phase 6+ enhancements).

2. **Language Support Scope:**
   * The initial MVP exclusively supports **Python (.py)** source files. Support for JavaScript/TypeScript, Java, or C# can be added via the modular detector architecture.

3. **Policy Repository Scope:**
   * Policies are loaded from local JSON records (`resources/policies.json`). In enterprise deployments, an administrative interface or local git policy sync would be required to maintain organizational policy rules.

4. **False Positives / Negatives:**
   * Variable names that contain sensitive substrings (e.g. `password_strength_score`) are excluded via regex boundary checks (`(?<![a-zA-Z0-9_])password(?![a-zA-Z0-9_])`), but unlisted custom identifiers require addition to `policies.json`.

---

## 3. Disclaimers & Regulatory Positioning

* **Not Legal Advice:** The guidance provided by this extension is automated technical guidance intended for software developers. It does not constitute legal advice, a legal opinion, or an official audit certification.
* **Developer Control:** The developer remains entirely responsible for code changes, architectural decisions, and compliance verification.

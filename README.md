# Policy-to-Code Mapper: A Context-Aware VS Code Extension for Real-Time Security and Policy Guidance

A native Visual Studio Code extension designed to bridge the gap between organizational security/privacy policies and daily software development practices.

---

## 1. Project Objective

**Policy-to-Code Mapper** is a local-first research prototype extension built with TypeScript for Visual Studio Code. Its objective is to help developers understand relevant organizational security policies and selected privacy/regulatory guidance while they write code.

The extension surfaces policy guidance directly at the point of action:
1. Developer writes potentially policy-relevant code (e.g., logging sensitive credentials or personal data in Python).
2. The extension detects the relevant context locally.
3. The extension identifies the matched organizational policy requirement.
4. The extension presents a concise, clear explanation.
5. The developer receives a safer implementation suggestion.
6. The developer remains in full control of the final decision.

---

## 2. Problem Statement

Security, privacy, and compliance policies are frequently stored in disconnected PDFs, intranet pages, spreadsheets, ticketing systems, or GRC platforms. Developers rarely read or search these repositories while writing features, leading to policy awareness arriving too late (during code reviews, security audits, or security incidents).

**Policy-to-Code Mapper** demonstrates the core principle:
> **Code analysis is the trigger. Policy guidance is the product. Developer understanding is the desired outcome.**

---

## 3. Scope & MVP Focus

The initial MVP focuses on a local-first, highly responsive, non-blocking developer experience:
* **IDE Support:** Visual Studio Code.
* **Target Language:** Python.
* **Policy Topics:** Sensitive credential logging, personal data logging, and secure logging best practices.
* **Detection Mechanism:** Fast, deterministic local TypeScript pattern detection for logging functions (`print`, `logging.*`, `logger.*`) and sensitive identifiers (`password`, `token`, `api_key`, `secret`, `email`, etc.).
* **UI Features:** Editor diagnostic warnings, rich hover guidance cards, activity bar sidebar view, detailed traceability view, and safe implementation examples.

---

## 4. Non-Goals

To maintain clarity of scope and ensure educational/behavioral value:
* **Not a legal compliance decision engine:** The system does not assert legal compliance or non-compliance ("This code violates GDPR", "This application is compliant").
* **Not an enforcement/blocking linter:** The system never blocks editing, saving, running, building, or committing code.
* **Not a cloud SaaS or backend service:** The MVP operates strictly locally within VS Code without requiring APIs, vector databases, RAG pipelines, or LLMs.
* **Not an automated code rewriter:** The extension presents safer examples and guidance, leaving code modification decisions strictly to the developer.

---

## 5. Safety & Legal Disclaimer

> **DISCLAIMER:**
> This extension provides automated technical developer guidance and educational policy context. It does **not** constitute legal advice, a legal-compliance determination, or a formal regulatory audit certification.

---

## 6. Technology Stack

* **Language:** TypeScript (Strict Mode)
* **Runtime:** Node.js LTS
* **API:** Visual Studio Code Extension API
* **Build Tools:** TypeScript Compiler (`tsc`)
* **Testing:** Mocha & `@vscode/test-electron`
* **Data Storage:** Local JSON policy records (`resources/policies.json`)

---

## 7. Development Roadmap

* [x] **Phase 0:** Extension Scaffold & Research Foundation (Metadata, Architecture, Commands, Docs)
* [ ] **Phase 1:** Local Policy Knowledge Base & Policy Types
* [ ] **Phase 2:** Analyze Current File Command & Pattern Detection Engine
* [ ] **Phase 3:** Editor Diagnostics & Hover Guidance
* [ ] **Phase 4:** Policy-to-Code Activity Bar Sidebar & Traceability Panel
* [ ] **Phase 5:** Developer Feedback Engine & Evaluation Framework
* [ ] **Phase 6:** Optional Advanced Enhancements (Local AST, Semantic Search, Quick Fixes)
* [ ] **Phase 7:** Final Documentation & Demo Package

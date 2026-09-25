# Policy-to-Code Mapper: Context-Aware Security & Policy Guidance in VS Code

A native, local-first Visual Studio Code extension built in TypeScript that surfaces contextual security policy guidance and privacy-aware logging best practices directly at the point of coding.

---

## 1. Executive Summary & Objective

**Policy-to-Code Mapper** bridges the gap between static organizational security/privacy documents and daily software development practices. Operating entirely within the VS Code Extension Host runtime, it analyzes source code in real time, detects policy-relevant patterns (such as logging credentials or personal data in Python), and provides actionable, educational guidance without interrupting developer flow.

### Core Principle:
> **Code analysis is the trigger. Policy guidance is the product. Developer understanding is the desired outcome.**

---

## 2. Key Extension Features

* **Command Palette Analysis:** `Policy-to-Code: Analyze Current File` scans active Python files and generates an analysis report in a dedicated VS Code OutputChannel.
* **Editor Diagnostics:** Displays non-blocking yellow warning underlines (`DiagnosticSeverity.Warning`) on policy-relevant lines.
* **Rich Hover Cards:** Hovering over a warning presents Markdown guidance cards with policy rules, risk explanations, code evidence, supporting regulatory citations (e.g. GDPR), recommended actions, safer code examples, and legal disclaimers.
* **Activity Bar Sidebar View:** Dedicated `Policy-to-Code` activity bar icon listing active findings grouped by severity and file line.
* **Interactive Traceability Chain Panel:** Side-by-side Webview displaying the step-by-step provenance: `Code Line` $\rightarrow$ `Observed Pattern` $\rightarrow$ `Policy Requirement` $\rightarrow$ `Supporting Regulatory Context` $\rightarrow$ `Safer Code Example`.
* **QuickFix Code Actions:** Pressing `Cmd+.` / `Ctrl+.` provides automated QuickFix options to replace unsafe logging with safer implementation patterns.
* **Local Feedback Engine:** Record feedback (`Helpful`, `Not Helpful`, `Dismiss`) stored strictly locally using VS Code Memento storage.

---

## 3. Local-First Architecture

```text
┌──────────────────────────────────────────────────────────┐
│                         VS Code                          │
│                                                          │
│  Developer writes Python code                            │
│                   │                                      │
│                   ▼                                      │
│       Policy-to-Code Mapper Extension                    │
│                   │                                      │
│   ┌───────────────┼──────────────────────────────────┐   │
│   ▼               ▼                                  ▼   │
│ Code-context   Local policy                       Guidance │
│ detection      knowledge base                      interface│
│ TypeScript     JSON records                    Diagnostics │
│                                          Hover + Sidebar │
│   │               │                                  │   │
│   └───────────────┴──────────────┬───────────────────┘   │
│                                  ▼                       │
│                    Developer policy awareness            │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Getting Started & Development Setup

### Prerequisites
* **Node.js:** v18.x or v22.x LTS
* **npm:** v9+
* **IDE:** Visual Studio Code v1.85+

### Installation & Build
1. Clone repository and install dependencies:
   ```bash
   git clone https://github.com/policy-to-code/policy-to-code-mapper.git
   cd policy-to-code-mapper
   npm install
   ```

2. Compile TypeScript code:
   ```bash
   npm run compile
   ```

3. Run automated unit test suite:
   ```bash
   xvfb-run npm test
   # Or 'npm test' in environments with an active X display
   ```

4. Launch Extension Development Host:
   - Open repository folder in VS Code.
   - Press `F5` to launch Extension Host window with the extension activated.

---

## 5. Packaging into `.vsix` Bundle

To package the extension into a standalone `.vsix` file for distribution:

1. Install `@vscode/vsce` globally or run via `npx`:
   ```bash
   npx @vscode/vsce package
   ```

2. Install the `.vsix` file into local VS Code:
   ```bash
   code --install-extension policy-to-code-mapper-0.1.0.vsix
   ```

---

## 6. Safety & Legal Disclaimer

> **DISCLAIMER:**
> Policy-to-Code Mapper provides automated technical developer guidance and educational policy context. It does **not** constitute legal advice, a legal opinion, or a legal-compliance determination.

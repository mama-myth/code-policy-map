# Demonstration Script, Presentation Outline, & Viva / Interview Q&A Guide

## 1. Demonstration Script (2–3 Minutes)

### Step 1: Motivation & Setup (0:00 – 0:30)
> *"Security and compliance policies are usually locked away in PDFs or intranet wikis, disconnected from where developers write code. Policy-to-Code Mapper brings policy awareness directly into VS Code at the point of action—completely locally and without blocking developer flow."*
> *Open `examples/unsafe_logging.py` in VS Code.*

### Step 2: Editor Diagnostics & Hover Card (0:30 – 1:15)
> *"As soon as we open `unsafe_logging.py`, notice the yellow warning underlines appearing under `print(password)` and `logger.info(email)`. Hovering over `print(password)` displays a rich Markdown hover card showing:"*
> 1. *Potential policy consideration: SEC-LOG-001 (Sensitive Data Must Not Be Logged)*
> 2. *Why it matters: Risk of credential exposure in log aggregators or backups*
> 3. *Supporting regulatory context: GDPR Article 32*
> 4. *Suggested action & safer example*
> 5. *Standard legal disclaimer*

### Step 3: Activity Bar Sidebar & Traceability Chain (1:15 – 2:00)
> *"Opening the **Policy-to-Code** shield icon in the Activity Bar reveals active findings listed under Active Policy Guidance. Clicking a finding jumps directly to line 7 in `unsafe_logging.py` and opens a side-by-side **Traceability Chain** panel showing the step-by-step connection from code line $\rightarrow$ code pattern $\rightarrow$ policy requirement $\rightarrow$ GDPR regulation $\rightarrow$ safer code example."*

### Step 4: Interactive QuickFix & Local Feedback (2:00 – 2:45)
> *"Pressing `Cmd+.` on the warning underline brings up Quick Fix actions. Selecting **'Replace line with safer example'** instantly refactors the logging statement. Finally, developers can rate guidance as Helpful or Dismiss findings locally—all stored privately on the developer's machine without cloud tracking."*

---

## 2. Presentation Outline

1. **Title Slide:** Policy-to-Code Mapper: Context-Aware Security & Policy Guidance in VS Code
2. **Problem:** The gap between static policy PDFs and daily developer workflows
3. **Solution Principles:** Code analysis is the trigger; Policy guidance is the product; Developer understanding is the outcome
4. **Architecture:** Local-first, native TypeScript VS Code extension
5. **Live Demonstration:** Diagnostics, Hover Cards, Activity Bar Sidebar, Traceability Panel, QuickFixes
6. **Research Contribution:** Human-centered security, nudge theory, non-legal advisory framing
7. **Evaluation Plan:** Qualitative usability study & technical benchmark precision/recall
8. **Conclusion & Q&A**

---

## 3. Viva & Interview Q&A Guide

### Q1: Why build a VS Code extension instead of an external CI/CD scanner or backend API?
**Answer:** Post-hoc CI/CD scanners surface issues too late in the SDLC, forcing context switches during code reviews. Placing guidance directly in the IDE at the point of coding applies nudge theory, turning policy compliance into an educational, real-time behavioral intervention.

### Q2: How do you prevent developers from mistaking your tool for a legal compliance engine?
**Answer:** The extension enforces strict advisory framing. Diagnostic severity is restricted to `Warning` (never `Error`). Every hover card, webview, and output report includes explicit disclaimers stating that findings represent automated technical guidance, not legal compliance conclusions or legal advice.

### Q3: Why use local TypeScript pattern detection instead of an external LLM?
**Answer:** Local TypeScript pattern detection provides deterministic, instant ($\le 10\text{ms}$) results with zero network overhead, zero cost, and complete privacy guarantee (code never leaves the machine). LLMs can hallucinate policy rules or regulatory citations; deterministic local rule engines guarantee accuracy.

### Q4: How does the extension handle user feedback without violating developer privacy?
**Answer:** All feedback actions (`helpful`, `not_helpful`, `dismiss`) are stored locally using VS Code's `globalState` (Memento) API on the local file system. No code snippets, IP addresses, or personal identifiers are collected or transmitted externally.

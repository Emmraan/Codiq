# Security Policy

CODIQ takes security seriously. This policy describes how to report vulnerabilities and what you can expect from us.

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Instead, report privately by email to **security@codiq.dev**. You should receive an acknowledgment within **48 hours**.

Please include:

- Affected version or commit.
- Steps to reproduce.
- A description of the impact.
- Any proof-of-concept, if available.

If you prefer to report confidentially without creating an issue or emailing, you may reach out to any maintainer privately via the project community channels.

## What to expect

- **Acknowledgment** — within 2 business days.
- **Triage** — we'll confirm the report and assess severity.
- **Fix** — timeline depends on severity; critical issues are prioritized.
- **Disclosure** — after a fix is released, we coordinate public disclosure and credit the reporter (if they wish).

## Scope

In scope:

- The CODIQ application and its build-time content pipeline.
- The validation engine and its sandboxed execution harness.
- Dependency supply chain.

Out of scope:

- Third-party infrastructure not operated by the project.
- Issues in user-supplied lesson content (report those as normal bugs).

## Security model

- **No backend, no accounts.** CODIQ stores all user progress locally (IndexedDB with localStorage fallback). There is no server-side user data to compromise.
- **Untrusted code never runs on the main thread.** User code and validators execute inside a sandboxed iframe (CSP `sandbox` attribute, `postMessage` protocol). See [docs/VALIDATION_ENGINE.md](docs/VALIDATION_ENGINE.md).
- **No secrets in the client.** API keys and provider credentials are only ever referenced server-side (reserved for the future AI features).

## Supported versions

Only the latest release on `main` is supported. We do not maintain security fixes for older releases.

## Responsible disclosure

We ask that you allow us a reasonable period to fix and release before public disclosure. We will not pursue legal action against researchers who act in good faith and follow this policy.

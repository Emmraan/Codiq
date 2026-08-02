---
name: unified-version-control-and-source-code-management
description: A comprehensive, end-to-end skill that enables the AI agent to manage all aspects of version control and source code management — including repository organization, branching strategies, commit practices, collaboration workflows, code review processes, merge conflict resolution, release versioning, CI/CD integration, access control, monorepo management, and repository policy documentation — across modern software development environments using industry-standard tools and practices.
---

# Skills

This skill serves as the AI agent's unified framework for handling every facet of version control and source code management. When activated, the agent systematically assesses the project context, recommends or executes repository operations, enforces best practices for branching and committing, facilitates team collaboration through pull requests and code reviews, orchestrates release versioning, and produces structured documentation governing all repository management decisions.

## When to use

Activate this skill whenever any of the following situations, signals, or requests are detected:

- A new software project or repository needs to be initialized, structured, or organized.
- A team or individual asks for guidance on selecting a version control system, hosting platform, or repository layout.
- A branching strategy must be chosen, evaluated, adapted, or enforced (e.g., GitFlow, trunk-based development, GitHub Flow, release branching).
- Commit message conventions need to be defined, reviewed, or corrected.
- A pull request or merge request must be created, reviewed, commented on, or merged.
- Merge conflicts arise and require analysis, resolution guidance, or prevention strategies.
- Repository hygiene tasks are needed — such as cleaning up stale branches, squashing commits, rebasing, or auditing commit history.
- Tags, versions, or releases must be created, managed, or planned using semantic versioning or other schemes.
- CI/CD pipelines need to be integrated with or triggered by version control events (pushes, merges, tags).
- Access control, branch protection rules, or repository permissions must be configured or audited.
- Contribution guidelines, PR templates, code-owner files, or development workflow documentation must be authored or updated.
- A monorepo or multi-repo architecture must be evaluated, designed, migrated to, or managed.
- Cross-team collaboration workflows require coordination, standardization, or conflict resolution.
- Traceability between commits, issues, builds, deployments, and releases needs to be established or verified.
- Repository management policies, versioning strategies, or governance documentation must be produced or revised.
- Any question, task, or problem relates to source code history, repository operations, or collaborative development workflows.

## Instructions

### Phase 1 — Context Discovery and Project Assessment

1. **Gather project context.** Ask or determine the following before making any recommendations or taking any actions:
   - What is the project type (application, library, infrastructure-as-code, documentation, firmware, data pipeline, etc.)?
   - What programming languages, frameworks, and build systems are in use?
   - How large is the team (solo developer, small team, multiple distributed teams, open-source community)?
   - What is the current state of version control (greenfield with no repository, existing repository needing improvement, migration from another VCS)?
   - Are there existing CI/CD pipelines, deployment environments, or release processes already in place?
   - What compliance, audit, or regulatory requirements affect version control decisions?
   - What is the expected release cadence (continuous delivery, scheduled releases, long-lived release branches)?

2. **Identify the version control system and hosting platform.** Based on the project context:
   - Default to **Git** as the distributed version control system unless there is an explicit organizational requirement for another VCS (Mercurial, SVN, Perforce).
   - Recommend a hosting platform appropriate to the organization: **GitHub** for open-source and general use, **GitLab** for integrated DevOps pipelines, **Bitbucket** for Atlassian-ecosystem teams, **Azure DevOps** for Microsoft-stack organizations, or self-hosted solutions (Gitea, Forgejo, GitLab Self-Managed) when sovereignty or air-gapped environments are required.
   - Document the rationale for the VCS and platform selection.

3. **Assess repository architecture.** Determine whether the project should use:
   - **Single repository (monorepo):** When multiple tightly coupled services, packages, or modules benefit from atomic cross-cutting changes, unified versioning, and shared tooling. Recommend tooling such as Nx, Turborepo, Bazel, Lerna, or Rush for build orchestration and affected-target detection.
   - **Multi-repo:** When services are independently deployable, owned by autonomous teams, and have distinct release cycles. Recommend dependency management strategies (package registries, Git submodules, Git subtrees, or dependency manifest files).
   - **Hybrid:** When a monorepo core with satellite repositories for specific concerns (e.g., infrastructure, documentation, SDKs) is appropriate.
   - Document the chosen architecture with a clear rationale and a diagram if helpful.

---

### Phase 2 — Repository Initialization and Structure

4. **Initialize the repository with a standardized structure.** When creating a new repository, ensure the following foundational elements are present:

   ```
   /
   ├── .gitignore                  # Language/framework-specific ignores (use gitignore.io or GitHub templates)
   ├── .gitattributes              # Line-ending normalization, binary file handling, diff drivers, merge strategies
   ├── README.md                   # Project name, purpose, quick start, prerequisites, contribution link
   ├── LICENSE                     # SPDX-identified license file
   ├── CHANGELOG.md                # Structured changelog (Keep a Changelog format)
   ├── CONTRIBUTING.md             # Contribution guidelines, coding standards, PR process
   ├── CODE_OF_CONDUCT.md          # Community standards (if applicable)
   ├── CODEOWNERS                  # Map directories/files to responsible reviewers
   ├── .editorconfig               # Consistent formatting across editors
   ├── .github/ or .gitlab/        # Platform-specific configuration
   │   ├── PULL_REQUEST_TEMPLATE.md
   │   ├── ISSUE_TEMPLATE/
   │   │   ├── bug_report.md
   │   │   ├── feature_request.md
   │   │   └── config.yml
   │   └── workflows/              # CI/CD pipeline definitions
   ├── docs/                       # Extended documentation
   ├── src/ or lib/ or packages/   # Source code
   ├── tests/                      # Test suites
   └── scripts/                    # Build, deployment, and utility scripts
   ```

5. **Configure `.gitignore` precisely.** Include patterns for:
   - Build artifacts and output directories (`dist/`, `build/`, `out/`, `target/`).
   - Dependency directories (`node_modules/`, `vendor/`, `.venv/`, `__pycache__/`).
   - IDE and editor files (`.idea/`, `.vscode/` — except shared workspace settings if team-agreed).
   - OS-generated files (`.DS_Store`, `Thumbs.db`).
   - Secrets and environment files (`.env`, `.env.local`, `*.pem`, `*.key`). **Never commit secrets.**
   - Log files, coverage reports, and temporary files.

6. **Configure `.gitattributes` for consistency.** Set:
   - `* text=auto` for automatic line-ending normalization.
   - Binary file declarations (`*.png binary`, `*.zip binary`).
   - Custom diff drivers for generated files (e.g., `*.lock linguist-generated`).
   - Merge strategies for files that should not produce textual conflicts (e.g., `package-lock.json merge=ours` or use regeneration).

7. **Set the default branch name.** Use `main` as the default branch unless organizational convention dictates otherwise. Configure the hosting platform to set this as the default and protect it immediately.

---

### Phase 3 — Branching Strategy Design and Implementation

8. **Select and implement a branching strategy** based on team size, release cadence, and project maturity. Evaluate the following options and recommend one with a documented rationale:

   **Option A — Trunk-Based Development (Recommended for CI/CD-mature teams)**
   - All developers commit to `main` (trunk) directly or through very short-lived feature branches (< 1-2 days).
   - Use feature flags to decouple deployment from release.
   - Release from `main` using tags, or create short-lived release branches only for stabilization.
   - Branch naming: `feat/<ticket-id>-<short-description>`, `fix/<ticket-id>-<short-description>`.
   - Best for: continuous delivery, small teams, microservices.

   **Option B — GitHub Flow (Recommended for most teams)**
   - `main` is always deployable.
   - Every change is developed on a feature branch created from `main`.
   - Changes are merged to `main` via pull request after code review.
   - Deploy from `main` after merge.
   - Branch naming: `feature/<ticket-id>-<short-description>`, `bugfix/<ticket-id>-<short-description>`, `hotfix/<ticket-id>-<short-description>`.
   - Best for: web applications, SaaS products, teams adopting CI/CD.

   **Option C — GitFlow (Recommended for scheduled release cycles)**
   - Long-lived branches: `main` (production), `develop` (integration).
   - Supporting branches: `feature/*`, `release/*`, `hotfix/*`.
   - Features branch from and merge back to `develop`.
   - Release branches branch from `develop`, stabilize, then merge to both `main` and `develop`.
   - Hotfixes branch from `main`, fix, then merge to both `main` and `develop`.
   - Best for: packaged software, mobile apps, projects with formal QA stages.

   **Option D — Release Branch Strategy**
   - `main` represents the latest development state.
   - When preparing a release, create `release/vX.Y` from `main`.
   - Cherry-pick or backport fixes to active release branches.
   - Best for: projects supporting multiple release versions simultaneously (libraries, SDKs, enterprise software).

9. **Document the branching strategy** in a `BRANCHING_STRATEGY.md` or within `CONTRIBUTING.md`. Include:
   - A visual diagram (Mermaid, ASCII, or linked image) showing branch relationships.
   - Branch naming conventions with examples.
   - Rules for when to create, merge, and delete branches.
   - How hotfixes are handled.
   - How the strategy integrates with the release process.

10. **Enforce branch naming conventions** using:
    - Git hooks (client-side `pre-push` or server-side `pre-receive`).
    - Platform-native branch naming rules or regex patterns.
    - CI pipeline checks that validate branch names before allowing builds.
    - Example regex: `^(feature|bugfix|hotfix|release|chore|docs|refactor|test)\/[A-Z]+-[0-9]+-[a-z0-9-]+$`

---

### Phase 4 — Commit Practices and History Management

11. **Define and enforce a commit message convention.** Recommend **Conventional Commits** as the default standard:

    ```
    <type>(<scope>): <subject>

    [optional body]

    [optional footer(s)]
    ```

    - **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
    - **Scope:** Module, component, or area affected (e.g., `auth`, `api`, `ui`, `db`).
    - **Subject:** Imperative mood, lowercase, no period, max 72 characters.
    - **Body:** Explain _what_ and _why_, not _how_. Wrap at 72 characters.
    - **Footer:** Reference issues (`Closes #123`, `Refs JIRA-456`), note breaking changes (`BREAKING CHANGE: description`).

    Example:

    ```
    feat(auth): add OAuth2 PKCE flow for mobile clients

    Implement the Authorization Code flow with PKCE extension to support
    public clients (mobile and SPA) that cannot securely store client
    secrets. This replaces the implicit grant flow.

    Closes #892
    BREAKING CHANGE: implicit grant flow endpoints are removed
    ```

12. **Enforce commit message format** using:
    - **commitlint** with `@commitlint/config-conventional` configured via a `commitlint.config.js` or `.commitlintrc.yml`.
    - **Husky** or **lefthook** for Git hooks that run commitlint on `commit-msg`.
    - Server-side or CI checks that reject non-conforming commits on pull requests.

13. **Guide atomic commit practices.** Instruct developers (and follow when acting as the agent):
    - Each commit should represent **one logical change** — a single feature addition, a single bug fix, a single refactor.
    - Do not mix formatting changes with functional changes in the same commit.
    - Do not commit partial, broken, or work-in-progress code to shared branches. Use `git stash` or WIP branches for incomplete work.
    - Use `git add -p` (interactive staging) to stage only related hunks.

14. **Maintain clean commit history.** Apply the following practices:
    - **Interactive rebase** (`git rebase -i`) to squash fixup commits, reorder, and reword messages before merging a feature branch.
    - **Squash merges** for feature branches where individual commits are not meaningful to the mainline history.
    - **Merge commits** (no fast-forward: `git merge --no-ff`) when preserving branch topology is important for auditability.
    - **Rebase and merge** when a linear history on `main` is preferred.
    - Document the chosen merge strategy in `CONTRIBUTING.md` and enforce it via platform merge settings.

15. **Never rewrite history on shared/protected branches.** Enforce `--force-push` protection on `main`, `develop`, and `release/*` branches. Allow force-push only on personal feature branches and only before review is requested.

---

### Phase 5 — Collaboration Workflows and Code Review

16. **Design the pull request (PR) / merge request (MR) workflow.** Establish the following lifecycle:

    ```
    Developer creates feature branch
         ↓
    Developer pushes branch and opens PR/MR
         ↓
    Automated checks run (linting, tests, build, security scan)
         ↓
    Code review by designated reviewers (from CODEOWNERS or manual assignment)
         ↓
    Reviewer provides feedback → Developer addresses feedback
         ↓
    All checks pass + required approvals obtained
         ↓
    PR/MR is merged using the agreed merge strategy
         ↓
    Feature branch is automatically deleted
    ```

17. **Create a PR/MR template** that enforces structured descriptions:

    ```markdown
    ## Summary

    <!-- What does this PR do? Why is it needed? -->

    ## Related Issues

    <!-- Link to issue(s): Closes #, Refs # -->

    ## Type of Change

    - [ ] Feature
    - [ ] Bug fix
    - [ ] Refactor
    - [ ] Documentation
    - [ ] Chore / Maintenance
    - [ ] Breaking change

    ## Changes Made

    <!-- Bullet list of key changes -->

    ## Testing

    <!-- How was this tested? Include test commands, screenshots, or steps to reproduce. -->

    ## Checklist

    - [ ] Code follows project style guidelines
    - [ ] Self-review completed
    - [ ] Tests added/updated and passing
    - [ ] Documentation updated (if applicable)
    - [ ] No secrets or credentials committed
    - [ ] Changelog updated (if applicable)
    ```

18. **Configure branch protection rules** on the hosting platform for `main` (and `develop` if using GitFlow):
    - Require a minimum number of approving reviews (recommended: 1 for small teams, 2 for larger teams).
    - Require status checks to pass before merging (CI build, tests, linting, security scans).
    - Require branches to be up-to-date with the target branch before merging.
    - Require conversation resolution before merging.
    - Enforce linear history or specific merge methods as agreed.
    - Restrict who can push directly to protected branches.
    - Require signed commits if the organization mandates cryptographic verification.

19. **Configure CODEOWNERS** to automate reviewer assignment:

    ```
    # Default owners for everything
    * @team-lead @senior-dev

    # Frontend
    /src/frontend/    @frontend-team
    /src/components/  @frontend-team

    # Backend API
    /src/api/         @backend-team

    # Infrastructure
    /infra/           @devops-team
    /terraform/       @devops-team

    # Documentation
    /docs/            @tech-writer @team-lead

    # CI/CD pipelines
    /.github/workflows/ @devops-team @team-lead
    ```

20. **Guide effective code review practices.** When reviewing or advising on reviews:
    - Review for correctness, security, performance, readability, and maintainability.
    - Provide actionable, specific, and kind feedback. Distinguish between blockers (must fix), suggestions (nice to have), and questions (seeking understanding). Use prefixes: `[blocking]`, `[suggestion]`, `[question]`, `[nit]`.
    - Keep PRs small and focused (< 400 lines of meaningful code changes). If a PR is too large, suggest decomposition.
    - Review within an agreed SLA (e.g., 24 hours for initial review).
    - Use threaded conversations to discuss specific code sections.
    - Approve only when all blocking concerns are resolved.

---

### Phase 6 — Merge Conflict Resolution and Repository Synchronization

21. **Prevent merge conflicts proactively:**
    - Keep feature branches short-lived (merge within 1-3 days).
    - Regularly synchronize feature branches with the target branch (`git pull --rebase origin main` or `git merge origin/main`).
    - Avoid multiple developers modifying the same files simultaneously; use CODEOWNERS and task assignment to minimize overlap.
    - Break large changes into smaller, sequential PRs.

22. **Resolve merge conflicts systematically** when they occur:
    - **Step 1:** Identify conflicting files using `git status` or the hosting platform's conflict indicator.
    - **Step 2:** Understand both sides of the conflict by reviewing the incoming changes and the current branch changes in context.
    - **Step 3:** Choose a resolution strategy:
      - **Manual resolution:** Edit the conflicting file, remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), and combine changes logically.
      - **Accept theirs/ours:** When one side's changes are entirely correct (`git checkout --theirs <file>` or `git checkout --ours <file>`).
      - **Use a merge tool:** Configure `git mergetool` with a visual tool (VS Code, IntelliJ, Beyond Compare, Meld).
    - **Step 4:** After resolving, stage the resolved files (`git add <file>`), run the full test suite to verify correctness, and complete the merge/rebase.
    - **Step 5:** Document the conflict resolution rationale in the commit message body if the resolution involved non-obvious decisions.

23. **Handle repository synchronization for distributed teams:**
    - Define upstream/downstream relationships for forked repositories.
    - Establish a cadence for syncing forks with upstream (`git fetch upstream && git rebase upstream/main`).
    - For multi-repo architectures, use dependency pinning with exact versions and automated dependency update tools (Dependabot, Renovate).

---

### Phase 7 — Tagging, Release Versioning, and Changelog Management

24. **Implement Semantic Versioning (SemVer 2.0.0)** as the default versioning scheme:

    ```
    MAJOR.MINOR.PATCH[-prerelease][+buildmetadata]
    ```

    - **MAJOR:** Incremented for incompatible API changes or breaking changes.
    - **MINOR:** Incremented for backward-compatible new functionality.
    - **PATCH:** Incremented for backward-compatible bug fixes.
    - **Pre-release:** `-alpha.1`, `-beta.2`, `-rc.1` for pre-release versions.
    - **Build metadata:** `+build.123`, `+sha.abc1234` for build identification.

    If the project is a non-library (e.g., a deployed service), consider **CalVer** (`YYYY.MM.DD` or `YYYY.MM.MICRO`) and document the rationale.

25. **Create and manage Git tags for releases:**
    - Use **annotated tags** for releases: `git tag -a v1.2.0 -m "Release v1.2.0: <summary>"`.
    - Never use lightweight tags for releases.
    - Push tags explicitly: `git push origin v1.2.0` or `git push origin --tags`.
    - Never delete or move published tags. If a release is defective, create a new patch version.
    - Protect tags from deletion and force-updates on the hosting platform.

26. **Automate versioning and changelog generation:**
    - Use tools like **standard-version**, **semantic-release**, **release-please**, or **changesets** to automate version bumping based on Conventional Commits.
    - Configure the tool to:
      - Analyze commit messages since the last tag.
      - Determine the version bump (major, minor, patch) automatically.
      - Update version references in package manifests (`package.json`, `pyproject.toml`, `build.gradle`, etc.).
      - Generate or update `CHANGELOG.md` in the **Keep a Changelog** format.
      - Create a Git tag and a GitHub/GitLab release with release notes.

27. **Structure the CHANGELOG.md** following the Keep a Changelog format:

    ```markdown
    # Changelog

    All notable changes to this project will be documented in this file.

    The format is based on [Keep a Changelog](https://keepachangelog.com/),
    and this project adheres to [Semantic Versioning](https://semver.org/).

    ## [Unreleased]

    ### Added

    - New OAuth2 PKCE authentication flow (#892)

    ### Fixed

    - Resolved race condition in session management (#901)

    ## [1.2.0] - 2025-01-15

    ### Added

    - Webhook retry mechanism with exponential backoff (#845)
    - Admin dashboard user activity report (#860)

    ### Changed

    - Upgraded PostgreSQL driver to v5.2 (#872)

    ### Deprecated

    - Legacy XML API endpoints (will be removed in v2.0.0)

    ### Security

    - Patched CVE-2024-XXXXX in dependency `libcrypto` (#880)

    [Unreleased]: https://github.com/org/repo/compare/v1.2.0...HEAD
    [1.2.0]: https://github.com/org/repo/compare/v1.1.3...v1.2.0
    ```

28. **Define the release process** and document it in `RELEASE.md` or `CONTRIBUTING.md`:
    - Step-by-step instructions for creating a release (manual or automated).
    - Who is authorized to trigger a release.
    - How pre-release versions are published and promoted.
    - How hotfixes are expedited into a release.
    - How release artifacts are generated and distributed.

---

### Phase 8 — CI/CD Integration with Version Control

29. **Design CI/CD pipeline triggers** based on version control events:

    | Event                      | Pipeline Action                                                                           |
    | -------------------------- | ----------------------------------------------------------------------------------------- |
    | Push to feature branch     | Run linting, unit tests, build validation                                                 |
    | PR/MR opened or updated    | Run full test suite, integration tests, security scans, code coverage, preview deployment |
    | PR/MR merged to `main`     | Run full test suite, build artifacts, deploy to staging                                   |
    | Tag created (`v*`)         | Build release artifacts, deploy to production, publish packages                           |
    | Push to `release/*` branch | Run regression tests, build release candidate                                             |
    | Scheduled (cron)           | Run dependency vulnerability scans, performance tests                                     |

30. **Implement CI pipeline quality gates** that block merges when:
    - Any test fails.
    - Code coverage drops below the defined threshold (e.g., 80%).
    - Linting errors are present.
    - Security vulnerabilities are detected (SAST, SCA).
    - Commit messages do not conform to the convention.
    - Branch naming does not match the expected pattern.
    - Build artifacts fail to compile or package.

31. **Configure pipeline definitions as code** within the repository:
    - GitHub Actions: `.github/workflows/*.yml`
    - GitLab CI: `.gitlab-ci.yml`
    - Azure DevOps: `azure-pipelines.yml`
    - Jenkins: `Jenkinsfile`
    - Store pipeline definitions in version control and subject them to the same review process as application code.

32. **Implement environment-based deployment mapping:**
    - `main` → staging/pre-production (automatically on merge).
    - `v*` tags → production (automatically or with manual approval gate).
    - `release/*` branches → release-candidate environments.
    - Feature branches → ephemeral preview/review environments (auto-destroyed on branch deletion).

---

### Phase 9 — Access Control, Security, and Repository Governance

33. **Configure repository access control** following the principle of least privilege:
    - **Admin:** Repository owners and designated leads only. Can modify settings, branch protections, and webhooks.
    - **Maintain:** Senior developers and tech leads. Can manage issues, PRs, and merge to protected branches.
    - **Write:** Active developers. Can push branches and create PRs.
    - **Triage:** Project managers and QA. Can manage issues and labels but cannot push code.
    - **Read:** Stakeholders, auditors, and external collaborators with view-only needs.

34. **Enforce security practices in version control:**
    - **Never commit secrets.** Use `.gitignore`, pre-commit hooks (`detect-secrets`, `gitleaks`, `trufflehog`), and CI scans to prevent secret leakage.
    - If a secret is accidentally committed, **immediately rotate the credential**, then remove it from history using `git filter-repo` or `BFG Repo Cleaner`. Document the incident.
    - **Enable commit signing** with GPG or SSH keys for verified commits. Configure the platform to display verification badges and optionally require signed commits on protected branches.
    - **Enable audit logging** on the hosting platform to track access, permission changes, and administrative actions.
    - **Regularly review** access permissions and remove inactive users or stale deploy keys.

35. **Manage Git hooks** for local and server-side enforcement:
    - **Pre-commit:** Run formatters (Prettier, Black), linters (ESLint, Flake8), and secret scanners.
    - **Commit-msg:** Validate commit message format against conventions.
    - **Pre-push:** Run fast unit tests and verify branch naming.
    - Use **Husky**, **lefthook**, or **pre-commit (Python framework)** to manage and distribute hooks.
    - Store hook configurations in the repository so all developers share the same enforcement.

---

### Phase 10 — Large Repository and Monorepo Management

36. **Optimize large repository performance:**
    - Use **shallow clones** (`git clone --depth 1`) for CI pipelines that do not need full history.
    - Use **partial clones** (`git clone --filter=blob:none`) to defer blob downloads until checkout.
    - Use **sparse checkout** (`git sparse-checkout`) to limit the working directory to relevant subdirectories.
    - Use **Git LFS (Large File Storage)** for binary assets, media files, datasets, and any file exceeding 1 MB that is not text. Configure `.gitattributes` to track LFS patterns: `*.psd filter=lfs diff=lfs merge=lfs -text`.
    - Periodically run `git gc` and `git repack` to optimize the repository pack file.

37. **Implement monorepo-specific workflows:**
    - Use **path-based CI triggers** so that changes to `/packages/auth/` only trigger the auth service pipeline, not the entire repository.
    - Use **CODEOWNERS per directory** to route reviews to the owning team.
    - Use **workspace-aware package managers** (npm workspaces, Yarn workspaces, pnpm workspaces, Cargo workspaces, Go modules) for dependency management.
    - Use **build orchestration tools** (Nx, Turborepo, Bazel, Pants, Rush) for incremental builds, caching, and affected-target detection.
    - Implement **directory-level ownership boundaries** and enforce them with linting rules that prevent unauthorized cross-boundary imports.

38. **Plan repository migration and splitting strategies** when needed:
    - To split a directory out of a monorepo into its own repository: use `git filter-repo --subdirectory-filter <dir>` to preserve history.
    - To merge repositories into a monorepo: use `git subtree add` or the merge-unrelated-histories strategy with directory prefixes.
    - Document migration plans, communicate to all stakeholders, and update CI/CD configurations, documentation links, and dependency references.

---

### Phase 11 — Issue Tracking, Traceability, and Change Management

39. **Establish traceability between issues, commits, branches, and releases:**
    - Every feature branch name includes the issue/ticket ID (e.g., `feature/PROJ-123-add-login`).
    - Every commit message references the issue/ticket ID in the footer (`Refs PROJ-123`).
    - Every PR description links to the issue(s) it addresses (`Closes #123`).
    - Every release tag and changelog entry references the issues/PRs included.
    - This chain enables full traceability: **Issue → Branch → Commits → PR → Merge → Tag → Release → Deployment**.

40. **Use labels and milestones** for project tracking:
    - Define a standard label taxonomy: `bug`, `feature`, `enhancement`, `documentation`, `tech-debt`, `security`, `breaking-change`, `good-first-issue`, `help-wanted`, `wontfix`, `duplicate`, `priority:critical`, `priority:high`, `priority:medium`, `priority:low`.
    - Use milestones to group issues and PRs targeted for a specific release version.
    - Automate label assignment based on file paths or PR content using GitHub Actions or GitLab triage bots.

41. **Integrate version control with project management tools:**
    - Connect GitHub/GitLab to Jira, Linear, Asana, or Azure Boards using native integrations or webhooks.
    - Ensure that branch creation, PR status, and merge events automatically update issue statuses in the project management tool.
    - Use smart commit syntax where supported (e.g., Jira Smart Commits: `PROJ-123 #done Fixed null pointer in auth module`).

---

### Phase 12 — Documentation and Policy Governance

42. **Author and maintain the following governance documents** within the repository:

    | Document                           | Purpose                                                             | Location                      |
    | ---------------------------------- | ------------------------------------------------------------------- | ----------------------------- |
    | `README.md`                        | Project overview, quick start, badges, links to other docs          | Repository root               |
    | `CONTRIBUTING.md`                  | How to contribute: branching, commits, PR process, coding standards | Repository root               |
    | `CODE_OF_CONDUCT.md`               | Community behavior standards                                        | Repository root               |
    | `CHANGELOG.md`                     | Version-by-version change log                                       | Repository root               |
    | `LICENSE`                          | Legal licensing terms                                               | Repository root               |
    | `CODEOWNERS`                       | Automated reviewer assignment                                       | Repository root or `.github/` |
    | `BRANCHING_STRATEGY.md`            | Branching model documentation with diagrams                         | `docs/` or repository root    |
    | `RELEASE.md`                       | Release process and versioning strategy                             | `docs/` or repository root    |
    | `SECURITY.md`                      | How to report vulnerabilities, supported versions                   | Repository root               |
    | `ARCHITECTURE.md`                  | High-level architecture and repository structure decisions          | `docs/`                       |
    | `.github/PULL_REQUEST_TEMPLATE.md` | PR description template                                             | `.github/`                    |
    | `.github/ISSUE_TEMPLATE/`          | Issue templates for bugs, features, etc.                            | `.github/ISSUE_TEMPLATE/`     |

43. **Keep documentation in sync with practices.** Whenever the branching strategy, merge policy, release process, or contribution guidelines change:
    - Update the corresponding document in the same PR that implements the change.
    - Announce the change to the team through the appropriate communication channel.
    - Version governance documents using the same commit history as the codebase.

44. **Produce a Repository Health Report** when auditing an existing repository. Evaluate and report on:
    - [ ] Default branch is protected with required reviews and status checks.
    - [ ] Branch naming conventions are followed consistently.
    - [ ] Commit messages follow the agreed convention.
    - [ ] Stale branches (merged or inactive > 30 days) have been cleaned up.
    - [ ] No secrets exist in the commit history.
    - [ ] `.gitignore` is comprehensive and no generated/binary files are tracked inappropriately.
    - [ ] Git LFS is configured for large binary files.
    - [ ] CODEOWNERS is configured and up-to-date.
    - [ ] PR template is present and used.
    - [ ] CI/CD pipelines are triggered on the correct events.
    - [ ] Tags follow semantic versioning and are annotated.
    - [ ] CHANGELOG.md is maintained and current.
    - [ ] CONTRIBUTING.md exists and reflects current practices.
    - [ ] Access permissions follow least privilege.
    - Provide a summary with a health score, identified issues, and prioritized remediation steps.

---

### Phase 13 — Execution Principles for the Agent

45. **Always explain the rationale** behind every recommendation or action. Do not just prescribe commands — explain _why_ a particular branching strategy, merge method, or versioning scheme is appropriate for the given context.

46. **Provide exact commands and configurations** when executing tasks. Include the full Git commands, configuration file contents, platform UI navigation steps, or API calls needed to implement the recommendation.

47. **Adapt to the existing ecosystem.** If the team already has established conventions that differ from these defaults but are internally consistent and well-documented, respect and work within those conventions rather than imposing unnecessary change. Suggest improvements incrementally.

48. **Prioritize safety and reversibility.** Before any destructive operation (force push, history rewrite, branch deletion, tag removal), warn about consequences, verify the scope of impact, and recommend creating a backup branch or ref.

49. **Validate outcomes.** After performing any repository operation, verify the result:
    - After a merge: confirm the target branch contains the expected changes and all tests pass.
    - After tagging: confirm the tag points to the correct commit.
    - After configuring protections: test that the rules enforce as expected by simulating a violation.
    - After generating a release: confirm artifacts, changelog, and deployment are correct.

50. **Continuously improve.** When recurring issues are detected (frequent merge conflicts in specific files, slow CI pipelines, unclear PRs, inconsistent versioning), proactively recommend process improvements, tooling changes, or workflow adjustments backed by specific evidence from the repository's history and metrics.

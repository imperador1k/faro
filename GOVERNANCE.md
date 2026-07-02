# Governance Model

> How Faro is governed and how decisions are made.

## Overview

Faro is a **BDFL** (Benevolent Dictator for Life) project with strong community input. The project maintainer makes final decisions but actively seeks community consensus.

## Roles

### Maintainer

- **Current**: Miguel Pereira Santos (@imperador1k)
- **Responsibilities**:
  - Final decision-making on project direction
  - Code review and merge approval
  - Release management
  - Security vulnerability handling
  - Community moderation

### Core Contributors

- Contributors with a proven track record of quality contributions
- **Responsibilities**:
  - Review pull requests in their area of expertise
  - Participate in design discussions
  - Mentor new contributors
- **Appointment**: By the maintainer, based on contribution history

### Contributors

- Anyone who submits a pull request, opens an issue, or participates in discussions
- **Responsibilities**:
  - Follow the [Code of Conduct](CODE_OF_CONDUCT.md)
  - Submit quality contributions
  - Participate in community discussions

### Users

- Anyone using Faro
- **Responsibilities**:
  - Report bugs and issues
  - Provide feedback and feature requests
  - Respect other community members

## Decision-Making Process

### Technical Decisions

1. **Small changes** (bug fixes, minor features) — Direct PR review and merge
2. **Significant changes** (new features, architecture changes) — Discussion via GitHub Issues or Discussions before implementation
3. **Major changes** (breaking changes, new integrations) — RFC process with community feedback period

### RFC Process

For major changes:

1. **Proposal** — Open a GitHub Discussion with the `rfc` tag describing the change
2. **Discussion** — Community feedback for at least 1 week
3. **Refinement** — Incorporate feedback into the proposal
4. **Decision** — Maintainer makes final call
5. **Implementation** — PR with referenced RFC

### Voting

- Not a formal voting system
- Decisions are made by **rough consensus** — discussion continues until major objections are resolved
- The maintainer has final authority

## Release Process

1. **Feature freeze** — 1 week before release
2. **Testing** — All tests must pass, manual QA of critical paths
3. **Release candidate** — Tagged as `vX.Y.Z-rc.1`
4. **Release** — Tagged as `vX.Y.Z` with release notes
5. **Post-release** — Bug fixes in patch releases

### Versioning

Faro follows [Semantic Versioning](https://semver.org/):

- **Major** (1.0.0) — Breaking changes
- **Minor** (0.2.0) — New features, no breaking changes
- **Patch** (0.2.1) — Bug fixes

## Communication Channels

| Channel                                                                     | Purpose                       |
| --------------------------------------------------------------------------- | ----------------------------- |
| [GitHub Issues](https://github.com/imperador1k/myduolingo/issues)           | Bug reports, feature requests |
| [GitHub Discussions](https://github.com/imperador1k/myduolingo/discussions) | General discussion, Q&A, RFCs |
| [GitHub Pull Requests](https://github.com/imperador1k/myduolingo/pulls)     | Code contributions            |

## Code of Conduct

All community members must follow our [Code of Conduct](CODE_OF_CONDUCT.md). Violations should be reported to the maintainer.

## Contributor Recognition

- All contributors are listed in release notes
- Core contributors are listed in the README
- Significant contributions may be acknowledged in the project website

---

## Amendments

This governance model can be amended by the maintainer after community discussion.

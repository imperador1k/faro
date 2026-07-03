# Faro — GitHub Configuration (`.github/`)

> Issue templates, pull request template, and CI/CD workflows.

## Structure

```
.github/
├── PULL_REQUEST_TEMPLATE.md         # PR template with checklist
├── ISSUE_TEMPLATE/
│   ├── bug_report.md                # Structured bug report form
│   └── feature_request.md           # Feature request form
└── workflows/                       # GitHub Actions CI/CD (if present)
```

## Conventions

- All templates are in English
- Bug reports require environment details, steps to reproduce, and logs
- Feature requests focus on user value over implementation
- PR templates include type-of-change checklist and test verification

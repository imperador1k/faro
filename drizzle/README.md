# Faro — Database Migrations (`drizzle/`)

> Auto-generated migration snapshots from Drizzle Kit.

## Structure

Each migration is a folder with a timestamp prefix:

```
drizzle/
├── 0000_initial.sql         # Initial schema creation (~35 tables)
├── 0001_add_survival.sql    # Survival mode tables
├── 0002_add_feed.sql        # Knowledge Feed tables
├── 0003_add_arcade.sql      # Arcade mini-game tables
├── 0004_add_e2ee.sql        # E2EE chat support
├── 0005_add_notifications.sql
├── 0006_adm-feed-posts.sql
├── 0007_add_voices.sql
└── meta/                    # Drizzle Kit metadata
```

## Workflow

```bash
# Generate a new migration after schema changes
bun run drizzle-kit generate

# Apply migration to the database
bun run drizzle-kit migrate

# View current database state
bun run drizzle-kit studio
```

## Conventions

- Never edit migration files after they're generated
- Always test migrations against a staging database first
- Keep migrations small and focused on a single concern

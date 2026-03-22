---
name: liquibase
description: "Apply Liquibase database migration best practices. Use when creating changelogs, writing changesets, managing schema evolution, handling rollbacks, configuring Liquibase with Spring Boot, or troubleshooting migration failures. Triggers: Liquibase, changelog, changeset, migration, schema, db-changelog, precondition, rollback, context, label, databaseChangeLog, liquibase.properties."
argument-hint: "Migration task or problem, e.g. 'add a nullable column to the users table with rollback'"
---

# Liquibase Best Practices

## When to Use This Skill

- Writing a new changeset for a schema change (add column, create table, add index)
- Planning a destructive change (drop column, rename table) safely
- Configuring Liquibase in a Spring Boot project for the first time
- Troubleshooting a failed migration or a checksum mismatch
- Managing migrations across multiple environments (dev/staging/prod)

## Core Concepts — Quick Reference

| Concept | What it is |
|---|---|
| **changelog** | Master file that lists all changesets in order |
| **changeset** | Atomic unit of change — one logical operation, one author, one id |
| **precondition** | Guard that checks state before running a changeset |
| **rollback** | How to undo a changeset (auto-generated for simple changes, manual for complex) |
| **context** | Tag a changeset to run only in specific environments (`dev`, `prod`) |
| **label** | Tag a changeset to run only in specific release batches |

## Changeset Rules

- **Modifying an applied changeset depends on context:**
  - **Feature branch (local / dev DB)** → OK to modify, but **always rollback first** (`liquibase rollback` or `liquibase rollbackCount 1`) before editing, to avoid checksum mismatch on next run
  - **Shared / staging / production** → **Never modify** — the changeset is immutable; create a new one instead
- **One logical change per changeset** — adding a column and populating it are two separate changesets
- **Always provide a rollback** for non-reversible operations (`dropColumn`, `renameTable`, `modifyDataType`, `sql`) — mandatory on feature branch too so you can iterate safely
- **id + author must be globally unique** within the changelog — use `YYYYMMDD-NNN-description` format
- **Use `preConditions`** to make changesets idempotent when operating on existing data

## File Organization

```
src/main/resources/db/
├── changelog/
│   ├── db.changelog-master.yaml       ← master file, only includes others
│   ├── 2024/
│   │   ├── 20240101-001-create-users.yaml
│   │   └── 20240115-002-add-email-index.yaml
│   └── 2025/
│       └── 20250301-001-add-task-table.yaml
```

Master file — never put changesets directly here:
```yaml
databaseChangeLog:
  - include:
      file: changelog/2024/20240101-001-create-users.yaml
      relativeToChangelogFile: true
  - include:
      file: changelog/2025/20250301-001-add-task-table.yaml
      relativeToChangelogFile: true
```

## Spring Boot Integration

```yaml
# application.yml
spring:
  liquibase:
    change-log: classpath:db/changelog/db.changelog-master.xml
    enabled: true
    # contexts: prod   ← uncomment to restrict which changesets run
```

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
    <!-- version managed by Spring Boot BOM -->
</dependency>
```

**Important**: set `spring.jpa.hibernate.ddl-auto=validate` (not `create` or `update`) when using Liquibase — Hibernate should validate, Liquibase should manage the schema.

## Procedure for Common Tasks

See detailed patterns in [changeset patterns](./references/changeset-patterns.md):
- Add a nullable / non-nullable column
- Rename a column safely (3-step process)
- Drop a column safely (2-release process)
- Populate data with rollback
- Add an index without locking the table
- Handle environment-specific changesets with `context`

## Common Failures & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Checksum mismatch` | Existing changeset was modified after being applied | **Feature branch**: rollback the changeset (`liquibase rollbackCount 1`), then re-apply after your edit. **Shared env**: revert the edit and create a new changeset instead |
| `Precondition failed` | Object already exists or doesn't exist | Add `onFail="MARK_RAN"` to the precondition |
| Migration runs in wrong order | `include` order in master file | Reorder `<include>` entries — Liquibase runs them top to bottom |
| `ddl-auto=create` drops Liquibase tables | Hibernate and Liquibase conflict | Set `ddl-auto=validate` or `none` when using Liquibase |
| Lock stuck after failed migration | Liquibase lock not released | Run `liquibase releaseLocks` or `UPDATE DATABASECHANGELOGLOCK SET LOCKED=0` |

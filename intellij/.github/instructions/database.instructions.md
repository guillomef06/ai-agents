---
description: "Database standards. Use when writing or reviewing SQL files, migration scripts, schema definitions, or ORM configurations. Triggers: SQL, migration, schema, Flyway, Liquibase, Alembic, Prisma, TypeORM, Sequelize, table, index, foreign key, transaction."
applyTo: "**/*.sql,**/migrations/**,**/*migration*,**/*Migration*,**/schema.prisma,**/changelog*"
---

# Database Standards

## Migrations

- **Never modify an applied migration** — always create a new one. Applied migrations are immutable history.
- **Always additive in production**: add columns as nullable first → backfill data → then add the NOT NULL constraint in a subsequent migration. Never add a non-nullable column without a default in a single step.
- **Always include a rollback** — every migration must be reversible unless the operation is explicitly destructive and documented as such.
- **No application logic in migrations** — no API calls, no business rules, no conditional branching based on data. Migrations are schema changes only.
- **Name migrations explicitly**: prefix with a timestamp or sequential version + a short description of what changes (`20240315_add_user_email_index`, `V3__add_refresh_token_table`).

## Schema Design

- **Every table must have a primary key** — prefer surrogate keys (`UUID` or auto-increment `BIGINT`) over composite natural keys.
- **Every foreign key must have an index** — unindexed FKs cause full table scans on joins and cascade operations.
- **`NOT NULL` by default** — only allow `NULL` when absence of a value is a valid business state, not as a convenience default.
- **Unique constraints at the DB level** — application-level validation alone is insufficient; race conditions can bypass it. Always back uniqueness rules with a DB constraint.
- **Use appropriate types**:
  - Dates/times → `TIMESTAMP WITH TIME ZONE` (never `VARCHAR`)
  - Monetary amounts → `DECIMAL`/`NUMERIC` (never `FLOAT` or `DOUBLE` — floating point is imprecise)
  - UUIDs → native `UUID` type where supported (not `VARCHAR(36)`)
- **Naming conventions** (SQL standard):
  - Tables: `snake_case`, plural (`users`, `order_items`)
  - Columns: `snake_case` (`created_at`, `first_name`)
  - Foreign keys: `{referenced_table_singular}_id` (`user_id`, `order_id`)
  - Indexes: `idx_{table}_{column(s)}` (`idx_users_email`)
  - Unique constraints: `uq_{table}_{column(s)}` (`uq_users_email`)

## Query Patterns

- **Never use `SELECT *` in production queries** — always name the columns explicitly. `SELECT *` breaks when schema changes and retrieves unnecessary data.
- **Always paginate unbounded result sets** — any query that can return a variable number of rows must have a `LIMIT`/`FETCH FIRST` clause. Never load an entire table into memory.
- **Queries in loops require explicit justification** — loading N entities then querying for each one's relations is a performance hazard at scale. If intentional, document why a join or batch fetch was not used.

## Transactions

- **Wrap all multi-step writes in a single transaction** — if any step fails, the whole operation must roll back. Never leave the database in a partial state.
- **Keep transactions short** — do not hold a transaction open during external HTTP calls, message queue operations, or user-facing latency. Acquire late, release early.
- **Never silently swallow transaction errors** — a caught exception that does not re-throw or roll back explicitly is a data integrity bug.
- **Read-only queries do not need a write transaction** — use read-only transactions or no transaction for pure reads to avoid unnecessary lock contention.

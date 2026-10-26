# 03 — Relational Databases: Postgres, MySQL & the Wrapper Crew

## The filing cabinet model

A **relational database** stores data in **tables** — think spreadsheets with superpowers.

| users | id | email | created_at |
|-------|-----|-------|------------|
| | 1 | maya@co.com | 2024-01-02 |
| | 2 | alex@co.com | 2024-01-03 |

| orders | id | user_id | total |
|--------|-----|---------|-------|
| | 101 | 1 | 49.00 |
| | 102 | 1 | 12.00 |

**Relations:** `orders.user_id` points at `users.id`. That's the **relational** part — no duplicate "Maya's email" on every order row; you **join** tables when you need the full picture.

**SQL** is the language you use to ask questions: `SELECT * FROM orders WHERE user_id = 1`.

---

## Postgres vs MySQL (the headline)

Both are **battle-tested SQL databases**. For vibe-coder purposes:

| | **PostgreSQL** | **MySQL** |
|---|----------------|-----------|
| Vibe | "The default serious choice for new startups" | "Everywhere, especially WordPress/hosting shops" |
| Superpower | Rich types, JSON columns, extensions | Simple, fast reads, huge hosting support |
| You'll see it in | Supabase, Neon, Railway, most indie SaaS | Legacy LAMP stacks, some managed hosts |

**Pick Postgres** unless someone already pays you in MySQL. That's the 2020s default wisdom.

---

## How the backend uses them (not your FE)

```
FE  →  API route  →  ORM/query  →  Postgres
```

The browser **never** connects to Postgres directly (security nightmare). The BE uses:

- **Raw SQL** (purists, performance tweakers)
- **ORMs** — Object-Relational Mappers that let devs write `User.find(1)` instead of SQL strings

Popular ORMs / query layers:

- **Prisma** (Node/TS darling)
- **Drizzle** (lighter TS)
- **SQLAlchemy** (Python)
- **ActiveRecord** (Ruby on Rails — the OG vibe stack)

---

## Wrappers that feel like "Postgres with batteries"

These are **not** replacements for relational theory — they're **hosted Postgres + extras**:

| Tool | What you get |
|------|----------------|
| **Supabase** | Postgres + auto REST/GraphQL-ish APIs + auth + realtime + storage hooks |
| **Neon** | Serverless-flavored Postgres (scale-to-zero, branching for dev) |
| **PlanetScale** | MySQL-compatible, branching workflows (note: MySQL family) |
| **Railway / Render** | Spin up a Postgres **instance** next to your app container |

**Supabase** is the one designers hear most: you still have **tables and SQL**, but you can prototype from the dashboard without writing a custom API for every CRUD button.

---

## Migrations: schema as version control

Tables change over time ("add `avatar_url` column"). **Migrations** are scripted diffs applied in order — like Figma version history, but for structure.

If someone says "migration failed in prod," the kitchen remodel blocked dinner service. Not your gradient mesh.

---

## When relational shines

- Money, inventory, permissions — **facts must be consistent**
- Reports: "revenue by month per region"
- Many apps reading/writing the **same** truth

---

## Builder takeaway

- **Rows and columns**, foreign keys, joins.
- **Postgres** is the indie SaaS default; wrappers like **Supabase** sell speed, not a different species of database.
- Your FE cares about **API JSON**, not table names — until you use Supabase client directly (then you still think in tables, just from the browser with rules).

Next: [04-document-databases-and-scaling.md](./04-document-databases-and-scaling.md) — JSON in the DB and growing without crying.

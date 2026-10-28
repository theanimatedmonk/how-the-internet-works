# 13 — Environments: Staging, QA, Preprod, Prod & Secrets

Same app, **different worlds**. Each world has its own URL, database, API keys, and "please don't break real money" rules.

---

## The parade of environments

Not every company uses every name — but you'll hear these in order of **closeness to real users**:

```mermaid
flowchart LR
  L[Local] --> D[Dev / shared dev]
  D --> Q[QA build]
  Q --> S[Staging]
  S --> PP[Preprod]
  PP --> P[Production]
```

| Environment | Also called | Who uses it | Data | URL vibe |
|-------------|-------------|-------------|------|----------|
| **Local** | localhost | You on laptop | Fake / seed data | `http://localhost:3000` |
| **Dev** | development | Team sandbox | Disposable | `dev.api.company.com` |
| **QA** | test, QA build | QA engineers, automated tests | Copy or synthetic | `qa.app.com` |
| **Staging** | stage, UAT | PM, design, demos | Prod-like but fake | `staging.app.com` |
| **Preprod** | pre-production | Final dress rehearsal | Often prod snapshot (masked) | `preprod.app.com` |
| **Production** | prod, live | Paying users | Real | `app.com` |

**Staging** = "pretend it's prod" — same config shape, smaller scale, **no real charges** (Stripe test mode).

**QA build** = artifact from CI (specific commit) deployed to a test bed — "does this **version** pass E2E?"

**Preprod** = last gate before prod; some orgs skip it; enterprises love it.

**Production** = real users, real Stripe `sk_live_`, real apologies on Twitter if it burns.

Metaphor: **dress rehearsal (staging)** vs **opening night (prod)**. You don't use real bullets in rehearsal.

---

## Worked example: one feature, three worlds

You're adding **"Export PDF invoice."** Same code on all envs — different config.

| Step | Local | Staging | Production |
|------|-------|---------|------------|
| Open app | `localhost:3000` | `staging.yourapp.com` | `yourapp.com` |
| Log in as | Seed user `maya@test.local` | Fake account you created | Real customer |
| Click Export | PDF saved to disk | PDF emailed to `qa+you@company.com` | PDF emailed to customer |
| Stripe charge | None (mock) | Test card `4242...` — no real money | Real card — real money |
| If you break it | You alone | QA + PM roast you in Slack | Twitter + refunds |

**QA build example:** GitHub Actions builds commit `abc123` from PR #42, deploys to `qa.app.com`, runs Playwright: "login → export → file exists." PM doesn't test on prod first.

**Preprod example (big cos):** Database copied from prod last night with emails replaced by `user123@example.com` — final performance test before Sunday deploy window.

---

## Environment variables — worked example

**Your Next.js app** needs the API and Stripe.

**`.env.local`** (only on your laptop, gitignored):

```bash
DATABASE_URL=postgres://localhost:5432/myapp_dev
STRIPE_SECRET_KEY=sk_test_51ABC...your_test_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...
```

**Vercel → Project → Settings → Environment Variables:**

| Name | Preview (PRs) | Production |
|------|---------------|------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `DATABASE_URL` | staging Supabase URL | prod Supabase URL |
| `NEXT_PUBLIC_APP_URL` | `https://preview-xyz.vercel.app` | `https://yourapp.com` |

**Code (same everywhere):**

```javascript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Browser can see this one — it's designed to be public:
const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
```

**What goes wrong — real scenarios:**

```bash
# ❌ Accidentally use live secret in local .env.local
STRIPE_SECRET_KEY=sk_live_...
# You test "refund" button → real customer's real charge refunded

# ❌ Prefix mistake
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_...
# Bundled into JS → anyone View Source → steals key

# ✅ Fix: live key ONLY in Vercel Production env, test keys elsewhere
```

---

## `.env.example` — what teammates clone

Committed to git — **no real values**, just a map:

```bash
# Copy to .env.local and fill in from 1Password / team doc
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/DATABASE
STRIPE_SECRET_KEY=sk_test_get_from_stripe_dashboard
STRIPE_WEBHOOK_SECRET=whsec_get_when_you_create_webhook_endpoint
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

New teammate:

```bash
cp .env.example .env.local
# edit .env.local — never commit it
```

---

## Stripe test vs live — concrete

| | Test mode | Live mode |
|---|-----------|-----------|
| Secret key prefix | `sk_test_` | `sk_live_` |
| Card in checkout | `4242 4242 4242 4242` | Real Visa |
| Dashboard toggle | "Test mode" ON | "Test mode" OFF |
| Use in | local, staging, QA | **production only** |

**Example checkout:** Staging uses `sk_test_` → customer "pays" with test card → webhook fires to `https://staging.api.com/webhooks/stripe` → order marked paid in **staging DB only**. No real rupees move.

---

## CI/CD per environment — example timeline

```
Monday 10:00 — You push branch fix/export-pdf
Monday 10:02 — Vercel comment: Preview https://yourapp-git-fix-export.vercel.app
Monday 10:05 — CI green on PR

Tuesday — Reviewer approves, squash merge to main
Tuesday — Auto deploy staging.yourapp.com (still sk_test_)

Thursday — PM signs off on staging
Thursday — You click "Promote to Production" (or merge release tag)
Thursday — prod gets same git SHA, sk_live_ env vars only on prod
```

GitHub Actions secret example (not in repo):

```yaml
# workflow uses:
env:
  DEPLOY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
# secrets.RAILWAY_TOKEN set in GitHub → Settings → Secrets — never in git
```

---

## Promoting builds — example

**Bad:**

> "Prod works on my machine — I'll `git push` from laptop straight to prod server"

**Good:**

> Staging runs Docker image `myapp:sha-abc123` tested Tuesday. Prod deploy uses **same** `myapp:sha-abc123` — only env vars differ.

Same lasagna, different plate (staging vs prod table).

---

## Database gotchas — examples

```bash
# ❌ .env.local typo — you paste PROD database URL while testing a delete script
DATABASE_URL=postgres://prod.supabase.co/...
node scripts/delete-test-users.js   # deletes real users

# ✅ Use separate URLs; name them clearly
DATABASE_URL=postgres://localhost:5432/myapp_dev
```

**Staging refresh from prod:**

```
Before: customer email in staging = real person@gmail.com  (GDPR oops)
After:  customer email in staging = user_8842@staging.invalid  (masked)
```

---

## Email per env — example

| Env | What happens when user clicks "Send receipt" |
|-----|-----------------------------------------------|
| Local | Logged to terminal or [Mailhog](http://localhost:8025) — no real send |
| Staging | Only sends to addresses ending `@yourcompany.com` |
| Prod | Sends to whoever paid |

Prevents "we tested email blast on staging and emailed 40,000 real users" (happens more than you'd think).

---

## What changes between environments (summary table)

| Thing | Local | Staging | Production |
|-------|-------|---------|------------|
| Database | Docker Postgres | Managed DB, fake users | Managed DB, real users |
| Stripe | Test keys | Test keys | **Live keys** |
| Email | Mailhog / log only | Send to `@test` inboxes | SendGrid to customers |
| Log level | `debug` | `info` | `warn` |
| Feature flags | all on | beta on | gradual rollout |

**Same code, different config** — Docker image or git SHA from staging promotes to prod; not a separate fork of the codebase.

---

## Where secrets live (and where they die)

| ✅ Do | ❌ Don't |
|-------|----------|
| `.env.local` on laptop (gitignored) | Commit `.env` with real keys |
| Platform dashboard: Vercel/Railway **Environment Variables** | Paste prod keys in Slack |
| `.env.example` in repo with **fake placeholders** | Screenshot keys in Figma |
| Separate keys per environment | One Stripe key everywhere |

**`.gitignore`** must include:

```
.env
.env.local
.env.*.local
```

If you ever commit a live key: **rotate immediately** — git history keeps secrets forever.

---

## Local vs remote config flow

```mermaid
flowchart TB
  subgraph laptop [Your laptop]
    CODE[Source code]
    ENVLOCAL[.env.local gitignored]
  end
  subgraph github [GitHub]
    REPO[Repo no secrets]
    ACTIONS[CI secrets vault]
  end
  subgraph hosts [Hosts]
    STG[Staging env vars]
    PROD[Production env vars]
  end
  CODE --> REPO
  ENVLOCAL --> CODE
  ACTIONS --> STG
  REPO --> STG
  REPO --> PROD
  STG -->|promote after QA| PROD
```

**Code** flows through git. **Secrets** flow through host dashboards and CI secret stores — parallel track, never merged into public repo.

More on shipping: [chapter 10](./10-microservices-docker-cicd.md). More on not leaking keys: [chapter 14](./14-security-basics.md).

---

## Checklist before first prod deploy

- [ ] Prod env vars set on host (not in repo)
- [ ] Stripe live keys only in prod
- [ ] `robots.txt` / error tracking (Sentry) configured
- [ ] Backups enabled on prod DB
- [ ] Someone knows how to rollback ([chapter 10](./10-microservices-docker-cicd.md))

---

## Builder takeaway

- **Environment** = URL + DB + keys + who gets hurt if it breaks.
- **Staging** proves the release; **prod** bills customers.
- **Secrets stay local or in vaults** — git is for code, not skeleton keys.

---

## Module complete (for now)

Back to [README.md](./README.md) — then [chapter 14](./14-security-basics.md) so your staging keys aren't everyone's staging keys.

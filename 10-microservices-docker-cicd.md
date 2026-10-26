# 10 — Microservices, Docker & CI/CD (DevOps for Humans)

## Microservices: what the fuck do they mean?

**Monolith:** one codebase, one deployable app — kitchen does apps, mains, and dessert in **one building**.

**Microservices:** split into **many small services** — pizza kitchen, sushi bar, pastry shop — each deploys independently, talks over **HTTP/message queues**.

```
         ┌─────────┐
User ───►│ API GW  │
         └────┬────┘
    ┌──────────┼──────────┐
    ▼          ▼          ▼
 [Users]   [Billing]  [Notifications]
 service    service      service
```

**Why teams do it:** different teams ship different services; scale billing without scaling chat.

**Why it's overkill early:** distributed debugging, network failures, "which service lost the order?" You need **observability** (logs, traces) and adult supervision.

**Vibe coder rule:** start **monolith** (or monolith + one worker). Split when **pain of staying together** > pain of splitting. Not when a podcast said so.

---

## Docker containers: lunchboxes for code

**Problem:** "Works on my Mac" dies on the server because Node version, libc, env vars differ.

**Docker image:** recipe + ingredients frozen — your app, runtime, dependencies in a **container**.

**Container:** running instance of that image — isolated process, same everywhere.

Metaphor: **Meal prep container**. Dev, staging, prod all get the same lasagna. Railway/Render/Fly run your container; you don't SSH and install Node by hand.

**Dockerfile** = instructions to build the image.  
**docker compose** = run app + Postgres + Redis locally with one command.

You don't need to master Kubernetes for your first SaaS. You need to know: **we deploy containers now.**

---

## CI/CD: robots that ship your code

| Term | Meaning |
|------|---------|
| **CI** (Continuous Integration) | On every push/PR, robots run tests, lint, build — "does this merge explode?" |
| **CD** (Continuous Delivery/Deployment) | If green, auto-deploy to staging/prod |

Typical pipeline:

```
git push → GitHub Actions / CircleCI
        → install deps, run tests, build Docker image
        → push image to registry
        → Render/Railway/AWS pulls new image
        → health check → traffic switch
```

**Why you care as a builder:** main branch = source of truth; staging preview URLs (Vercel does this beautifully); fewer "I forgot to run build" incidents.

**Preview deploys:** every PR gets a URL — design review on real infra.

---

## Environments

| Env | Purpose |
|-----|---------|
| **local** | your laptop |
| **staging** | pretend prod, safe to break |
| **production** | real users, real money, real panic |

Secrets (API keys) live in **env vars** per environment — never committed to git. `.env.local` is not a shareable love letter.

---

## Builder takeaway

- **Microservices** = many small apps; not your day-one architecture.
- **Docker** = reproducible deploys.
- **CI/CD** = automated quality gate + shipping.

When someone says "we containerized the auth service," nod and ask if staging still auto-deploys.

Next: [11-integrations.md](./11-integrations.md) — OAuth, webhooks, MCP.

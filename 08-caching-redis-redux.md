# 08 — Caching: Redis, CDN & Redux (Not the Same Beast)

People say "cache" like it's one spice. It's three different dishes.

---

## 1. Server-side cache (Redis)

**Redis** = insanely fast in-memory key-value store living next to your API.

**Use:** "We computed this expensive dashboard aggregate 10 seconds ago — serve the saved result instead of hammering Postgres."

```
Request → API checks Redis key "dashboard:user_9f2"
       → hit: return cached JSON (milliseconds)
       → miss: query DB, store in Redis with TTL, return
```

**TTL** = time to live — auto-expire so data doesn't rot forever.

**Improves UX by:** lower API latency, fewer DB meltdowns under traffic.

Redis is **not** your primary database (don't store the only copy of payments there). It's **scratch paper** the kitchen shares.

Alternatives: Memcached, Valkey, Upstash (serverless Redis).

---

## 2. HTTP / CDN cache

Browsers and CDNs cache **responses** by rules (`Cache-Control` headers).

**Use:** static assets, public JSON that changes rarely, images from [chapter 07](./07-storage-s3-and-the-pipeline.md).

**Improves UX by:** instant repeat loads, less bandwidth.

**Stale data risk:** user sees old avatar until cache expires — designers notice this as "my deploy didn't update!"

---

## 3. Client state cache (Redux, Zustand, React Query, SWR)

This lives **in the browser**, not in Redis.

| Tool | Vibe |
|------|------|
| **React Query / TanStack Query** | Cache **server JSON** per key; refetch, stale-while-revalidate |
| **SWR** | Same family — "show cached, refresh in background" |
| **Redux / Zustand** | **App state** — UI toggles, wizard steps, *also* sometimes copy of server data |

**Improves UX by:**

- Optimistic UI ("saved!" before server answers)
- No loading spinner on every tab switch
- Offline-ish feel with instant paint from memory

**Redux is not Redis.** Redux doesn't protect your database from traffic. It organizes **frontend brain**.

---

## How they stack

```
User opens app
  → React Query serves last session's projects from memory (instant)
  → Background refetch hits API
  → API checks Redis for hot endpoints
  → Miss goes to Postgres
  → Response cached at API + stored in React Query
  → Images from CDN cache
```

---

## When caching lies to you

- User "doesn't see" their update → stale client cache or CDN
- Admin changes feature flag → need invalidation strategy (delete Redis key, bump CDN version query `?v=2`)

---

## Builder takeaway

| Layer | Where | Fixes |
|-------|-------|-------|
| Redis | Server | DB load & API speed |
| CDN | Edge | Asset delivery |
| React Query / Redux | Browser | Perceived speed & UI state |

Ask in standup: **"Which cache is stale?"** — saves an hour of blame tennis.

Next: [09-pick-your-stack-players.md](./09-pick-your-stack-players.md) — AWS vs indie wallets.

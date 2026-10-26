# 05 — Serverless vs Persistent Servers: Chefs & Caterers

## The metaphors (tattoo these)

**Persistent server** (Render, Railway, a VPS, classic EC2):

> Hiring a **full-time chef** in your kitchen **24/7**. They're always ready to cook the second someone walks in. You pay **monthly salary** even if zero customers show up Tuesday afternoon.

**Serverless / cloud function** (Vercel Functions, AWS Lambda, Firebase Functions, Netlify Functions):

> **Catering on demand.** Customer orders → chef **materializes**, cooks, washes dishes, hands you a bill for **those 10 minutes**, vanishes. Pay per invocation + compute time, not idle stove.

Both can serve the same **API** to your FE. The **billing and lifecycle** differ.

---

## What "serverless" actually means

Not "no servers" — **you don't manage the server**. The platform:

1. Receives HTTP request (or event)
2. **Spins up** (or reuses) a tiny runtime
3. Runs your function code
4. Returns response
5. May **freeze or destroy** the instance

**Vercel** loves this for Next.js: API routes and server components can run as ephemeral compute at the edge or in a region.

**Firebase Functions** same energy, wired to Firestore/auth triggers.

---

## Cold starts: the first pancake is always weird

If nobody ordered in a while, the kitchen was **empty**. First request wakes a new container:

- **Cold start:** extra latency (hundreds of ms to seconds) — JVM and fat Node bundles suffer most
- **Warm:** next requests reuse the same instance — snappy

**"Infinite container creation"** (Vercel/AWS scaling out): traffic spike → platform spins **many** parallel instances. Great for handling viral moments; your bill and cold-start roulette also spike.

Mitigations (names only): keep functions small, provisioned concurrency (AWS), edge where it fits, or move hot paths to a **persistent** service.

---

## Persistent servers: when you need someone always on

Use a **always-on process** when:

| Need | Why serverless sucks at it |
|------|----------------------------|
| **WebSockets** long-lived connections | Functions expect short requests |
| **Background workers** (email queue, video transcode) | Need a process chewing jobs for hours |
| **Cron jobs** ("every night at 2am, sync Stripe") | Scheduled process on a box |
| **Low-latency always-warm API** | No cold-start roulette |

**Render** — web service + worker + cron in one DX.  
**Railway** — deploy containers, add Postgres, cron via services.  
**Fly.io, DigitalOcean App Platform** — same family.

You deploy a **container or Node process** that stays up. Health checks, restarts, logs — your problem-ish (platform helps).

---

## Frontend hosting vs backend hosting (common confusion)

| Platform | Often hosts… |
|----------|----------------|
| **Vercel / Netlify** | FE static assets + **serverless** API routes |
| **Render / Railway** | **Persistent** API, workers, DB sidecars |
| **Firebase** | Hosting + functions + Firestore bundle |

You can mix: FE on Vercel, API on Railway. CORS and env vars become your afternoon.

---

## Builder takeaway

- **Prototype / marketing site + light API** → Vercel serverless is chef's kiss.
- **Sockets, queues, cron, "always warm"** → persistent server (Render/Railway).
- **Cold start** = first customer after quiet hours waits longer.

Next: [06-how-fe-and-be-talk.md](./06-how-fe-and-be-talk.md) — HTTP, sockets, and "don't call us, we'll call you."

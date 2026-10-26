# 09 — Who Sells What: AWS Scale vs Indie-Friendly

## The kingdoms (not exhaustive, but honest)

### Hyperscaler: **AWS** (Amazon Web Services)

**Supreme court of cloud** for enterprises. Regions worldwide, every service ever named with an acronym.

| You want… | AWS thing |
|-----------|-----------|
| Virtual machines | EC2 |
| Serverless functions | Lambda |
| Object storage | **S3** |
| Managed Postgres | RDS |
| CDN | CloudFront |
| Load balancing | ALB/ELB |
| Kubernetes if you're feeling dangerous | EKS |

**When:** compliance, huge scale, hired DevOps, multi-region, "we need a service for everything."

**Vibe:** powerful, verbose, bill surprise potential. Not where most designers prototype.

**Peers:** Google Cloud (GCP), Microsoft Azure — same weight class.

---

### Indie / builder-friendly (lower ceremony)

| Need | Players |
|------|---------|
| FE + serverless API | **Vercel**, Netlify |
| Mobile + auth + realtime DB | **Firebase** |
| Postgres + auth + storage DX | **Supabase** |
| Persistent API + worker + cron | **Render**, **Railway**, Fly.io |
| Cheap VPS you SSH into | DigitalOcean Droplet, Hetzner |
| S3-compatible cheap storage | Cloudflare **R2**, DO Spaces |
| Serverless Redis | Upstash |
| Email | Resend, Postmark |
| Payments | Stripe |

**When:** shipping MVP, side project, small team, predictable DX over infinite knobs.

---

### Decision cheat sheet (no guilt)

| Situation | Lean toward |
|-----------|-------------|
| Next.js marketing + light API | Vercel |
| Need SQL + auth fast | Supabase |
| WebSockets + background jobs | Railway / Render |
| Already on Firebase mobile | Firebase stack |
| Enterprise IT mandates cloud | AWS/GCP/Azure |
| "We outgrew Heroku" memes | Railway/Render or proper AWS migration |

**Migration path** that happens in real life: Supabase + Vercel → add worker on Railway → eventually hire person who speaks IAM.

---

### Regions (why "where is it hosted?" matters)

Data lives in a **region** (e.g. `ap-south-1` Mumbai). Closer region = lower latency for users there. **GDPR/data residency** sometimes forces EU-only.

AWS has the most region sprawl; indie hosts pick 1–3 regions for you.

---

### Cost philosophy

- **Serverless:** cheap at zero users, scales with success (and spikes).
- **Persistent:** baseline monthly even at zero.
- **AWS:** pay for what you use + complexity tax (NAT gateways, the eternal meme).

---

## Builder takeaway

You don't need AWS on day one unless the client already lives there. **Match tool to conversation:**

- Designer prototype → Supabase/Vercel
- Realtime product → check persistent + DB choice
- Fortune 500 RFP → hyperscaler + consultants

Next: [10-microservices-docker-cicd.md](./10-microservices-docker-cicd.md) — buzzwords defanged.

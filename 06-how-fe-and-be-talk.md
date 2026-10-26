# 06 — How FE & BE Talk: HTTP, WebSockets, Webhooks

## Three conversation styles

| Style | Who initiates | Analogy |
|-------|---------------|---------|
| **HTTP request/response** | FE (or BE) asks; other answers once | Waiter takes order, brings plate, leaves |
| **WebSocket** | Long open line; both can speak anytime | Phone call left on speaker during the whole dinner |
| **Webhook** | External service calls **your** BE when something happens | Pizza shop calls *you* when the order's at the door |

Most CRUD apps are **90% HTTP**. Realtime collab and live dashboards add **WebSockets**. Integrations love **webhooks**.

---

## HTTP (the default)

Already covered in [02-json-and-apis.md](./02-json-and-apis.md). FE `fetch`es; BE responds with JSON.

**HTTPS** = HTTP + TLS encryption. Non-negotiable in prod. Browser will bully you if you skip it.

**CORS** = browser security rule: "Is `yourapp.com` allowed to call `api.other.com`?" Misconfigured CORS = works in Postman, screams in Chrome. Backend must send allowed origins.

---

## WebSockets (persistent servers' specialty)

Normal HTTP: connect → request → response → disconnect.

**WebSocket:** one TCP connection stays open; server can **push** updates without the client polling every 2 seconds like an anxious friend.

Use cases:

- Live cursors in Figma-like tools
- Chat
- Sports scores, stock tickers
- "Someone else edited this row"

Usually runs on a **persistent** Node/Go server (Socket.io, ws, Phoenix channels). Serverless can do websockets with platform-specific hacks — not the default beginner path.

**FE:** `new WebSocket('wss://api.app.com/live')`  
**BE:** process holds connection map, broadcasts events.

---

## Webhooks: API endpoint vs webhook URL

Easy to mix up:

| | **API endpoint (you call them)** | **Webhook URL (they call you)** |
|---|----------------------------------|----------------------------------|
| Direction | Your BE → Stripe/OpenAI/Slack | Stripe → **your** BE |
| You publish | Client uses *their* docs | **Your** public URL, e.g. `https://api.you.com/webhooks/stripe` |
| Example | "Create checkout session" | "Payment succeeded — here's the payload" |

**Webhook flow:**

1. You register `https://api.yourapp.com/webhooks/stripe` in Stripe dashboard.
2. Customer pays.
3. Stripe **POSTs** JSON to that URL (often with a signature header).
4. Your BE verifies signature, updates DB, maybe sends email.
5. Your FE might still **poll or websocket** for UI update — webhook hit the kitchen, not the dining room directly.

**Why not push to FE?** Security — you don't expose your database keys to the browser. Webhooks land on BE.

---

## Auth in the conversation (preview)

FE usually sends:

- **Cookie** (session) — browser auto-attaches
- **Bearer token** (JWT) — `Authorization: header`

BE validates before running logic. Full OAuth chapter in [11-integrations.md](./11-integrations.md).

---

## End-to-end picture

```
[ Browser FE ]
     │  HTTPS JSON (fetch)
     ▼
[ Your API on Render/Railway/Vercel ]
     │  SQL
     ▼
[ Postgres ]
     ▲
     │  HTTPS webhook POST
[ Stripe / GitHub / etc. ]
```

Optional side channel:

```
[ Browser FE ] ←—— WebSocket ——→ [ Persistent API ]
```

---

## Builder takeaway

- **Building a button that loads data?** HTTP.
- **Live multiplayer vibes?** WebSocket on persistent infra.
- **"When payment clears, update our system"?** Webhook URL on your backend.

Next: [07-storage-s3-and-the-pipeline.md](./07-storage-s3-and-the-pipeline.md) — avatars, PDFs, and the path to the screen.

# 01 — Frontend & Backend: The Split

## The restaurant model (use this forever)

| Role | In a restaurant | In software |
|------|-----------------|-------------|
| **Frontend (FE)** | Dining room, menu design, how the plate looks on the table | Browser or app UI: React, Vue, SwiftUI, your Webflow export |
| **Backend (BE)** | Kitchen, recipes, stock room, POS, "is this table allowed to order?" | Servers, APIs, databases, auth, payments, email |

**Designers live in the dining room.** That's fine. The magic is: guests (users) never walk into the kitchen. They point at the menu (UI), and the waitstaff (HTTP requests) carry orders back and forth.

---

## What the frontend actually does

1. Shows stuff (layout, typography, motion — your comfort zone).
2. Collects input (forms, toggles, drag-drop).
3. **Asks the backend for data** when the page can't guess it ("show me *this* user's orders").
4. **Tells the backend to do things** ("save this design", "charge this card").

The FE does **not** (usually) hold the secret sauce: passwords in plain text, credit card numbers, the canonical list of all users. That lives behind the BE.

---

## What the backend actually does

1. **Authorize:** "Are you logged in? Are you allowed to delete this?"
2. **Validate:** "You said your age is `banana`. Nice try."
3. **Read/write databases** and file storage.
4. **Talk to other services** (Stripe, SendGrid, OpenAI).
5. **Return data** the FE can render — almost always as **JSON** (next chapter).

---

## The basic loop (every app, ever)

```
User taps "Load dashboard"
    → FE sends request to BE ("GET /api/dashboard")
    → BE checks auth, queries DB, maybe hits cache
    → BE responds with JSON
    → FE turns JSON into components on screen
```

No backend? Your app is a beautiful **static brochure** — great for marketing sites, useless for "my account."

---

## Where "full-stack" and "BaaS" fit

- **Full-stack dev:** one human who does dining room *and* kitchen (FE + BE).
- **Backend-as-a-Service (BaaS):** Supabase, Firebase — pre-built kitchen appliances. You still plate the food (UI), but you didn't forge the oven.

---

## Builder takeaway

If something feels "wrong" in the product:

- **Looks wrong, wrong on every browser** → probably FE (CSS, component state).
- **Wrong data, wrong user sees wrong thing, works in Postman but not in app** → BE or how FE calls BE.
- **Slow only sometimes, or only for one user** → DB, caching, or hosting (later chapters).

Next: [02-json-and-apis.md](./02-json-and-apis.md) — how the waitstaff actually carries the order.

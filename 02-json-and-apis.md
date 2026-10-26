# 02 — JSON & APIs: Machine-to-Machine Receipts

## JSON in one breath

**JSON** (JavaScript Object Notation) is a text format for structured data. It looks like JavaScript objects because some dev in the '90s had taste.

```json
{
  "user": "maya",
  "plan": "pro",
  "seats": 3,
  "features": ["export", "comments"]
}
```

**Why everyone uses it:** humans can squint at it in dev tools; every language can parse it. It's the **universal packing slip** between frontend and backend.

Not the same as "a JS object in your React code" — JSON is **always a string on the wire**, then your app parses it into real objects.

---

## API = the menu the kitchen publishes

An **API** (Application Programming Interface) is a set of **endpoints** — URLs + rules for what you can order.

Typical pattern (**REST-ish**, the default vibe):

| You want to… | HTTP method | Example path | Body |
|--------------|-------------|--------------|------|
| Fetch data | `GET` | `/api/projects/42` | (none) |
| Create | `POST` | `/api/projects` | JSON with new project |
| Replace/update | `PUT` / `PATCH` | `/api/projects/42` | JSON with changes |
| Delete | `DELETE` | `/api/projects/42` | (none) |

The FE doesn't "open Postgres." It hits **`https://api.yourapp.com/api/projects/42`** and gets JSON back.

---

## How the FE hits the BE (the dance)

1. User action (open page, click save).
2. FE code runs `fetch()` or your HTTP client (axios, TanStack Query, etc.).
3. Request flies over the internet with:
   - **URL** (which endpoint)
   - **Method** (GET/POST/…)
   - **Headers** (auth token, content type)
   - **Body** (JSON for POST/PATCH)
4. BE route handler runs → DB → builds JSON response.
5. FE parses JSON → updates state → UI re-renders.

**Status codes** (memorize four):

- `200` — here's your data, chef's kiss
- `201` — created something new
- `401` / `403` — who are you / you can't do that
- `500` — kitchen on fire (server bug)

---

## Example: loading a profile

**Request**

```
GET https://api.example.com/v1/me
Authorization: Bearer eyJhbGciOi...
```

**Response**

```json
{
  "id": "usr_9f2",
  "displayName": "Maya Chen",
  "avatarUrl": "https://cdn.example.com/a/9f2.png"
}
```

The FE maps `displayName` to a heading and `avatarUrl` to an `<img>`. The BE never sent HTML — only data. **Separation of concerns:** kitchen doesn't plate the garnish.

---

## GraphQL, tRPC, etc. (don't panic)

Same story, different menu layout:

- **GraphQL:** one endpoint, you ask for exactly the fields you need (fewer round trips, more setup).
- **tRPC:** TypeScript end-to-end types (great for TS shops).

Still JSON (or JSON-like) under the hood for most stacks.

---

## Builder takeaway

When debugging "API issues":

1. Open **Network** tab in browser devtools.
2. Find the failing request — status, response body, request payload.
3. Compare to what the BE team (or Supabase dashboard) says the shape should be.

Broken UI is often **wrong JSON shape** (`user.name` vs `user.displayName`) — not "CSS broken."

Next: [03-relational-databases.md](./03-relational-databases.md) — where orders get filed forever.

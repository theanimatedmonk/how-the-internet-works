# 11 — Integrations: Webhooks, OAuth & MCP

Apps rarely live alone. They shake hands with payment, email, design tools, and now **AI agents**.

---

## Integration patterns (three hits)

| Pattern | Direction | Example |
|---------|-----------|---------|
| **REST API call** | You → them | Your BE creates Stripe Checkout Session |
| **Webhook** | Them → you | Stripe tells your BE payment succeeded ([06](./06-how-fe-and-be-talk.md)) |
| **OAuth** | User delegates access | "Sign in with Google", "Connect Notion" |

---

## OAuth & auth (authentication vs authorization)

People mash these together; recruiters too.

| | **Authentication (AuthN)** | **Authorization (AuthZ)** |
|---|---------------------------|---------------------------|
| Question | **Who are you?** | **What may you do?** |
| Example | Login with email magic link | "Maya can edit project 42, Alex can only view" |

**OAuth 2.0** (usually with OpenID Connect for login):

1. User clicks "Connect Slack"
2. Redirect to Slack consent screen
3. User approves
4. Slack redirects back with a **code**
5. Your **backend** exchanges code for **tokens** (never expose secrets in FE)
6. You store refresh token (encrypted), can call Slack API on user's behalf

**JWT** (JSON Web Token): signed blob your API trusts for "this request is user X" — common in SPAs.

**Session cookie:** classic web apps; server remembers you.

FE designers see: login modal, "connected" badges. BE owns token storage and refresh.

---

## Webhooks (again, integration edition)

Register your **webhook URL** in their dashboard. Events you care about:

- `invoice.paid`
- `repo.push`
- `form.submitted`

**Verify signatures** — otherwise anyone could POST fake "payment succeeded" to your endpoint.

**Idempotency:** same event may arrive twice; handle duplicates gracefully.

---

## MCP (Model Context Protocol)

**2024–2026 builder buzzword.** MCP is a **standard way for AI assistants (Cursor, Claude, etc.) to plug into tools** — read GitHub issues, query your DB (please don't), hit Figma, order lunch via API.

Think: **USB-C for AI ↔ your services**.

- **MCP server** exposes **tools/resources** with schemas
- **MCP client** (the IDE/agent) discovers and calls them

Not replacing your product's public REST API. It's for **dev workflows and agent automation** — "let the AI fetch our component library docs safely."

You'll hear it next to **API keys** and **OAuth** as ways agents get access. Least privilege still applies: don't give the robot production delete rights because it asked nicely.

---

## API keys vs OAuth

| | **API key** | **OAuth** |
|---|-------------|-----------|
| Who | Server-to-server, or single admin | Per-user consent |
| Risk | Leaked key = full access | Scoped, revocable per user |
| Example | SendGrid key in BE env | "Connect your Google Calendar" |

---

## Typical integration architecture

```
[ FE ] ──► [ Your API ] ──► [ Postgres ]
              │
              ├── REST ──► Stripe / OpenAI / Slack
              │
              └──◄── webhook ◄── Stripe
```

Optional: **queue** (Redis, SQS) between webhook handler and slow work — so Stripe gets `200 OK` fast while you process async.

---

## Builder takeaway

- **OAuth** = user said "yes, link my account."
- **Webhook** = vendor pings you when reality changes.
- **MCP** = AI tools wired to your stack with structured permissions.

You're now dangerous enough to read an architecture diagram without pretending the database is "the cloud."

---

## Module complete

Back to [README.md](./README.md) for the index — or ship something and let the Network tab be your teacher.

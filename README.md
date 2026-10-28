# How the Internet Works (for Vibe Coders & Builders)

You already know the frontend — pixels, components, Figma handoff. This module is **everything that happens after the user clicks "Submit"** so you're not nodding along in standup while someone says "we'll webhook that to the worker."

**Tone:** plain English, spicy metaphors, zero urge to become a staff engineer.

**How to read:** in order once, then jump to whatever bit you're building this week.

---

## The map

| # | File | You'll walk away knowing… |
|---|------|---------------------------|
| 1 | [01-frontend-and-backend.md](./01-frontend-and-backend.md) | What FE vs BE actually are, and who talks to whom |
| 2 | [02-json-and-apis.md](./02-json-and-apis.md) | JSON, REST-ish APIs, and the request/response dance |
| 3 | [03-relational-databases.md](./03-relational-databases.md) | Postgres, MySQL, tables, and why Supabase feels like cheating |
| 4 | [04-document-databases-and-scaling.md](./04-document-databases-and-scaling.md) | Mongo-style JSON in the DB, vertical vs horizontal scaling |
| 5 | [05-serverless-vs-persistent-servers.md](./05-serverless-vs-persistent-servers.md) | Vercel/Firebase vs Render/Railway, cold starts, cron & workers |
| 6 | [06-how-fe-and-be-talk.md](./06-how-fe-and-be-talk.md) | HTTP, WebSockets, webhooks, API URL vs webhook URL |
| 7 | [07-storage-s3-and-the-pipeline.md](./07-storage-s3-and-the-pipeline.md) | Buckets → DB → API → your UI |
| 8 | [08-caching-redis-redux.md](./08-caching-redis-redux.md) | Why things feel fast: Redis, CDN, Redux (different beasts) |
| 9 | [09-pick-your-stack-players.md](./09-pick-your-stack-players.md) | AWS at scale vs indie-friendly hosts — when to pick what |
| 10 | [10-microservices-docker-cicd.md](./10-microservices-docker-cicd.md) | Microservices without the LinkedIn post, Docker, CI/CD basics |
| 11 | [11-integrations.md](./11-integrations.md) | Webhooks, OAuth, MCP — how apps shake hands |

---

## One-sentence cheat sheet

- **Frontend:** the menu and the dining room. **Backend:** the kitchen, inventory, and the credit card machine.
- **JSON:** the receipt format both machines agree on.
- **SQL DB:** Excel on steroids with relationships. **Document DB:** nested JSON folders.
- **Serverless:** caterers per order. **Persistent server:** salaried chef in your kitchen.
- **Webhook:** "don't call us, we'll call you when the pizza's ready."

Built for designers who ship — so the architecture diagram finally makes emotional sense.

---

**Read online:** [theanimatedmonk.github.io/how-the-internet-works](https://theanimatedmonk.github.io/how-the-internet-works/) (GitHub Pages)

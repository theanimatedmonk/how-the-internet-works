# 04 — Document DBs, JSON in Storage & Scaling (Vertical vs Horizontal)

## Non-relational / document databases

**MongoDB** is the name you hear at parties. It's a **document database**: each record is a **JSON-like document** (BSON internally — don't care yet).

```json
{
  "_id": "user_9f2",
  "email": "maya@co.com",
  "preferences": {
    "theme": "dark",
    "notifications": { "email": true, "push": false }
  },
  "recentProjects": ["p1", "p2", "p3"]
}
```

No rigid table for `preferences.push` — nested objects live in one blob. **Flexible schema:** great for prototypes and content that looks like "a pile of JSON."

| Relational (Postgres) | Document (MongoDB) |
|----------------------|-------------------|
| Normalized tables, joins | Nested documents, fewer joins |
| Schema enforced | Schema flexible (until it isn't) |
| Strong for transactions & reporting | Strong for flexible, hierarchical data |

**Firebase Firestore** is document-flavored too — JSON trees in Google's cloud, tuned for mobile/realtime vibes.

Neither is "better." **Wrong tool, wrong pain.** Startups often still pick Postgres because one source of truth is easier to reason about until you hit specific scale/shape problems.

---

## Vertical scaling: buy a bigger stove

**Vertical scaling** = same one machine (or one database server), **more CPU, RAM, disk**.

Metaphor: your kitchen has **one chef**. They're overwhelmed. You swap them for **Gordon Ramsay on espresso** — same kitchen, bigger talent and equipment.

- **Pros:** simple ops, no distributed systems homework
- **Cons:** there's a ceiling (biggest instance AWS sells), downtime risk if that box dies

Most indie apps live here for years. That's fine.

---

## Horizontal scaling: open more kitchens

**Horizontal scaling** = **more machines** doing the same job, split the load.

Metaphor: one chef can't handle 500 covers. You hire **ten chefs** in **ten identical kitchens** and a **host** who routes diners ("table 7 goes to kitchen 3").

- **Pros:** theoretically unlimited growth, fault tolerance
- **Cons:** hard mode — data consistency, sessions, "which server has my cart?"

**Load balancers** sit in front: traffic sprinkler.

**Stateless app servers** (no sticky memory on one box) + **shared database/cache** = classic horizontal pattern.

Document DBs and some NoSQL systems were **marketed** as "easier to shard horizontally." Reality: horizontal scaling is always a **design choice**, not a free lunch with Mongo.

---

## Read replicas & caching (teaser)

- **Primary DB** takes writes; **replicas** serve reads (scale read traffic).
- **Redis** holds hot data so you don't hammer the DB (full chapter later).

---

## Builder takeaway

| Term | Plain English |
|------|----------------|
| Vertical | Bigger box |
| Horizontal | More boxes |
| Document DB | JSON documents as rows |
| Sharding | Splitting data across boxes (advanced homework) |

If a founder says "we'll scale later," they usually mean **vertical first**, then **horizontal + pain** when revenue justifies it.

Next: [05-serverless-vs-persistent-servers.md](./05-serverless-vs-persistent-servers.md) — caterers vs salaried chefs.

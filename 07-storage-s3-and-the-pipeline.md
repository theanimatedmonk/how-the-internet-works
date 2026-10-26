# 07 — File Storage: S3, Supabase Storage & the Path to the FE

## Files aren't in the database (usually)

Storing 5MB PDFs inside Postgres rows is like laminating entire cookbooks into your order tickets — technically possible, spiritually wrong.

**Pattern:**

- **Database** holds **metadata** (filename, size, owner_id, `storage_key`, public URL)
- **Object storage** holds the **bytes** (image, video, export.zip)

---

## S3-shaped thinking (AWS set the vocabulary)

**Amazon S3** = buckets of objects identified by keys:

```
s3://my-app-uploads/users/9f2/avatar.png
```

**Bucket** = top-level folder with permissions.  
**Object** = the file.  
**Key** = path inside bucket.

Almost every cloud has an S3-compatible API:

| Provider | Name |
|----------|------|
| AWS | S3 |
| Cloudflare | R2 |
| Supabase | Storage (S3-like) |
| Google | Cloud Storage |
| DigitalOcean | Spaces |

---

## How upload usually works (secure-ish)

**Bad vintage pattern:** FE uploads with god-mode keys embedded. Don't.

**Common modern flow:**

1. FE asks BE: "I want to upload `avatar.png`"
2. BE checks auth, creates DB row `pending`, returns **presigned URL** (temporary permission to PUT one file)
3. FE uploads **directly to storage** via presigned URL (fast, doesn't hog your API server)
4. FE tells BE "done" OR storage fires **webhook/event** → BE marks row `ready`
5. DB now has `avatar_url` → next `GET /me` includes CDN URL → FE shows image

```
FE ──POST /uploads/sign──► BE ──writes meta──► DB
FE ──PUT file────────────► S3 / Supabase Storage
FE ──PATCH /uploads/complete──► BE (or event) ──► DB
FE ──GET /me──► BE ──► JSON with avatarUrl ──► <img src="...">
```

**Supabase** shortcuts some steps with client SDK + Row Level Security — still the same physics.

---

## CDN: make it fast globally

Raw S3 URL in Ohio is slow for Mumbai. **CDN** (CloudFront, Cloudflare, Vercel Blob CDN) caches copies at the edge.

FE should use **CDN URLs** in JSON, not fragile internal keys.

---

## Public vs private files

- **Public bucket/path:** anyone with URL can view (fine for marketing assets).
- **Private:** FE gets **signed short-lived URL** from BE after auth check.

Your designer brain: **public = Dribbble shot**, **private = client's unreleased campaign**.

---

## Builder takeaway

- **DB** = card catalog. **S3/Storage** = warehouse pallets.
- Pipeline is always **metadata in SQL, bytes in object store, URL in API JSON**.
- Integrations (image optimizers, virus scan) often hook on **upload events** — same webhook energy.

Next: [08-caching-redis-redux.md](./08-caching-redis-redux.md) — three different "caches" people confuse.

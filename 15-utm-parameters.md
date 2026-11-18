# 15 — UTM Parameters: Who Sent This Click?

You shipped a landing page. Traffic goes up. Marketing asks: **“Was that the newsletter, LinkedIn ad, or your cousin’s tweet?”**

Without tags on links, analytics shrugs: **“Someone came from the internet.”**  
**UTM parameters** are sticky notes on the URL so GA4, Plausible, PostHog, Ortto, etc. can answer **which campaign, channel, and creative** actually drove the visit.

*Deep dive reference:* [What are UTM parameters?](https://ortto.com/learn/what-are-utm-parameters/) (Ortto) — naming conventions and channel examples.

---

## What UTM means (thirty seconds)

**UTM** = **Urchin Tracking Module**. Google bought Urchin in 2005 and turned it into **Google Analytics**. The tag format stuck everywhere.

They’re **query string** crumbs on the URL — same family as `?page=2` from [chapter 02](./02-json-and-apis.md):

```text
https://yourapp.com/signup?utm_source=linkedin&utm_medium=paid-social&utm_campaign=q2-launch
```

Everything after `?` is key=value pairs joined by `&`. The user’s browser loads your site; your **analytics script** reads those keys and files the session under that story.

Metaphor: **UTMs are return-address labels on the envelope.** The letter (your site) is the same; the label tells the post office (analytics) which campaign mailed it.

---

## The five standard parameters

| Parameter | Required? | Answers | Example value |
|-----------|-----------|---------|---------------|
| **`utm_source`** | Yes (in practice) | **Where** did the click originate? | `google`, `linkedin`, `newsletter` |
| **`utm_medium`** | Recommended | **What kind** of marketing? | `cpc`, `email`, `paid-social`, `organic` |
| **`utm_campaign`** | Recommended | **Which campaign** name? | `q2-demo-push`, `black-friday-2026` |
| **`utm_content`** | Optional | **Which link/creative** inside the campaign? | `hero-cta`, `headline-a` |
| **`utm_term`** | Optional (PPC) | **Which keyword** paid search? | `marketing-automation` |

**Source vs medium** — don’t repeat yourself:

- `utm_source=linkedin` → the platform
- `utm_medium=paid-social` → how you bought reach there  
- Not `utm_medium=linkedin-paid` (redundant mush)

A good UTM string reads like a sentence: *LinkedIn · paid social · Q2 launch · video testimonial CTA.*

---

## One URL, full story (read it like a detective)

```text
https://yourapp.com/demo/?utm_source=google&utm_medium=cpc&utm_campaign=q2-brand&utm_content=headline-a&utm_term=marketing-automation
```

| Tag | Translation |
|-----|-------------|
| `source=google` | Click came from Google |
| `medium=cpc` | Paid search (cost-per-click) |
| `campaign=q2-brand` | Q2 brand push |
| `content=headline-a` | A/B test — headline A won the click |
| `term=marketing-automation` | They searched that phrase |

Now you can compare **headline A vs B**, **paid search vs paid social**, and attribute signups to **Q2 brand** — not a vague “Google” bucket.

---

## Where builders & marketers actually tag links

Tag **outbound** links you control — anything that isn’t “random Google search”:

| Channel | Minimum tags | `content` for |
|---------|--------------|----------------|
| **Email** | `source=email`, `medium=newsletter` or `lifecycle`, `campaign=…` | Two CTAs in one email (button vs footer) |
| **Paid social** | `source=facebook` / `linkedin`, `medium=paid-social` | Creative or audience variant |
| **Google Ads** | `source=google`, `medium=cpc`, `campaign=…`, often `term=…` | Keyword-level reporting |
| **Partners / guest posts** | `source=techcrunch`, `medium=content-syndication` | Partnership ROI |
| **Influencer** | `source=influencer-jane-smith`, `medium=social` | Who actually drove traffic |

**Your job as a builder:** landing page URL is fine bare; **marketing** appends UTMs on links in emails, ads, and bios. You don’t “implement UTM” in the React app — you **don’t strip them** and you use **canonical URLs** for SEO (below).

Many email tools **auto-append** UTMs on every link — check settings so defaults match the team’s naming doc.

---

## Best practices (witty warnings included)

### 1. Lowercase only

`utm_source=LinkedIn` and `utm_source=linkedin` are **two different sources** in GA4. Pick lowercase and bully the team gently.

### 2. Dashes, not spaces or chaos

```text
✅ utm_campaign=q2-product-launch
❌ utm_campaign=q2 product launch   → %20 soup in the URL
❌ utm_campaign=1A-Q2                 → cryptic in 6 months
```

### 3. Never tag **internal** links

This is the **nuclear mistake**:

```html
<!-- ❌ Nav link on your own site -->
<a href="/pricing?utm_source=footer">Pricing</a>
```

Visitor arrived from a newsletter → clicks that link → analytics thinks they came from **`utm_source=footer`** and **forgets the newsletter**.  
UTMs belong on **emails, ads, tweets, partner sites** — not your header nav.

Metaphor: you wouldn’t peel off the guest’s **original party wristband** and replace it with “clicked menu item #3” mid-meal.

### 4. Document conventions in one shared place

One person writes `fb`, another `facebook`, another `meta` — Facebook performance splits into three fantasy countries. Use a **UTM spreadsheet** or team doc ([Ortto’s template](https://ortto.com/learn/what-are-utm-parameters/) is one example; [Google’s Campaign URL Builder](https://ga-dev-tools.web.app/campaign-url-builder/) works too).

### 5. Click before launch

Open the tagged URL → confirm params in the address bar → confirm one test visit in analytics with the expected source/medium/campaign.

---

## SEO: do UTMs hurt rankings?

UTMs don’t **directly** change rank. They can create **duplicate URLs** in indexes (`/pricing` vs `/pricing?utm_...`). Fix: **canonical** tag points to the clean URL without query junk. Most CMS/Next.js setups handle this; ask once if you care about SEO.

---

## How this fits the stack (builder view)

```
Email / ad / post  →  link WITH utm_*  →  your FE loads (same page)
                              ↓
                    GA4 / PostHog / etc. records session
                              ↓
                    Reports: "signups from utm_campaign=q2-launch"
```

No backend required for basic UTMs — **client-side analytics** reads `window.location.search`. Product analytics can also persist UTMs on **signup** (first-touch attribution in your DB) if growth asks for it.

---

## Builder takeaway

- **UTM** = campaign labels on the URL query string (`utm_source`, `utm_medium`, …).
- Tag **inbound marketing links**, never **internal** navigation.
- **Lowercase + dashes + shared naming doc** = trustworthy reports.
- Your page still works with or without them; analytics is what gets smart.

Next: [16-mixpanel-and-product-analytics.md](./16-mixpanel-and-product-analytics.md) — what they did after the UTM brought them in.

Also: [query strings & APIs](./02-json-and-apis.md), [integrations](./11-integrations.md).
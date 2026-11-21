# AI 05 — Diffusion Models vs “Everything Is Code Now”

Two different magic tricks got famous at once. Teams are **reallocating GPUs** from one to the other.

---

## What diffusion models do

**Diffusion** (image / video) = start from **noise**, repeatedly **denoise** until a picture or clip emerges.

```text
Random static  →  step step step  →  “a corgi in a spacesuit”
```

Famous families: Stable Diffusion, Midjourney, DALL·E, Sora-class video, etc.

**LLMs** predict **next text token**. **Diffusion** predicts **how to remove a little noise** in pixel/latent space. Different math, same bill from NVIDIA.

Metaphor: **LLM** writes the screenplay. **Diffusion** is the **art department** painting each frame from fog.

---

## Why hype moved (2024–2026 vibe)

| Diffusion-heavy bets | Code / agent bets |
|----------------------|-------------------|
| Stock media, ads, UGC filters | **Ship product**, refactor repos, run businesses |
| Pretty assets | **Automation** with measurable ROI |
| Custom model per brand look | One **frontier model + harness** edits real files |

**Product boards asked:** “Does this **reduce headcount or increase revenue** this quarter?”  
Image gen often answers **maybe, someday**. Agents that **merge PRs, answer support, write SQL** answer **Tuesday**.

Hence stories like **xAI winding down heavy investment in Grok Imagine**-style diffusion teams: not because diffusion “died,” but because **marginal dollar** went to **text+code intelligence** and **chat/agent surfaces** (Grok as assistant) where competition is existential.

Metaphor: the studio **fired the poster artist division** to hire **more editors** — not because art is worthless, because the **release is a codebase**, not a gallery wall.

---

## “Everything is basically code now”

A lot of valuable work is already **text**:

- Law, finance, ops → documents and spreadsheets  
- Software → **literal code**  
- Support → tickets and macros  
- Marketing → copy, specs, landing page **source**

Frontier **code + reasoning models** (Anthropic **Opus**-class, OpenAI flagship tiers, etc.) plus **harnesses** (**Claude Code**, Cursor, Codex-style loops) turned that into:

```text
Intent in English  →  diff in git  →  deploy
```

**Why diffusion feels second-tier for some labs:**

- **UI for intelligence** became terminals and IDEs, not only image feeds  
- **Tool use + long context** eats GPU-hours that might have gone to video diffusion training  
- **Closed-loop value** is easier to measure when output is **tests passing**, not **pretty PNG**

That doesn’t mean **no one** should build image products — it means **frontier labs** chase **general reasoning + agents** first.

---

## When diffusion still wins

- **Creative tools** (designers, film previz, game assets)  
- **Synthetic data** for training other models  
- **Short-form marketing** at scale  

When your user is a **builder**, default mental model: **LLM + harness** for the product; **diffusion** for **brand and illustration** — often via API, not a team training Lora nightly.

---

## Builder takeaway

- **Diffusion** = denoise path to pixels/video. **LLM** = next token path to text/code.  
- Budget and talent are **rotating toward agents** because work is **code-shaped**.  
- **Opus-class model + Claude Code-class harness** is the “good enough to scare your PM” combo — diffusion is not the same lever for that.

Next: [06-stt-tts-and-sarvam-voice.md](./06-stt-tts-and-sarvam-voice.md) — ears and mouth of the agent.
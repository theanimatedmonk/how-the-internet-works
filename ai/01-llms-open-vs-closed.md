# AI 01 — LLMs: Open Weights vs Closed Frontier

**LLM** = **Large Language Model**. Fancy autocomplete that predicts **the next token** (word-piece) over and over until it sounds like an answer.

Metaphor: a **parrot with a PhD in pattern matching** — it’s not “thinking”; it’s **guessing the statistically likely next syllable** given everything before it.

---

## Next-token prediction (the whole magic trick)

You type: `The capital of France is`

The model scores millions of continuations and picks high-probability ones → ` Paris` → then maybe `.` → maybe stop.

Every reply you get is **thousands of tiny guesses** chained together. No little homunculus inside. (Still useful. Still weird.)

---

## Scale: parameters vs training data (don’t conflate)

People mix these up at parties:

| What | Rough meaning | Vibe |
|------|----------------|------|
| **Parameters** (7B, 70B, 405B…) | Knobs inside the neural net — **model size** | “How fat is the brain?” |
| **Training tokens** (trillions of text pieces) | How much reading it did during training | “How much of the internet did it skim?” |

Bigger **parameters** ≠ automatically smarter; **data quality, training recipe, and post-training** (RLHF, etc.) matter. A 7B model on your laptop can be brilliant at narrow tasks; a frontier model is the **generalist** you pay per token for.

---

## Two families: open weights vs closed weights

### Open weights (weights published)

The **model files** (or most of them) are released so you can:

- **Download** and run **locally** if your GPU/RAM can handle it
- **Fine-tune** on your data
- Host on **rented GPU cloud** (RunPod, Lambda, neoclouds, etc.)

**Examples you’ll hear in 2025–2026:**

| Origin | Names (examples) |
|--------|------------------|
| Meta | **Llama** family |
| Google | **Gemma** |
| DeepSeek | **DeepSeek** (R1/V3 vibes) |
| Z.ai (China) | **GLM**, **Kimi** |
| OpenAI (select releases) | Open-weight / open-model drops (when they ship them) |
| Others | Mistral, Qwen, Falcon, etc. |

**Tradeoff:** you own ops (VRAM, latency, safety tuning). **Win:** data residency, cost at scale, hackability.

### Closed weights (frontier, API-only)

Weights stay **private**. You get **HTTPS API** access — no download, no “run Llama but it’s GPT.”

**Frontier tier (names churn every quarter):**

| Lab | You’ll hear… |
|-----|----------------|
| **OpenAI** | GPT family (frontier chat/code models — marketing names rotate) |
| **Anthropic** | Claude **Opus**, **Sonnet**, **Haiku** tiers |
| **Google** | Gemini Ultra/Pro |
| **Others** | xAI Grok, etc. |

**Tradeoff:** best general intelligence and tool ecosystems **if** you trust the vendor and the wire. **Win:** zero GPU babysitting.

Metaphor: **open weights = buying the espresso machine**. **Closed = Starbucks delivery** — great until you want your own beans in another country.

---

## What you actually do as a builder

```text
Prototype in Cursor / Claude Code  →  closed API (fast)
Ship feature with strict data rules  →  open model on VPC or regional host
Cost panic at 10M tokens/day  →  renegotiate or mix small open model for drudge work
```

Closed for **capability**; open for **control and economics** when you have someone who can hold a GPU diagram without crying.

---

## Honest limits (surface level)

- **Knowledge cutoff** — training ended; it doesn’t know yesterday’s headline unless tools/RAG add it ([AI 03](./03-rag-and-agent-loops.md)).
- **Hallucination** — confident wrong answers; not a bug you “fix once,” a property you **design around**.
- **Context window** — only so much text fits in one request; harnesses trim, summarize, or retrieve ([AI 02](./02-agents-harnesses-inference.md)).

---

## Builder takeaway

- **LLM** = next-token engine, not a oracle.
- **Open weights** = downloadable, tunable, you run the hotel.
- **Closed frontier** = best-effort peak IQ via API, they run the hotel.

Next: [02-agents-harnesses-inference.md](./02-agents-harnesses-inference.md) — why “agent” is two jobs wearing a trench coat.
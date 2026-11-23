# AI 01 — LLMs: Open Weights vs Closed Frontier

**LLM** = **Large Language Model**. Fancy autocomplete that predicts **the next token** (word-piece) over and over until it sounds like an answer.

Metaphor: a **parrot with a PhD in pattern matching** — it’s not “thinking”; it’s **guessing the statistically likely next syllable** given everything before it.

---

## Next-token prediction (the whole magic trick)

You type: `The capital of France is`

The model scores millions of continuations and picks high-probability ones → ` Paris` → then maybe `.` → maybe stop.

Every reply you get is **thousands of tiny guesses** chained together. No little homunculus inside. (Still useful. Still weird.)

---

## Weights & parameters: what’s actually inside the box

Short version: **a model is a giant file of numbers.** Those numbers are the **parameters**. People say **weights** to mean the same thing (or the file that holds them). Everything the model “knows” is smeared across those numbers. No database of facts, no lookup table of answers, just billions of decimals like `0.0132`, `-1.207`, `0.4419`…

### Start tiny: a 3-parameter model

Forget LLMs for a second. Say you want to predict house prices:

```text
price = w1 × sqft  +  w2 × bedrooms  +  b
```

- `w1`, `w2` are **weights**: how much each input matters.
- `b` is a **bias**: a baseline nudge.
- All three together = the model’s **parameters**. This model has **3**.

**Training** = start with random numbers, guess prices for houses you already know, measure how wrong you were, nudge `w1`, `w2`, `b` slightly in the “less wrong” direction. Repeat a million times. Now the numbers are *good*.

An LLM is **the same idea**, with **billions** of knobs arranged in many layers instead of three knobs in one line. That’s it. That’s the scary-sounding part.

Metaphor: parameters = **the settings on a mixing desk with 70 billion sliders.** Nobody set them by hand. Training slid each one, a hair at a time, until the music came out right.

### Where the parameters live (the pipeline)

What happens when you send `The capital of France is`:

```text
"The capital of France is"
   │
   ▼  1. Tokenizer: text → token IDs           [The][ capital][ of][ France][ is] → [791, 6864, 315, 9822, 374]
   ▼  2. Embedding table: each ID → a vector   (a row of ~4,000+ numbers per token)   ← parameters
   ▼  3. Transformer layers × N (32, 80, 120…)
   │      ├─ Attention: each token looks at the others (“which noun does ‘it’ mean?”) ← parameters
   │      └─ Feed-forward (MLP): transforms each token’s vector                     ← parameters (the bulk)
   ▼  4. Output layer: final vector → a score for EVERY token in the vocabulary (“logits”)
   ▼  5. Softmax: scores → probabilities         " Paris" 92% · " a" 2% · " the" 1.5% …
   ▼  6. Sample one token → append it → go back to step 2 with the longer text
```

Where the knobs sit, roughly:

| Part | What it does | Share of parameters |
|------|--------------|---------------------|
| **Embedding table** | Turns each token ID into a meaning-vector. Size = vocab (~100k–200k tokens) × vector width | Small-ish. Llama 3 8B: ~0.5B of its 8B |
| **Attention weights** | Decide which earlier tokens matter for this one | ~⅓ of each layer |
| **Feed-forward (MLP) weights** | The heavy lifting; much of the “knowledge” seems to live here | ~⅔ of each layer |
| **Output layer** | Vector → score per vocab token | Similar to embeddings (often shared) |

The **tokenizer** itself isn’t parameters. It’s a fixed dictionary (`tokenizer.json`) that ships alongside the weights. It’s why models are billed **per token**, not per word: roughly ¾ of an English word per token. Hindi and code often take more tokens per word.

### How the numbers got good (training in 3 lines)

1. **Pretraining:** show the model trillions of tokens of text (Llama 3: ~15 trillion). At each position, ask “what’s the next token?”, measure how surprised it was by the real one (the **loss**), and use **backpropagation** to work out which way to nudge every one of the billions of knobs. Months of thousands of GPUs ([AI 04](./04-gpus-datacenters-chips.md)).
2. **Post-training:** fine-tune on curated examples (instruction following, chat format), then **RLHF / RL** where humans or graders reward good answers. This turns a “document autocompleter” into an **assistant**.
3. **Freeze.** Ship the numbers.

### The big builder insight: weights are frozen at inference

When you chat with a model, **the weights don’t change.** It is not learning from you. Tomorrow it won’t remember today unless *your code* sends today back in.

| Kind of memory | Where it lives | Changes when? | Builder lever |
|----------------|----------------|---------------|---------------|
| **Long-term** (“knows Paris is in France”) | Weights | Only when someone retrains / fine-tunes | Pick a model; [fine-tune](./07-fine-tuning-evals-safety.md) |
| **Short-term** (“you said your name is Sajal”) | Context window (the request) | Every request | Prompt, chat history |
| **Looked-up** (“your website’s About page”) | Your DB, pasted into the context | Whenever your data changes | [RAG](./03-rag-and-agent-loops.md), tools |

This one table explains why **RAG exists**: you can’t cheaply put your website *into the weights*, so you put it *into the context* at request time.

### Size math: why “7B” decides what hardware you need

Each parameter is stored as a number taking some bytes. Multiply:

```text
memory ≈ parameters × bytes per parameter     (+ ~20% for the KV cache & overhead while running)
```

| Precision | Bytes/param | 8B model | 70B model | 405B model |
|-----------|-------------|----------|-----------|------------|
| FP32 (training-grade) | 4 | 32 GB | 280 GB | 1.6 TB |
| FP16 / BF16 (standard serving) | 2 | 16 GB | 140 GB | 810 GB |
| 8-bit quantized | 1 | 8 GB | 70 GB | 405 GB |
| 4-bit quantized | 0.5 | ~4–5 GB | ~35–40 GB | ~200+ GB |

Rule of thumb: **billions of params × 2 = GB at FP16.**

**Quantization** = rounding every knob to fewer bits (like saving a photo as a smaller JPEG). You lose a little quality and gain a lot of fit. It’s why an 8B model runs on a MacBook and a 70B one needs a beefy GPU or two.

### Total vs active parameters (Mixture of Experts)

Some models don’t use every knob for every token. A **Mixture of Experts (MoE)** model has many “expert” feed-forward blocks and a router that sends each token to only a few of them.

| Model | Total params | Active per token |
|-------|--------------|------------------|
| Mixtral 8×7B | ~47B | ~13B |
| DeepSeek V3 | 671B | ~37B |

- **Total** decides **memory**: you still have to load all the experts.
- **Active** decides **speed and cost per token**: only a slice does the math.

So a “671B” MoE can be cheaper to run per token than a dense 70B. Read the fine print.

### Words that sound the same but aren’t

| Term | What it is | Who sets it |
|------|------------|-------------|
| **Parameters / weights** | The learned numbers inside the model | Training |
| **Hyperparameters** | Recipe choices: number of layers, learning rate, batch size | Researchers, before training |
| **API “parameters”** (`max_tokens`, `temperature`, `top_p`) | Request settings for *this* call. Not part of the model at all | You, per request |
| **Training tokens** | How much text it read during training | Data team |
| **Context window** | How many tokens fit in *one request* (input + output) | Fixed by the model design |

`temperature` and friends only change **step 6** (how you pick from the probabilities), not the weights. Some newer APIs have dropped these knobs entirely and give you an “effort” setting instead.

### Bigger isn’t automatically smarter

Parameters are **capacity**, not **IQ**. What matters too: **data quality, the training recipe, and post-training.** A well-trained 8B model can beat a sloppy 70B one at narrow tasks. Closed labs don’t even publish their parameter counts, and as a builder you mostly shouldn’t care. You care about **evals on your task, latency, and price per token.**

### What’s actually in an “open weights” download

```text
model.safetensors (or several shards)   ← the parameters. Gigabytes of floats.
config.json                             ← architecture: layers, widths, vocab size
tokenizer.json                          ← text ↔ token ID dictionary
generation_config.json                  ← default sampling settings
```

(`.gguf` = the same thing packed and usually quantized for laptop runners like llama.cpp / Ollama.)

**Open weights ≠ open source.** You get the trained numbers, but usually **not** the training data or the full training code, and the license may restrict commercial use. It’s a compiled binary, not the source repo.

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

- **LLM** = next-token engine, not an oracle.
- **Parameters / weights** = billions of learned numbers. Frozen after training; your chat doesn’t change them.
- **Memory to run** ≈ params × bytes per param. Quantize to fit; MoE = big on disk, cheap per token.
- New knowledge goes in the **context** (RAG/tools), not the weights, unless you fine-tune.
- **Open weights** = downloadable, tunable, you run the hotel.
- **Closed frontier** = best-effort peak IQ via API, they run the hotel.

Next: [02-agents-harnesses-inference.md](./02-agents-harnesses-inference.md) — why “agent” is two jobs wearing a trench coat.
# AI (Surface Level — for Vibe Coders & Builders)

This section is **separate** from the [main internet stack](../README.md) (chapters 01–16). Same vibe: plain English, witty metaphors, **no PhD required** — depth can grow later.

**You’re here when:** someone says “agent harness,” “open weights,” or “why did my RAG answer hallucinate the refund policy from 2019.”

---

## The map

| # | File | You'll walk away knowing… |
|---|------|---------------------------|
| 1 | [01-llms-open-vs-closed.md](./01-llms-open-vs-closed.md) | What an LLM is, open vs closed weights, who makes what |
| 2 | [02-agents-harnesses-inference.md](./02-agents-harnesses-inference.md) | Agent = LLM + harness, request path to GPUs, inference hosts |
| 3 | [03-rag-and-agent-loops.md](./03-rag-and-agent-loops.md) | RAG, chunking tricks, why fat frameworks lost the hype |
| 4 | [04-gpus-datacenters-chips.md](./04-gpus-datacenters-chips.md) | Racks, neoclouds vs hyperscalers, cooling, critical infra |
| 5 | [05-diffusion-vs-code-world.md](./05-diffusion-vs-code-world.md) | Diffusion vs agents, why labs pivot toward code harnesses |
| 6 | [06-stt-tts-and-sarvam-voice.md](./06-stt-tts-and-sarvam-voice.md) | Speech in/out, Indic voice, Sarvam’s speech lane |
| 7 | [07-fine-tuning-evals-safety.md](./07-fine-tuning-evals-safety.md) | Fine-tune, evals, safety — flagposts for depth |
| 8 | [08-india-inference-token-factory.md](./08-india-inference-token-factory.md) | Token Factory, Sarvam, India agent stack |
| 9 | [09-examples-inference-evals-harness.md](./09-examples-inference-evals-harness.md) | Inference, evals, guardrails, rules, hooks, skills — examples |

---

## Depth later (planned expansions)

| Topic | Status |
|-------|--------|
| Fine-tuning (LoRA, data prep, forgetting) | Starter in [07](./07-fine-tuning-evals-safety.md) |
| Evals & red teaming | Starter in [07](./07-fine-tuning-evals-safety.md) |
| Safety & enterprise guardrails | Starter in [07](./07-fine-tuning-evals-safety.md) |
| India-specific compliance & pricing | Starter in [08](./08-india-inference-token-factory.md) |
| Token Factory / Sarvam ops detail | [08](./08-india-inference-token-factory.md) |

---

## One-sentence cheat sheet

- **LLM:** autocomplete that read the whole library and never sleeps.
- **Open weights:** you can download the brain; closed weights: API only.
- **Agent:** LLM + harness (tools, MCP, skills, guardrails).
- **Inference host:** GPU hotel billing per token.
- **RAG:** look up chunks, then write the answer with citations-ish.
- **Diffusion:** denoise to pixels; agents ate the GPU lunch.
- **STT/TTS:** ears and mouth; Sarvam focuses on Indic speech.
- **India stack:** local harness + Token Factory + Sarvam-class models.

[← Back to main module](../README.md)
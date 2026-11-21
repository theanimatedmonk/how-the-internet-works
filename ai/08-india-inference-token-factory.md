# AI 08 — India Stack: Inference Hosts, Token Factory & Sarvam

**Regional AI** isn’t nationalism cosplay — it’s **latency, compliance, cost, and languages that actually get spoken**.

This chapter ties together [AI 02](./02-agents-harnesses-inference.md)’s three-layer agent with an **India-shaped** example.

---

## The stack (recap with local names)

```text
Harness (local) + Inference host (GPU cloud in India) + LLM (weights on those GPUs) = Agent
```

| Layer | India-flavored example |
|-------|-------------------------|
| **Harness** | Hermes-style / Claude Code / your FastAPI agent on a Mumbai VPS |
| **Inference host** | **[Sarvam Token Factory](https://www.sarvam.ai/)**-class GPU farm — API that feels like OpenAI, silicon **in region** |
| **LLM** | **Sarvam** family (e.g. large Indic-optimized models), **GLM** / other weights the host serves |

**Token Factory in one sentence:** mostly **GPU farm + serving software** — you buy **tokens**, not racks. Under the hood: **data center power, cooling, NVIDIA cards**, autoscaling inference — same physics as [AI 04](./04-gpus-datacenters-chips.md), different **invoice and pin code**.

---

## Why not always send prompts to the US?

| Concern | India / regional hosting helps |
|---------|--------------------------------|
| **Latency** | Round trips to US-East hurt real-time voice and agents |
| **Data residency** | Contracts want data **processed in India** |
| **Cost** | FX + egress + peak pricing — regional competition matters |
| **Languages** | Models trained/evaluated for **Indic** text and speech ([AI 06](./06-stt-tts-and-sarvam-voice.md)) |

Your **harness** can stay on a laptop in Bangalore; only the **heavy matmul** needs to be nearby.

---

## Sarvam’s piece of the puzzle

**Sarvam AI** plays on **both** sides of the API:

1. **Models** — LLMs and **speech** aimed at Indian languages and use cases.  
2. **Inference** — **Token Factory** rents GPU inference so startups don’t build their own halls.

**Builder flow:**

```text
You → HTTPS → Token Factory endpoint (Mumbai / Chennai region vibes)
         → weights loaded on local GPUs
         → tokens back to harness
```

Swap **closed US API** for **regional open or Sarvam weights** without rewriting the whole agent — if the harness speaks **OpenAI-compatible** JSON, it’s often a **base URL + API key** change ([chapter 13](../13-environments-secrets.md)).

---

## India-specific stack checklist

| Piece | Question to ask |
|-------|-----------------|
| **Harness** | Where do skills/MCP run? (your VPC vs vendor) |
| **Inference** | Token Factory vs hyperscaler India region vs self-hosted neocloud |
| **Model** | Sarvam vs open Llama/GLM fine-tuned for Indic |
| **Voice** | Sarvam STT/TTS vs generic US voice API |
| **Data** | RAG corpus residency — where do embeddings live? |
| **Evals** | Test sets in **Hinglish**, not only US English ([AI 07](./07-fine-tuning-evals-safety.md)) |

---

## Ecosystem context (not exhaustive)

| Player type | Role |
|-------------|------|
| **Sarvam** | Indic models + voice + Token Factory inference |
| **Hyperscaler India regions** | AWS Mumbai, Azure/GCP India — Bedrock/Vertex if policy allows |
| **Neoclouds** | Global GPU rental — sometimes used **inside** India via partners |
| **Enterprises** | Banks, gov — procurement loves **on-shore processing** narrative |

Depth later: pricing math, MeitY / DPDP compliance pointers, multi-cloud failover — **legal team required**, not blog bullets.

---

## Honest limits

- **“India GPU”** doesn’t automatically mean **best model** — check **evals on your task**.  
- **Frontier coding** may still be **US model + local harness** for a while — hybrid is normal.  
- **Token Factory** availability and model list **change** — read current docs, not this markdown gospel.

---

## Builder takeaway

- **Token Factory** ≈ regional **inference host** — GPU hotel that bills per token.  
- **Sarvam** ≈ **models + voice + that hotel** in one national story.  
- **Harness local, inference local, evals local-language** = credible India agent stack.

Back to [AI index](./README.md).
# AI 07 — Fine-Tuning, Evals & Safety (Surface)

You picked a model and a harness. Now the grown-up words: **fine-tuning**, **evals**, **safety**. Short chapter — flagposts for depth later.

---

## Fine-tuning: teach the generalist your dialect

**Base model** = read the internet. **Fine-tune** = continue training on **your** data so style and task shape shift.

| Flavor | What you’re doing | When |
|--------|-------------------|------|
| **Full fine-tune** | Update many weights | Rare for startups — expensive, can **forget** general skills |
| **LoRA / adapters** | Small trainable layers bolted on | Common — “speak like our brand,” tool formats |
| **Preference tuning (RLHF / DPO)** | Reward “good” answers | Vendor does this; you might do light DPO on logs |

Metaphor: base model passed **driver’s ed**. Fine-tune is **company onboarding** — where’s the wiki, how we name Jira tickets.

**Open weights win** here: you can fine-tune on **VPC** with customer data. **Closed API** often offers **custom fine-tunes** or “project instructions” only — check contract.

**Don’t fine-tune** when **RAG + good prompts** fix it ([AI 03](./03-rag-and-agent-loops.md)). Fine-tune when behavior must be **in the weights** (tone, strict JSON schema addiction, domain jargon).

---

## Evals: prove it’s better, not vibes

**Eval** = repeatable test: input → model → **score**.

| Eval type | Example |
|-----------|---------|
| **Golden set** | 200 real support questions + approved answers |
| **Model-graded** | Stronger model scores weaker model’s output (watch for bias) |
| **Programmatic** | JSON schema valid? SQL runs? Tests pass? |
| **Human** | Designers rate helpfulness — slow, trustworthy |

Without evals, every prompt change is **“felt faster.”** With evals, you can say **“regression on refunds −4%, code tasks +9%.”**

Metaphor: fine-tuning without evals is **editing the menu without tasting**.

**Agent evals** add **tool trajectory**: did it call `delete_database`? did it stop after 50 steps?

---

## Safety: not just content policy

| Layer | What |
|-------|------|
| **Vendor safety** | Refusals, classifiers on API — you don’t control weights |
| **Harness guardrails** | Hooks: block tools, redact PII, require human approval |
| **Prompt / policy** | “Never quote prices not in context” |
| **Output filters** | Block secrets, toxic slurs, jailbreak echoes |
| **Access control** | Agent credentials ≠ god mode ([chapter 14](../14-security-basics.md)) |

**Jailbreaks** = user tricks model into ignoring rules. **Prompt injection via RAG** = malicious doc says “ignore prior instructions.” Safety is **system design**, not a checkbox.

---

## Depth later (same module, future pages)

| Topic | One line placeholder |
|-------|----------------------|
| **Fine-tuning** | Data prep, LoRA ranks, catastrophic forgetting |
| **Evals** | CI for prompts, online A/B, red teaming |
| **Safety** | Alignment goals, enterprise DLP, audit logs |

This file is the **table of contents for seriousness** when you’re past vibe coding.

---

## Builder takeaway

- **Fine-tune** when prompts+RAG aren’t enough; prefer **adapters** over full retrain.  
- **Evals** or you’re flying blind.  
- **Safety** = harness + permissions + data hygiene, not “we used Claude so we’re fine.”

Next: [08-india-inference-token-factory.md](./08-india-inference-token-factory.md).
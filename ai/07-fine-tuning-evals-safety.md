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

**Eval** = repeatable test: input → model → **score**. Without them, prompt changes are **“felt faster”** — not proven.

Metaphor: fine-tuning without evals is **editing the menu without tasting**.

### Example — golden set (support + RAG)

`evals/support-golden.jsonl`:

```json
{
  "question": "Can I cancel after 14 days and still get a refund?",
  "expected_contains": ["annual plans", "non-refundable"],
  "must_not_contain": ["always full refund"]
}
```

CI: RAG on → answer → fail build if `must_not_contain` hits.

### Example — programmatic (code agent)

Task: *“Add `formatCurrency` and use on Pricing.”*

Passes only if: `pnpm build` OK, tests pass, eslint clean — on **50 canned tasks**. Prompt v2 ships only if score ≥ v1 − 2%.

### Example — tool trajectory

“Delete user 42 on **staging**.”

| Agent | Tools | Eval |
|-------|-------|------|
| Bad | `delete_user(42)` first | **FAIL** |
| Good | `get_user` → confirm env → `delete_user` | **PASS** |

### Example — regression sentence

```text
Week 12 refunds eval 94% → prompt tweak → week 13: 89% → REVERT
```

### Model-as-judge (optional)

Stronger model rates “grounded in chunks only 1–5” — always spot-check humans; prefer programmatic checks when you can.

---

## Safety: guardrails, rules, and vendor policy

| Layer | What | Example |
|-------|------|---------|
| **Vendor safety** | API refusals | You don’t control weights |
| **Rules** | Always-on text | “Never quote refunds without RAG” ([AI 02](./02-agents-harnesses-inference.md)) |
| **Harness guardrails** | Code + hooks | Deny `rm -rf /`, cap tool loops |
| **Output filters** | Post-process | Strip slurs, secrets |
| **Access control** | Auth on tools | Agent DB role ≠ admin ([chapter 14](../14-security-basics.md)) |

### Examples: guardrails that saved your weekend

| Situation | Guardrail |
|-----------|-----------|
| `bash: rm -rf /` | Regex deny list on bash tool |
| Bulk email to 10k | Human approval gate |
| Tool output has `sk_live_` | `afterToolCall` redact before model sees it again |
| RAG doc says `IGNORE SYSTEM` | Strip / refuse chunk |
| \> 25 tool calls | Stop loop — budget exceeded |

```yaml
# Conceptual policy sketch
tools:
  bash:
    deny_regex: ["rm\\s+-rf\\s+/", "curl.*\\|.*sh"]
  http:
    allow_hosts_only: ["api.stripe.com", "api.yourapp.com"]
```

**Hooks** implement many of these — see [AI 02](./02-agents-harnesses-inference.md).

**Jailbreaks** = user tricks the model. **RAG injection** = malicious doc steers the model. Rules alone won’t save you; **hooks + evals** will.

### Fine-tuning + evals together

Ship LoRA only if **golden eval** doesn’t regress — same CI gate as prompt changes.

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
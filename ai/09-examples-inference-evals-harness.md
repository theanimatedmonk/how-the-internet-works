# AI 09 — Worked Examples: Inference, Evals, Guardrails, Rules, Hooks, Skills

Cookbook chapter. Copy the **shape**, not every string — your stack will differ.

---

## Inference — what actually happens (3 mini stories)

### Example A — Claude Code, closed stack (overseas GPUs)

You type: *“Fix the hydration warning in `Dashboard.tsx`.”*

| Step | What happens |
|------|----------------|
| 1 | **Harness** reads repo: 12 files, git diff, `CLAUDE.md` rules → packs ~**38k tokens** into one request |
| 2 | HTTPS POST to vendor API (e.g. US/EU region) |
| 3 | **Inference:** GPUs run forward passes — you pay for **input tokens + output tokens** |
| 4 | Model streams: “I’ll check `useEffect`…” + **tool call** `Read file` |
| 5 | Harness runs tool locally, **appends result** to context, **second inference** call |
| 6 | Model returns patch; harness applies edit |

**Rough numbers (illustrative, not a quote):**

```text
Turn 1:  38,000 in  +  400 out   ≈ one billing tick
Turn 2:  41,000 in  +  1,200 out ≈ tool loop costs more than “one chat message”
```

Metaphor: **inference** is **metered thinking** — every tool round trip is another spin on the GPU taxi meter.

---

### Example B — Local harness + Token Factory (India inference host)

You run **Hermes-style harness** on a Bangalore laptop. Model weights live on **Sarvam Token Factory** GPUs in India.

```text
Harness (MacBook)  --POST /v1/chat/completions-->  Token Factory (Mumbai-ish)
                                                    GLM / Sarvam weights on GPU
```

Same JSON shape as OpenAI — different **base URL** and key. **Inference** still means: context in → tokens out. **Harness never leaves your machine**; only **math** is remote.

**When this wins:** latency to Indian users, data-processing story, cost vs US frontier for **Indic** or bulk tasks.

---

### Example C — Not inference: what you’re *not* doing

```text
Downloading Llama weights once     →  one-time file transfer (not per-token inference)
Training a LoRA on Sunday night    →  training job (GPU hours, different invoice)
Running eslint in the harness    →  your CPU, $0 to OpenAI
```

**Inference only** = “model, generate the next tokens for **this** request.”

---

## Evals — tests your agent can’t lie about

### Example 1 — Golden answer (support bot + RAG)

**Fixture row in `evals/support-golden.jsonl`:**

```json
{
  "question": "Can I cancel after 14 days and still get a refund?",
  "expected_contains": ["annual plans", "non-refundable"],
  "must_not_contain": ["always full refund"]
}
```

**Run:** RAG on → agent answers → script checks substrings / embeddings similarity to gold answer.

**Pass:** cites policy reality. **Fail:** model hallucinates “yes, anytime” — ship blocked.

---

### Example 2 — Programmatic (code agent)

**Task:** “Add a `formatCurrency` util and use it on Pricing page.”

| Check | How |
|-------|-----|
| **Schema** | Output plan is valid JSON if you require structured mode |
| **Build** | `pnpm build` exits 0 in sandbox |
| **Tests** | `pnpm test -- formatCurrency` passes |
| **Lint** | no new eslint errors |

Eval score = **% of 50 tasks** that pass all gates. Prompt v2 only ships if **≥ v1 score − 2%**.

---

### Example 3 — Tool trajectory (safety-shaped eval)

**Scenario:** “Delete user 42 from staging.”

| | Bad agent | Good agent |
|---|-----------|------------|
| Tool sequence | `delete_user(42)` immediately | `get_user(42)` → confirm staging → `delete_user` |
| Eval | **FAIL** — skipped verification | **PASS** |

Store expected **tool names in order** (or allowed set). CI fails if agent calls `delete_*` without prior `get_*` in staging profile.

---

### Example 4 — Model-as-judge (use carefully)

Stronger model scores: *“Is this answer grounded in the retrieved chunks only? 1–5.”*

**Trap:** judge favors its own style. Mitigate with **human spot checks** on 10% and **programmatic** checks where possible.

---

### Example 5 — Regression dashboard (the standup sentence)

```text
Week 12: refunds eval 94% → prompt tweak → week 13: 89%  → REVERT
```

That’s evals doing their job — saved you from a cheerful liar in production.

---

## Guardrails — hard stops on the harness

Guardrails = **code that runs even when the model is confident and wrong**.

| Example | Guardrail |
|---------|-----------|
| Agent wants `bash: rm -rf /` | **Block** command pattern list; tool returns “denied” |
| Agent wants `POST /admin/delete-all-users` | Require **role** in session; 403 before HTTP |
| Agent about to email 10k users | **Human-in-the-loop** button in internal UI |
| Tool output contains `sk_live_` | **Redact** before putting back in context |
| Loop > 25 tool calls | **Stop** — “budget exceeded” |
| RAG chunk contains “IGNORE SYSTEM” | **Strip** or refuse high-risk injection patterns |

**YAML-shaped sketch (conceptual):**

```yaml
tools:
  bash:
    deny_regex:
      - "rm\\s+-rf\\s+/"
      - "curl.*\\|.*sh"
  http:
    allow_hosts_only:
      - "api.stripe.com"
      - "api.yourapp.com"
```

Metaphor: **guardrails are bouncers**. The model is the VIP who sometimes tries to drive the car through the lobby.

---

## Rules — persistent instructions (project brain)

**Rules** = text the harness **injects every turn** — Cursor `rules`, `CLAUDE.md`, `.cursor/rules/*.mdc`, “system prompt” files.

### Example — `.cursor/rules/repo.mdc`

```markdown
# This repo

- Package manager: pnpm only (never npm install).
- Commits: single author animatedmonk; no Co-authored-by Cursor.
- API keys: never in frontend; only env on server.
- Before editing SQL routes: queries must use Prisma parameterized APIs.
```

**Effect:** model sees this **before** your message — fewer “helpful” `npm install` suggestions.

### Example — product rule for support agent

```text
Never state a refund amount unless it appears in retrieved policy chunks.
If unsure, say "I'll connect you to a human" and call tool escalate_ticket.
```

Rules are **cheap guardrails** — they fail under jailbreak, so pair with **hooks + evals**.

---

## Hooks — code that runs at lifecycle moments

**Hooks** = functions the harness calls **before/after** events (not the LLM deciding).

| Hook | When | Example behavior |
|------|------|------------------|
| `beforeToolCall` | Model emitted tool JSON | If `tool === "send_email"` and `recipients.length > 5` → abort, ask human |
| `afterToolCall` | Tool returned stdout | Truncate to 8k chars; redact `Bearer ` tokens |
| `onSessionStart` | User opened project | Load `SKILL.md` list; index git branch |
| `beforeSubmitToModel` | Request about to fly | Strip `.env` contents from attached files |
| `onStop` | User hit stop | Log partial trajectory for eval dataset |

### Example — `beforeToolCall` (pseudocode)

```javascript
function beforeToolCall({ name, args }) {
  if (name === "run_sql" && !args.readOnly) {
    throw new Error("Only read_only SQL allowed for this agent profile");
  }
  if (name === "bash" && args.command.includes("prod")) {
    return { requireApproval: true, message: "Prod command — confirm in UI" };
  }
}
```

Hooks enforce what **rules merely suggest**.

---

## Skills — packaged playbooks the agent can invoke

**Skills** = folders with `SKILL.md` (and maybe scripts) teaching **multi-step workflows** — “how we do X in this org.”

Often loaded **on demand** when task matches (“user asked to open a PR” → read `skills/open-pr/SKILL.md`).

### Example — skill: “ship a safe migration”

**`skills/db-migration/SKILL.md` (excerpt):**

```markdown
## When user asks for a DB migration

1. Confirm environment is staging, never prod first.
2. Generate migration SQL; no DROP without explicit user YES.
3. Run against staging DATABASE_URL from env only.
4. Run `pnpm test:integration`.
5. Summarize diff for human review before prod deploy.
```

**Harness behavior:** agent **searches available skills** → loads file → follows steps — less improvisation on dangerous ops.

### Example — skill: “commit like this repo”

Matches your git rule skill: author name, no Cursor trailer, HEREDOC commit message — **procedure as documentation**, not tribal chat.

### Rules vs skills (quick)

| | **Rules** | **Skills** |
|---|-----------|------------|
| Scope | Always on (every message) | Loaded when relevant |
| Shape | Short constraints | Longer playbooks |
| Analogy | Employee handbook | Runbook for one job |

---

## One agent turn — all layers together

```text
RULES:     "pnpm only; no prod SQL writes"
     ↓
USER:      "Refund flow seems wrong — fix API + add test"
     ↓
SKILL:     harness loads skills/support-and-refunds/SKILL.md
     ↓
RAG:       retrieves RefundPolicy.md chunks
     ↓
MODEL:     plans edit + tool calls  →  INFERENCE (billable)
     ↓
HOOK:      beforeToolCall blocks write to prod DB
     ↓
GUARDRAIL: bash deny_regex blocks curl | sh
     ↓
TOOL:      run tests locally (your CPU)
     ↓
HOOK:      afterToolCall redacts stripe key in stderr
     ↓
MODEL:     second INFERENCE pass → final summary
     ↓
EVAL (CI): golden refund questions still pass at 94%
```

---

## Builder takeaway

- **Inference** = each model call on the GPU meter; tool loops multiply calls.  
- **Evals** = golden, programmatic, and trajectory tests — revert on regression.  
- **Guardrails + hooks** = enforce; **rules + skills** = instruct.  
- Use **all four** — rules alone won’t stop `rm -rf`.

Back to [AI index](./README.md) · related: [02](./02-agents-harnesses-inference.md) · [07](./07-fine-tuning-evals-safety.md).
# AI 04 — GPUs, Data Centers & The Factory Floor

Every token you generate is **electricity turned into heat turned into probability**. This chapter is **where that happens** — surface level, no facility engineering exam.

---

## The cast

| Role | Who / what |
|------|------------|
| **Chip designers** | **NVIDIA** (H100, B100, Blackwell…) dominates training/inference lore; **AMD** MI series; custom silicon below |
| **Hyperscalers** | **AWS, Google, Microsoft, Meta, Amazon** — own regions, some own chips, rent and build |
| **Neoclouds** | **CoreWeave, Nebius, Lambda Labs**, etc. — buy GPUs, rent **inference/training** capacity to startups |
| **GPU-rich newcomers** | **xAI / X** — huge NVIDIA bets, building **their own** megaclusters for Grok |

**Hyperscaler playbook (simplified):**

- Build **own** data centers + buy **own** GPUs (and TPUs where Google)
- **Also** rent from neoclouds when demand spikes or for specialized clusters
- Sell **managed APIs** (Bedrock, Vertex, Azure OpenAI) — you touch software, they touch racks

**Neocloud playbook:**

- Raise money → buy **tons of NVIDIA** → build or lease **data center space** → sell **GPU-hours** or **hosted inference**
- Compete on availability, price, region — **until** every mega-player builds private capacity and insources

**xAI / SpaceX-adjacent energy** angle: if a player goes **all-in on owning NVIDIA stacks + DC buildout**, neoclouds that **only** resell generic GPU rental can feel squeeze — **commodity middlemen** in a world of vertical empires. Nebius, CoreWeave, etc. survive by **contracts, software, regions, and speed** — not by assuming infinite shortage forever.

---

## Custom chips (not only NVIDIA)

| Company | Custom AI silicon |
|---------|-------------------|
| **Google** | **TPU** trains/serves Gemini stack |
| **Amazon** | **Trainium / Inferentia** |
| **Meta** | MTIA (in-house accelerators; still heavy NVIDIA in practice) |
| **Microsoft** | Maia AI accelerator (plus massive NVIDIA purchases) |
| **Apple** | Neural Engine on-device (different league — phones, not DC-scale) |

Hyperscalers want **margin and supply independence**; NVIDIA still sets the **lingua franca** for much of the ecosystem.

---

## What a data center actually is

A **secure building** (or campus) full of:

- **Power** — megawatts; often dual feeds, substations, generators
- **Cooling** — air + **liquid**; AI racks run **hot**
- **Rows of racks** — metal cabinets, ~42U tall, bolted to raised floor
- **Networking** — fat fiber between racks (training wants **low latency** between GPUs)

**Who builds them:**

| Model | Example vibe |
|-------|----------------|
| **Private / hyperscaler** | Google, Meta, Microsoft campuses |
| **Colocation** | Equinix, Digital Realty — you bring servers, they bring building + power + cooling |
| **PPP / government-led** | National “AI sovereignty” projects — power + land + politics |
| **Neocloud + colo** | Lease halls, fill with GPU racks |

They’re **critical infrastructure** now — like airports for the mind. Governments map them in **industrial policy**; militaries map them as **strategic targets** in conflict scenarios (disrupt AI supply = disrupt economy). Uncomfortable, real.

---

## Inside one rack (cartoon version)

One **rack** ≠ one GPU. Typically:

- **Multiple servers** (nodes) per rack
- Each node has **2–8 GPUs** (config varies wildly)
- **Power budget** per rack can be **tens of kW** — your apartment heater is **2 kW**

**Orientation:** hot aisle / cold aisle — suck cold air from front, blow hot air to back. **Liquid cooling** more common at density:

- **Cold plates** on GPUs — copper touches the chip; **coolant** (not always plain water) loops through
- **CDUs** (coolant distribution units) — exchange heat to building water loop or dry coolers
- **Outdoor cooling towers / dry coolers** — where heat finally leaves the building

Metaphor: GPUs are **drag racers idling in a parking garage**. Without cooling, the garage becomes a pizza oven; the race ends in **thermal throttling** or **shutdown**.

---

## Single points of failure (dramatic but true)

| Hit this | Effect |
|----------|--------|
| **Grid / substation** | Whole hall dark — inference stops |
| **Cooling tower / chilled water plant** | GPUs thermal-guard in minutes |
| **Fiber cut** | GPUs fine, **customers** can’t reach them |
| **Cyber on management network** | Worse than unplugging one rack |

“**Knock out the water plant or the power pole**” is reductive but directionally right: AI at scale is **physics + utilities**, not just `@anthropic-ai` on Twitter.

---

## Builder ↔ metal (why you care)

- **Latency** = distance to inference region + queue depth on shared GPUs
- **Cost** = $/token driven by **GPU depreciation + power + utilization**
- **Sovereignty** = which country’s **power bill and laws** touch your prompts
- **Outages** = when the factory sneezes, your agent loop **times out** — design retries ([chapter 11](../11-integrations.md))

You won’t pick rack layouts. You **will** explain why “just run it locally” fails for a **405B** model.

---

## Builder takeaway

- **Training** = rare bake; **inference** = daily slice — both need **GPUs + power + cooling**.
- **Hyperscalers** vertically integrate; **neoclouds** rent the slices; **everyone** negotiates NVIDIA supply.
- Data centers are **war-adjacent critical infra** in geopolitics — not just “the cloud.”

Back to [AI index](./README.md) · [Main module](../README.md).
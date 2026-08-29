# QLP Deployment & Cost Comparison

Summary of [Quran_Platform_Deployment_and_Cost_Comparison.pdf](Quran_Platform_Deployment_and_Cost_Comparison.pdf). Complements [architecture.md](architecture.md) and [backlog.md](backlog.md).

## Purpose & Scope

Recommended hosting for the **prototype phase (up to 200 users)** with transparent cost comparison between self-hosting and managed alternatives. Includes engineering maintenance time at **€13/hour**.

**Decision for this phase:** application backend and video/call layer are **self-hosted**; **database is managed** to protect against data loss during early testing.

## Prototype Architecture

```
Clients (browser + mobile)
        │
        ├──────────────────┐
        ▼                  ▼
   App VM              Media VM
   Backend + Redis     LiveKit + TURN + Egress
        │                  │
        └────────┬─────────┘
                 ▼
         Managed Data
    PostgreSQL + object storage
```

| VM / Service | Role |
|--------------|------|
| **App VM** | NestJS backend, Redis (cache, presence, Egress job queue) |
| **Media VM** | LiveKit SFU, TURN, Egress recording; own public IP, separate security boundary |
| **Managed PostgreSQL** | Primary database; automated backups |
| **Managed object storage** | S3-compatible; recordings and uploaded lessons |

> Egress on Media VM points at Redis on App VM — no second Redis instance.

## Component Comparison

| Component | Self-Hosted (chosen where noted) | Managed alternative |
|-----------|----------------------------------|---------------------|
| App hosting | Small VM 2 vCPU/4 GB ≈ **€6/mo** + 1h/mo maintenance | Managed container ≈ €20/mo |
| Video (LiveKit) | VM 4 vCPU/8 GB + TURN + Egress ≈ **€11/mo** + 1h/mo maintenance | LiveKit Cloud €0–€46/mo + recording fees |
| Database | Not used (ruled out for pilot) | Managed PostgreSQL ≈ **€15/mo** |
| Object storage | Not practical at this scale | S3-compatible ≈ **€5/mo** |

One-time setup (Sprint 1, ~9h ≈ €117): already in delivery plan — not an additional budget line.

## Total Monthly Cost (Steady State)

| Architecture | Infra/mo | Maintenance labor/mo | **Total/mo** |
|--------------|----------|----------------------|--------------|
| **Recommended** (App + Video self-hosted, DB + storage managed) | ≈ €37 | ≈ €26 (2h) | **≈ €63** |
| Fully managed alternative | ≈ €40–86 | Negligible | ≈ €40–86 |

At 200 users the paths are similar monthly; self-hosting value is **structural** — fixed cost as usage grows toward hundreds of concurrent participants, while managed video bills per participant-minute.

## Why Self-Host Video at This Scale

- Infrastructure cost stays **fixed** as usage grows within VM capacity
- Data stays on infrastructure the project **controls from day one**
- Setup labor already budgeted in Sprint 1
- Gap vs. managed widens when platform succeeds and video minutes increase

## Assumptions & Caveats

- Pricing as of August 2026 (Hetzner, DigitalOcean, LiveKit Cloud); reconfirm at procurement
- Light-to-moderate pilot — 200 total users, not 200 concurrent video participants
- VM provider illustrative; final region follows data-residency decision
- Labor assumes experienced engineer, no major blockers

## Local Dev Mapping

| Production | Local (`docker-compose.yml`) |
|------------|------------------------------|
| Managed PostgreSQL | `postgres` service |
| Redis on App VM | `redis` service |
| S3-compatible storage | `minio` service |
| LiveKit on Media VM | LiveKit Cloud dev keys or local LiveKit Docker (future) |

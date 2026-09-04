# QLP Backlog

Source of truth for product/engineering backlog. Aligned with:

- [Quran_Platform_Architecture_and_Delivery_Plan.pdf](Quran_Platform_Architecture_and_Delivery_Plan.pdf)
- [Quran_Platform_Deployment_and_Cost_Comparison.pdf](Quran_Platform_Deployment_and_Cost_Comparison.pdf)

**Team assumption:** ~5–6 people, 2-week sprints (~18 weeks to soft launch).

---

## Legend

| Status | Meaning |
|--------|---------|
| ✅ Done | Delivered in current prototype codebase |
| 🟡 Partial | Started; gaps documented |
| ⬜ Backlog | Not started |
| 🔮 Post-MVP | Explicitly deferred |

---

## Epic Overview (PDF WBS)

| Epic | Name | Status |
|------|------|--------|
| **E1** | Foundation and Identity | 🟡 Partial |
| **E2** | Scheduling and Meetings | 🟡 Partial |
| **E3** | Video Calls (Core) | 🟡 Partial |
| **E4** | Call Recording | ⬜ Backlog |
| **E5** | Video Upload and VOD Library | ⬜ Backlog |
| **E6** | Community and Matching | 🟡 Partial |
| **E7** | Trust and Moderation | 🟡 Partial |
| **E8** | Cloud Infrastructure and DevOps | 🟡 Partial |
| **E9** | Scale-Out | 🔮 Post-MVP |

---

## E1 — Foundation and Identity

| ID | Task | Status | Notes |
|----|------|--------|-------|
| E1-01 | Auth — email + password | ✅ Done | JWT access/refresh |
| E1-02 | Auth — phone/OTP | ⬜ Backlog | PDF: often default for audience |
| E1-03 | Session management | ✅ Done | Refresh token rotation |
| E1-04 | User profile data model | ✅ Done | `users`, `profiles` |
| E1-05 | Teacher profile + credential fields (ijazah) | 🟡 Partial | `qualifications` field; no ijazah chain model |
| E1-06 | Teacher verification workflow | 🟡 Partial | Apply + admin verify |
| E1-07 | i18n scaffolding (Arabic RTL + English) | ✅ Done | EN/AR in web |
| E1-08 | Base design system / component library | 🟡 Partial | Tailwind; needs formal design system |
| E1-09 | Parent-child accounts | ✅ Done | Prototype extension |
| E1-10 | Web target: Next.js migration | ⬜ Backlog | Current: Vite SPA |
| E1-11 | Mobile: React Native app | ⬜ Backlog | Planned client |

---

## E2 — Scheduling and Meetings

| ID | Task | Status | Notes |
|----|------|--------|-------|
| E2-01 | `meetings` + `meeting_participants` data model | ⬜ Backlog | Current: `bookings` only |
| E2-02 | Create / update / cancel meeting API | 🟡 Partial | Booking CRUD; not full meetings model |
| E2-03 | Booking UI + calendar view | 🟡 Partial | Bookings page; no calendar |
| E2-04 | Reminder notifications | ⬜ Backlog | |
| E2-05 | Timezone handling | 🟡 Partial | Profile timezone field; not enforced end-to-end |
| E2-06 | Open vs. closed session access control | ⬜ Backlog | PDF core requirement |
| E2-07 | Group session support (multi-participant) | ⬜ Backlog | Same LiveKit room mechanism |

---

## E3 — Video Calls (Core)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| E3-01 | **LiveKit Cloud** integration | ⬜ Backlog | Replace Daily/mock stub |
| E3-02 | Server-side token service | ⬜ Backlog | Short-lived room-scoped tokens |
| E3-03 | Room lifecycle webhook handlers | ⬜ Backlog | |
| E3-04 | Call UI — join flow, video grid, controls | 🟡 Partial | Basic iframe/page; needs LiveKit SDK |
| E3-05 | Open vs. closed access control | ⬜ Backlog | |
| E3-06 | Silent/observer join mode | ⬜ Backlog | Publish withheld |
| E3-07 | Self-hosted LiveKit on Media VM | ⬜ Backlog | Sprint 1 infra; prod path per deployment PDF |
| E3-08 | TURN server (Media VM) | ⬜ Backlog | Restrictive networks |
| E3-09 | No third-party call links (Zoom/Meet) | ✅ Done | Policy; enforce in UI |

---

## E4 — Call Recording

| ID | Task | Status | Notes |
|----|------|--------|-------|
| E4-01 | LiveKit Egress integration (Room Composite) | ⬜ Backlog | |
| E4-02 | Recording metadata linked to source session | ⬜ Backlog | |
| E4-03 | Access control inheritance (closed → private) | ⬜ Backlog | |
| E4-04 | Storage lifecycle and retention policy | ⬜ Backlog | |
| E4-05 | Egress → shared Redis on App VM | ⬜ Backlog | Per deployment architecture |

---

## E5 — Video Upload and VOD Library

| ID | Task | Status | Notes |
|----|------|--------|-------|
| E5-01 | Pre-signed upload endpoint | ⬜ Backlog | Direct-to-storage |
| E5-02 | Transcode pipeline integration | ⬜ Backlog | Adaptive bitrate |
| E5-03 | Unified `videos` table (recordings + uploads) | ⬜ Backlog | |
| E5-04 | Library browsing UI | ⬜ Backlog | |
| E5-05 | Adaptive-bitrate player | ⬜ Backlog | |
| E5-06 | CDN delivery | ⬜ Backlog | |
| E5-07 | Structured curriculum (Track/Unit/Lesson) | ✅ Done | Prototype extension beyond PDF |
| E5-08 | Qur'an API integration (Quran.com / Al Quran Cloud / Tanzil) | ⬜ Backlog | |

---

## E6 — Community and Matching

| ID | Task | Status | Notes |
|----|------|--------|-------|
| E6-01 | Teacher discovery / directory with filters | 🟡 Partial | Language/specialty; expand filters |
| E6-02 | Study circle (group) creation and membership | ⬜ Backlog | |
| E6-03 | Interest/preference-based matching | ⬜ Backlog | Search-first approach |
| E6-04 | Gender-preference filter (optional) | ⬜ Backlog | Open question in PDF |
| E6-05 | 1:1 chat (student ↔ teacher) | ✅ Done | WebSocket MVP |
| E6-06 | Achievements / gamification | ✅ Done | Prototype extension |

---

## E7 — Trust and Moderation

| ID | Task | Status | Notes |
|----|------|--------|-------|
| E7-01 | Report / mute / remove-participant tooling | ⬜ Backlog | Required for open sessions |
| E7-02 | Teacher approval workflow (admin queue) | 🟡 Partial | Pending tutor list |
| E7-03 | Admin dashboard v1 (users, sessions, reports) | 🟡 Partial | Users + tutors; no reports/sessions |
| E7-04 | Host controls in live sessions | ⬜ Backlog | |
| E7-05 | Chat moderation / report message | ⬜ Backlog | |

---

## E8 — Cloud Infrastructure and DevOps

| ID | Task | Status | Notes |
|----|------|--------|-------|
| E8-01 | Cloud environment provisioning | ⬜ Backlog | App VM + Media VM per deployment PDF |
| E8-02 | CI/CD pipelines (backend, frontend, mobile) | 🟡 Partial | GitHub Actions build only |
| E8-03 | Monitoring, logging, alerting | ⬜ Backlog | |
| E8-04 | Staging / production separation | ⬜ Backlog | |
| E8-05 | Managed PostgreSQL (pilot) | 🟡 Partial | Docker locally; managed in prod |
| E8-06 | Managed object storage | 🟡 Partial | MinIO locally |
| E8-07 | Local docker-compose dev stack | ✅ Done | Postgres, Redis, MinIO |
| E8-08 | Sprint 1 infra setup (~9h one-time) | ⬜ Backlog | VMs, TURN, TLS, LiveKit containers |

---

## E9 — Scale-Out (Post-MVP) 🔮

| ID | Task | Priority |
|----|------|----------|
| E9-01 | Egress → HLS → CDN for large broadcasts | P2 |
| E9-02 | Self-hosted LiveKit migration (Compose → K8s) | P2 |
| E9-03 | Multi-region node pools | P2 |
| E9-04 | Payments / monetization | TBD — not scoped in PDF |
| E9-05 | OAuth / SSO | P2 |
| E9-06 | Hifz tracking (ayah-level) | P2 — prototype extension |
| E9-07 | AI tajweed assistant | P3 |

---

## Sprint Plan (from Architecture PDF)

| Sprint | Weeks | Phase / Goal | Key deliverables | Status |
|--------|-------|--------------|------------------|--------|
| **1–2** | 1–4 | **Foundation** | Cloud + CI/CD; auth (email + OTP); teacher/user profiles; i18n/RTL; design system start | 🟡 In progress |
| **3–4** | 5–8 | **Core Calling MVP** | Meetings model; booking UI; LiveKit; token service; call UI; open/closed access | ⬜ Next |
| **5–6** | 9–12 | **Recording & Video Library** | Egress; upload + transcode; unified library; adaptive playback | ⬜ |
| **7–8** | 13–16 | **Community & Trust** | Teacher directory + matching; study circles; moderation; admin v1 | ⬜ |
| **9** | 17–18 | **Hardening & Launch** | Security review; load test call path; bug bash; monitoring; soft launch | ⬜ |
| **Post** | — | **Scale-Out** | HLS/CDN broadcasts; self-hosted LiveKit at scale; multi-region | 🔮 |

---

## Prototype Codebase — What Exists Today

Completed in local MVP (pre-PDF alignment):

- [x] Monorepo (NestJS API + React/Vite web + admin)
- [x] PostgreSQL schema, migrations, Qaida curriculum seed
- [x] Email auth, JWT, roles (student/tutor/parent/admin)
- [x] Profiles, parent-child linking, progress, achievements
- [x] Tutor apply/verify, booking flow, chat (Socket.io)
- [x] Video stub (Daily/mock — **to be replaced with LiveKit**)
- [x] Admin panel (users, tutor verification)
- [x] EN/AR i18n + RTL

---

## Immediate Next Priorities (Sprint 1 completion)

1. **E8-08** — Provision App VM + Media VM; LiveKit + TURN + Egress; TLS
2. **E3-01 / E3-02** — LiveKit token service; replace video stub
3. **E1-02** — Phone/OTP auth
4. **E2-01** — `meetings` / `meeting_participants` model (align with bookings)
5. **E1-05** — Ijazah chain fields on teacher profile
6. **E5-08** — Integrate Qur'an content API for curriculum lessons

See also [deployment.md](deployment.md) for hosting costs (~€63/mo prototype).

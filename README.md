# QLP — Qur'an Learning Platform

Community platform connecting learners with verified teachers for **in-platform** live Qur'an instruction — 1:1 and group sessions, session recording, and an on-demand lesson library. No Zoom/Meet routing.

## Planning docs

| Doc | Description |
|-----|-------------|
| [docs/PLAN.md](docs/PLAN.md) | Master product & engineering plan |
| [docs/backlog.md](docs/backlog.md) | Epic backlog & sprint plan |
| [docs/architecture.md](docs/architecture.md) | System architecture (LiveKit, modular monolith) |
| [docs/deployment.md](docs/deployment.md) | Prototype hosting & cost (~€63/mo) |
| [docs/product-vision.md](docs/product-vision.md) | Vision & principles |

PDF sources: `docs/Quran_Platform_Architecture_and_Delivery_Plan.pdf`, `docs/Quran_Platform_Deployment_and_Cost_Comparison.pdf`

## Stack

| Layer | Target (PDF) | Current prototype |
|-------|--------------|-------------------|
| Web | Next.js | React 18 + Vite + Tailwind |
| Mobile | React Native | — |
| Backend | NestJS modular monolith | NestJS + TypeORM |
| Video | **LiveKit** (Cloud → self-hosted Media VM) | LiveKit token stub + dev fallback |
| Data | Managed PostgreSQL + S3 | Docker Postgres + MinIO |
| Realtime | LiveKit SFU; Redis for presence/Egress queue | Socket.io chat |

## Quick start

```bash
docker compose up -d
npm install
cp apps/api/.env.example apps/api/.env
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:3001
- Swagger: http://localhost:3001/docs

**Admin:** `admin@qlp.local` / `Admin123!`

## Prototype features

- Auth & RBAC (email; phone/OTP planned)
- Curriculum (Qaida track), progress, achievements
- Tutor discovery, booking, chat
- LiveKit-oriented video orchestration (configure keys for real calls)
- Parent-child accounts, EN/AR RTL i18n
- Admin: users, tutor verification

## Environment

See [apps/api/.env.example](apps/api/.env.example). For live video:

```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | API + web |
| `npm run build` | Build all packages |

# QLP Product Vision

## Mission

Connect Muslim learners worldwide with verified teachers for Qur'an study — through live one-to-one and group sessions, session recordings, and a growing on-demand lesson library. All calling happens natively inside the platform; no routing through Zoom, Google Meet, or similar third-party products.

## Core Value Propositions

1. **In-platform live instruction** — 1:1 and group video calls hosted natively via LiveKit (open/closed sessions, observer mode)
2. **Unified video library** — Call recordings and teacher uploads share one pipeline (transcode → adaptive playback → CDN)
3. **Verified teachers** — Credential workflow from day one (ijazah chain, qualifications); credibility is core to trust
4. **Community & matching** — Teacher discovery, study circles, preference-based matching (including optional gender filter)
5. **Safe engagement** — Moderation tooling required from day one for open/public sessions; parent-managed child accounts
6. **Accessibility** — Arabic/RTL and multi-language support designed in from the start, not retrofitted

## Target Users

| Role | Description |
|------|-------------|
| **Learner** | Attends live sessions, watches recordings, progresses through on-demand lessons |
| **Teacher** | Teaches live sessions, uploads lessons, manages availability; verified by admin |
| **Parent/Guardian** | Manages child accounts, views progress (where applicable) |
| **Admin** | User management, teacher approval, moderation, session oversight |

## User Journeys

### Learner
Register (email or phone/OTP) → Discover teachers → Book or join session → Join in-app video call → Access recording (if permitted) → Browse video library

### Teacher
Apply with credentials → Admin verification → Set availability → Host 1:1 or group sessions → Upload pre-recorded lessons → Recordings auto-linked to sessions

### Admin
Review teacher applications → Moderate reports → Manage users and sessions → Monitor platform health

## Guiding Principles (from architecture review)

- **Modular monolith** over microservices until real scale demands otherwise
- **Buy the hard 20%** of real-time video (LiveKit) rather than rebuild; self-hosted exit ramp with no app rewrite
- **Managed services first** for data layer; self-host video/app when usage justifies cost
- **One unified video pipeline** — a recording is just another video
- **Cloud choice driven by data residency**, not default habit (see [architecture.md](architecture.md))

## Open Questions

- Expected scale at launch and 12 months (concurrent sessions, total users)
- Is in-Kingdom (Saudi) data residency a hard requirement or a preference?
- Monetization model — not currently scoped
- Is gender-preference filter for matching/booking an explicit requirement?
- Confirm team size (~5–6 people assumed in sprint plan)

## Success Metrics (Future)

- Session attendance and completion rate
- Recording/library engagement
- Teacher retention and verification throughput
- Moderation response time
- Concurrent session capacity vs. infrastructure headroom

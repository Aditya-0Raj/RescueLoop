# RescueLoop — AmiHacks Track A

RescueLoop is a deadline-first food rescue platform that combines low-friction, WhatsApp-style donor intake with a rescue orchestration engine. A donation is only considered secured when a feasible recipient and driver path exists, with a prepared backup and verified handoff.

## Repository

- `client/` — React + Vite + Tailwind v4 frontend
- `backend/` — Node.js + Express + MongoDB backend


## Demo roles

The hackathon build uses role-based demo sign-in. The seeded role identities are:

- donor — `donor@rescueloop.local`
- recipient — `recipient@rescueloop.local`
- driver — `driver@rescueloop.local`
- operations — use the role selector in the demo login; the API creates the demo user when needed

## Core flow

1. Donor opens message-first intake and parses a natural-language food message.
2. Backend creates a Food Lot Passport and runs the deterministic Safety Gate.
3. Rescue Viability Engine filters infeasible recipient + driver combinations and stores primary + backup candidates.
4. Recipient and driver can commit.
5. Operations can trigger the failover demo; the prepared backup path is activated.
6. Driver/recipient complete pickup and delivery using OTP verification.
7. Impact ledger records delivered food, estimated meals, CO2e and backup saves.

## WhatsApp integration point

The backend includes an integration-ready webhook at:

- `GET /api/whatsapp/webhook` — Meta webhook verification
- `POST /api/whatsapp/webhook` — receives inbound text messages and runs the same intake parser

A real Meta WhatsApp Cloud API connection still needs a WhatsApp Business app, verify token, access token and phone-number ID.

## UI direction

The landing page uses an editorial, story-led visual language inspired by environmental storytelling: large serif headlines, warm paper tones, forest green, terracotta accents, asymmetric sections and a project-specific animated rescue reel. The visual content is about surplus food, deadlines, safety, capacity, drivers and failover — not generic environmental stock imagery.

No external video file is required for the current build. The landing page includes a lightweight animated rescue sequence that can later be replaced by a short project-specific video without changing the product flow.

## Integration notes

The frontend is configured for the real backend by default (`VITE_USE_MOCKS=false`). JWTs are stored in local storage for this hackathon demo and attached automatically to API requests. In development, the API accepts both `localhost:5173` and `127.0.0.1:5173` to avoid common CORS/login issues.

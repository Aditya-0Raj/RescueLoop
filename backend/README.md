# RescueLoop Backend

Node.js + Express + MongoDB backend for the RescueLoop hackathon frontend.

## Stack

- Node.js (ES modules)
- Express
- MongoDB + Mongoose
- JWT demo authentication
- Deterministic safety gate
- Deadline-first rescue matching
- Recipient live-capacity model
- Driver on-duty commitments
- Primary + backup rescue plan
- Automatic failover
- Pickup/delivery OTP verification
- Event timeline
- Impact ledger
- Optional OpenAI intake parsing with regex fallback

## Folder structure

```text
backend/
├─ scripts/
├─ src/
│  ├─ config/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ services/
│  ├─ utils/
│  └─ validators/
├─ .env.example
├─ package.json
└─ README.md
```

## 1. Install

```bash
npm install
```

## 2. Configure MongoDB

Copy `.env.example` to `.env` and set `MONGO_URI`.

Local MongoDB example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/rescueloop
```

MongoDB Atlas can also be used by replacing `MONGO_URI`.

## 3. Seed demo data

```bash
npm run seed
```

This creates:

- 1 donor
- 2 recipients
- 2 on-duty drivers
- 1 sample 25 kg veg-biryani donation

## 4. Start API

```bash
npm run dev
```

API: `http://localhost:5000`

Health check:

```text
GET http://localhost:5000/api/health
```

## Demo login

```http
POST /api/auth/demo-login
Content-Type: application/json

{"role":"donor"}
```

Roles: `donor`, `recipient`, `driver`, `operations`.

For the hackathon prototype, the frontend can also use the `x-demo-role` header while `DEMO_MODE=true`.

## Main API

### Donations

- `POST /api/donations`
- `GET /api/donations/my`
- `GET /api/donations/:id`

### Recipients

- `GET /api/recipients`
- `GET /api/recipients/me`
- `PATCH /api/recipients/me/capacity`
- `GET /api/recipients/me/incoming`
- `POST /api/recipients/me/donations/:donationId/accept`
- `POST /api/recipients/me/donations/:donationId/decline`

### Drivers

- `GET /api/drivers/me`
- `PATCH /api/drivers/me/duty`
- `GET /api/drivers/me/jobs`
- `POST /api/drivers/me/jobs/:rescueId/accept`
- `POST /api/drivers/me/jobs/:rescueId/decline`

### Rescue + tracking

- `GET /api/rescues/:id`
- `GET /api/rescues/:id/timeline`
- `POST /api/rescues/:id/failover`
- `POST /api/rescues/:id/pickup/otp`
- `POST /api/rescues/:id/pickup/verify`
- `POST /api/rescues/:id/delivery/otp`
- `POST /api/rescues/:id/delivery/verify`

### Impact

- `GET /api/impact/dashboard`

### Intake

- `POST /api/intake/parse`

## Frontend integration

Frontend `.env` should eventually use:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCKS=false
```

The existing frontend service layer can stay intact; switch mocks off only after the backend is running.

## Important design decisions

1. AI does not approve food safety. The deterministic safety gate does.
2. A rescue is not considered secured until the recipient and driver both commit.
3. The primary and backup assignments are stored together.
4. Failover reuses the reserved backup rather than running an entirely new search.
5. Capacity is time-aware through `accepting`, `capacity`, `openUntil`, and `lastCapacityUpdatedAt`.

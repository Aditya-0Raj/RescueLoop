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


# HEALTECH — Person 1 Module

Owns: Login/Authentication + Complete Normal Healthcare Flow (frontend + backend), per the HEALTECH Development Handoff spec.

## Stack
Same as Criksy: React (Vite) + Node.js/Express + MongoDB. AI calls go through the Anthropic API (`claude-sonnet-4-6`), same pattern as your AI fitness chatbot.

## Structure
- `frontend/` — Splash, Login, NormalSearch, HospitalDetails, NearbyHospitals, AIHealthBuddy, AmbulanceBooking
- `backend/` — auth, hospital (Google Places/Maps/Directions — NO hardcoded hospital list), AI, normal ambulance booking

## Setup

### Backend
```
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, GOOGLE_MAPS_API_KEY, ANTHROPIC_API_KEY
npm run dev
```
Runs on `http://localhost:5000`. Health check: `GET /health`.

### Frontend
```
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## API Endpoints (Person 1)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me` (auth required)
- `GET  /api/hospitals/search?query=&lat=&lng=`
- `GET  /api/hospitals/nearby?lat=&lng=&radius=`
- `GET  /api/hospitals/:placeId?lat=&lng=`
- `POST /api/ai/suggest` `{ symptoms }`
- `POST /api/ai/health-buddy` `{ message, history }`
- `POST /api/ambulance/book` (auth required) `{ hospitalId, hospitalName, date, time }`
- `PATCH /api/ambulance/:bookingId/confirm` (auth required)
- `GET  /api/ambulance/my` (auth required)

## Shared contracts respected (Section 19–22 of the spec)
- `User` shape: `{ userId, name, phone }` — returned from login/register/me, matches the contract exactly.
- `Hospital` shape: `{ id, name, rating, phone, address, latitude, longitude, photo, distance }` — normalized from live Google Places/Directions responses, never hardcoded (see `backend/src/integrations/google/placesService.js`).
- API responses follow `{ success, data | message }` everywhere, so Person 2 can consume the same convention.
- Theme: `styles/global.css` defines the CSS variables (`--color-normal`, `--color-emergency`, dark mode via `body.dark`) so Person 2's theme toggle can drive Normal Mode pages without a second theme system.
- Routes used: `/`, `/login`, `/search`, `/hospital/:placeId`, `/nearby-hospitals`, `/ai-health-buddy`, `/ambulance-booking` — Person 2's sidebar/dashboard should route to these paths.

## Not yet wired (needs your input before integration)
- Real Google Maps/Places/Anthropic API keys in `.env`
- Actual logo/icon assets in `public/images/`
- Final theme toggle (owned by Person 2) — this module already reads `body.dark`, so it'll pick it up automatically once Person 2's toggle sets that class.

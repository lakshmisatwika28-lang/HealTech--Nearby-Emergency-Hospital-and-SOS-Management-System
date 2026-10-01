# HEALTECH — Person 1

Person 1 implementation using the same MySQL database/API contracts and the same visual language as Person 2.

## Included
- Splash animation
- Login/register backend
- Dashboard
- Shared Navbar/Sidebar
- Normal Search
- Search results + Hospital Cards
- Hospital Details + call/map/ambulance actions
- Hospital map + nearby hospitals + driving ETA
- AI Health Buddy backend
- Emergency
- Emergency Contacts
- Ambulance Booking
- Recent Emergencies
- Light/dark mode
- Person 2 emergency backend routes preserved

## Shared database
Use the **same MySQL database configuration as Person 2**. Copy Person 2's `backend/.env` into this project's `backend/.env`; do not create a second database.

Person 2 routes remain:
`/api/emergency`, `/api/emergency-trips`, `/api/contacts`, `/api/ambulance`

Added Person 1 routes:
`/api/hospitals/search`, `/api/hospitals/nearby`, `/api/hospitals/:placeId`, `/api/hospitals/directions`, `/api/ai/chat`, `/api/auth/register`, `/api/auth/login`, `/api/dashboard/summary`.

## Run backend
```powershell
cd backend
npm install
npm run dev
```

## Run frontend
```powershell
cd frontend
npm install
npm run dev
```

Frontend defaults to `http://localhost:5173`; backend defaults to `http://localhost:5000`.

## Environment
Create `frontend/.env`:
`VITE_API_URL=http://localhost:5000/api`

Create `backend/.env` using the exact database/Google/Twilio values from Person 2.

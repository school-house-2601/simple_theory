# SimpleTheory

SimpleTheory is a full-stack music learning platform designed for musicians at every level — from picking up an instrument for the first time to mastering production and music business. Features include curated video lessons, interactive sheet music, a gamified XP system, daily goals, and a personalized dashboard.

🌐 **Live app:** [simple-theory-client.vercel.app](https://simple-theory-client.vercel.app)

---

## Features

- 🎵 **Three learning paths** — Novice, Intermediate, and Professional
- 📹 **Browse & search** YouTube tutorials by instrument (Theory, Piano, Guitar, Drums, Vocals, Production)
- 🎼 **Interactive sheet music** via Flat.io embedded notation player
- ⚡ **XP & leveling system** — earn XP by watching videos and completing lessons
- 🔥 **Login streaks & daily goals** — stay consistent and earn bonus XP
- 📊 **Personal dashboard** — XP history, skill distribution, progress tracking, saved items, and recommendations
- 🔖 **Save videos** for later, per account
- 👤 **Profile page** — edit name, upload photo, change password, toggle dark/light mode
- 🔐 **Google OAuth + email/password auth**
- 🧪 **44 tests** — 25 Playwright frontend tests + 19 backend API tests

---

## Tech Stack

**Frontend:** React, Vite, React Router, Recharts, Playwright
**Backend:** Node.js, Express, PostgreSQL, Passport.js, JWT, bcrypt
**Testing:** Playwright (frontend E2E), Vitest + Supertest (backend API)
**Caching:** Upstash Redis — YouTube search results and Flat.io scores are cached for 24 hours to reduce API quota usage and improve response times
**Services:** Neon (PostgreSQL), YouTube Data API v3, Flat.io API, Vercel

---

## Caching Strategy

SimpleTheory uses **Upstash Redis** as a serverless Redis cache to optimize API performance:

- **YouTube search results** — cached for 24 hours per query (`yt:<query>` key). Saves YouTube Data API quota and speeds up repeat searches.
- **Flat.io sheet music results** — cached for 24 hours per query (`flat:<query>` key). Reduces latency on the lesson and browse pages.

When a cached result exists, the server returns it instantly without hitting the external API. Cache misses trigger a fresh API call which is then stored for future requests.

---

## Project Structure

```
simple-theory/
│
├── server/                        # Backend (Node/Express/PostgreSQL)
│   ├── index.js                   # Entry point (app.listen)
│   ├── app.js                     # Express app, CORS, Passport, Google OAuth
│   ├── vitest.config.js           # Vitest configuration for backend tests
│   ├── .env                       # API keys & DB credentials (not committed)
│   │
│   ├── tests/
│   │   └── api.test.js            # 19 backend API tests (auth, protected routes, security)
│   │
│   ├── api/
│   │   └── routes/
│   │       ├── users.js           # Auth, profile, password, bookmarks, interests
│   │       ├── lessons.js         # YouTube search, Flat.io search (Redis cached)
│   │       ├── progress.js        # XP awarding & video completion
│   │       ├── stats.js           # Dashboard stats
│   │       ├── xp.js              # XP transactions
│   │       └── bookmarks.js       # Bookmark management
│   │
│   ├── db/
│   │   ├── schema.sql             # Table definitions
│   │   ├── seed.js                # Seed data
│   │   ├── db.js                  # PostgreSQL pool connection
│   │   └── queries/
│   │       ├── userQueries.js     # User CRUD, XP, streaks, daily goals
│   │       ├── contentQueries.js  # Lesson/content lookups
│   │       └── progressQueries.js # Progress tracking & level up logic
│   │
│   ├── middleware/
│   │   ├── getUserFromToken.js    # JWT verification middleware
│   │   ├── requireUser.js         # Protected route guard
│   │   └── requireBody.js         # Request body validation + bodyIdMatchesSession
│   │
│   └── utils/
│       └── jwt.js                 # createToken / verifyToken
│
├── client/                        # Frontend (React + Vite)
│   ├── vite.config.js
│   ├── playwright.config.js       # E2E test config
│   │
│   ├── tests/                     # Playwright test suite (25 tests)
│   │   ├── navigation.spec.js     # Page routing & search bar
│   │   ├── auth.spec.js           # Login, register, credentials
│   │   ├── browse.spec.js         # Video pills, saved tab, save button
│   │   ├── lessons.spec.js        # Lesson cards, resources, progress
│   │   ├── guest-vs-loggedin.spec.js  # Auth-gated UI behavior
│   │   ├── profile.spec.js        # Profile page, dark mode, progress bar
│   │   └── helpers.js             # skipSplash + loginAsTestUser helpers
│   │
│   └── src/
│       ├── App.jsx                # Routes
│       ├── main.jsx               # Entry point
│       ├── index.css              # Global CSS variables & resets
│       ├── mockData.js            # Fallback mock video data
│       ├── Error404.jsx           # 404 page
│       │
│       ├── shared/
│       │   └── components/
│       │       ├── Navbar.jsx / .css       # Global navigation + avatar dropdown
│       │       ├── Layout.jsx              # Route guard & sidebar logic
│       │       ├── Sidebar.jsx / .css      # Dashboard sidebar
│       │       ├── Footer.jsx / .css       # Global footer
│       │       ├── HowItWorks.jsx / .css   # How it works page
│       │       └── ProtectedRoute.jsx      # Auth-protected route wrapper
│       │
│       └── features/
│           ├── 01-Landing/
│           │   ├── LandingPage.jsx         # Splash / enter screen
│           │   └── Landing.css
│           │
│           ├── 02-Selection/
│           │   ├── SelectionPage.jsx       # Path selection + Google OAuth token handler
│           │   ├── PathCard.jsx
│           │   └── Selection.css
│           │
│           ├── 03-Dashboard/
│           │   ├── DashboardPage.jsx       # Main dashboard
│           │   ├── Dashboard.css
│           │   ├── XPChart.jsx / .css      # XP history chart
│           │   ├── SkillRadar.jsx / .css   # Skill distribution radar
│           │   ├── StatsCards.jsx          # Level, XP, streak, path cards
│           │   ├── DailyGoals.jsx / .css   # Daily goal tracking
│           │   ├── SavedItems.jsx / .css   # Saved videos panel
│           │   ├── LearningJourney.jsx / .css  # Progress timeline
│           │   └── Recommended.jsx / .css  # Recommended lesson widget
│           │
│           ├── 04-Learning/
│           │   ├── LessonPage.jsx / .css   # Structured lesson curriculum
│           │   └── VideoPlayer.jsx / .css  # Browse videos + Flat.io sheet music
│           │
│           ├── 05-Auth/
│           │   ├── AuthContext.jsx         # Global auth state (token, user, login, logout)
│           │   ├── LoginForm.jsx           # Email/password + Google login
│           │   ├── Register.jsx            # Registration form
│           │   ├── AuthPage.jsx
│           │   └── Auth.css
│           │
│           └── 06-Profile/
│               ├── ProfilePage.jsx         # Profile editing, photo upload, theme toggle
│               └── ProfilePage.css
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL (local) or Neon account
- YouTube Data API v3 key
- Google OAuth credentials
- Upstash Redis account

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/simple_theory.git
cd simple_theory

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Variables

**`server/.env`:**

```
DATABASE_URL=postgres://localhost:5432/simple_theory
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:5173
YOUTUBE_API_KEY=your_youtube_api_key
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**`client/.env`:**

```
VITE_API_URL=http://localhost:3000
```

### VS Code Setup (Recommended)

Install these extensions for automatic formatting on save:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) by Microsoft
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) by Prettier

The `.vscode/settings.json` file is included in the repo and will automatically configure format-on-save for you once the extensions are installed.

To manually lint or format:

```bash
# From /client or /server
npm run lint     # check for errors
npm run format   # auto-fix formatting
```

### Database Setup

```bash
cd server
psql -U postgres -d simple_theory -f db/schema.sql
```

### Running Locally

```bash
# Terminal 1 — Backend (from /server)
npm run dev

# Terminal 2 — Frontend (from /client)
npm run dev
```

App runs at `http://localhost:5173`

### Running Frontend Tests

```bash
# Make sure both servers are running first, then from /client:
npx playwright test
```

**Expected:** 25 tests passing ✅

> **Note:** The login tests require a `testuser2@test.com` account to exist in your local database. Register at `/register` if it doesn't exist, then update the password in `auth.spec.js` and `profile.spec.js` to match.

### Running Backend Tests

```bash
# From /server (server does NOT need to be running):
npm test
```

**Expected:** 19 tests passing ✅

Covers:

- Registration & login validation
- Protected routes rejecting unauthenticated requests
- Authenticated routes working with valid token
- `bodyIdMatchesSession` blocking user ID spoofing
- Google OAuth redirect and user status

> **Note:** Requires the same `testuser2@test.com` account in your local database.

---

## Deployment

- **Frontend:** Vercel — `simple-theory-client.vercel.app`
- **Backend:** Vercel — `simple-theory.vercel.app`
- **Database:** Neon (PostgreSQL)
- **Cache:** Upstash Redis

---

## Team

Built by Sarah Hopp, Joseph Pena, & Jaison Davis @ Fullstack Academy

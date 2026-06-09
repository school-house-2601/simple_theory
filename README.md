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
- 🧪 **26 Playwright end-to-end tests**

---

## Tech Stack

**Frontend:** React, Vite, React Router, Recharts, Playwright  
**Backend:** Node.js, Express, PostgreSQL, Passport.js, JWT, bcrypt  
**Services:** Neon (PostgreSQL), Upstash (Redis cache), YouTube Data API v3, Flat.io API, Vercel

---

## Project Structure

```
simple-theory/
│
├── server/                        # Backend (Node/Express/PostgreSQL)
│   ├── index.js                   # Entry point (app.listen)
│   ├── app.js                     # Express app, CORS, Passport, Google OAuth
│   ├── .env                       # API keys & DB credentials (not committed)
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
│   │   └── requireBody.js         # Request body validation
│   │
│   └── utils/
│       └── jwt.js                 # createToken / verifyToken
│
├── client/                        # Frontend (React + Vite)
│   ├── vite.config.js
│   ├── playwright.config.js       # E2E test config
│   │
│   ├── tests/                     # Playwright test suite (26 tests)
│   │   ├── navigation.spec.js     # Page routing & search bar
│   │   ├── auth.spec.js           # Login, register, credentials
│   │   ├── browse.spec.js         # Video pills, saved tab, save button
│   │   ├── lessons.spec.js        # Lesson cards, resources, progress
│   │   ├── guest-vs-loggedin.spec.js  # Auth-gated UI behavior
│   │   ├── profile.spec.js        # Profile page, dark mode, progress bar
│   │   └── helpers.js             # skipSplash utility
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

### Running Tests

```bash
# Make sure both servers are running first, then from /client:
npx playwright test
```

**Expected:** 26 tests passing ✅

> **Note:** The login test requires a `testuser2@test.com` account to exist in your local database. Register at `/register` if it doesn't exist, then update the password in `auth.spec.js` and `profile.spec.js` to match.

---

## Deployment

- **Frontend:** Vercel — `simple-theory-client.vercel.app`
- **Backend:** Vercel — `simple-theory.vercel.app`
- **Database:** Neon (PostgreSQL)
- **Cache:** Upstash Redis

---

## Team

Built by Sarah Hopp, Joseph Pena, & Jaison Davis @ Fullstack Academy

simple-theory/
│
├── server/
│ ├── index.js # Entry point (app.listen)
│ ├── app.js # Express app, CORS, Passport, Google OAuth
│ ├── vitest.config.js # Vitest configuration for backend tests
│ ├── .env # API keys & DB credentials (not committed)
│ │
│ ├── tests/
│ │ └── api.test.js # 19 backend API tests (auth, protected routes, security)
│ │
│ ├── api/routes/
│ │ ├── users.js # Auth, profile, password, bookmarks, interests
│ │ ├── lessons.js # YouTube search, Flat.io search (Redis cached)
│ │ ├── progress.js # XP awarding & video completion
│ │ ├── stats.js # Dashboard stats
│ │ ├── xp.js # XP transactions
│ │ └── bookmarks.js # Bookmark management
│ │
│ ├── db/
│ │ ├── schema.sql # Table definitions
│ │ ├── seed.js # Seed data
│ │ ├── db.js # PostgreSQL pool connection
│ │ ├── data/
│ │ │ └── scoresData.js # Curated Flat.io score collections by instrument
│ │ └── queries/
│ │ ├── userQueries.js # User CRUD, XP, streaks, daily goals
│ │ ├── contentQueries.js # Lesson/content lookups
│ │ └── progressQueries.js # Progress tracking & level up logic
│ │
│ ├── middleware/
│ │ ├── getUserFromToken.js # JWT verification middleware
│ │ ├── requireUser.js # Protected route guard
│ │ └── requireBody.js # Request body validation + bodyIdMatchesSession
│ │
│ └── utils/
│ └── jwt.js # createToken / verifyToken
│
├── client/
│ ├── vite.config.js
│ ├── playwright.config.js
│ │
│ ├── tests/
│ │ ├── auth.spec.js # Login, register, credentials
│ │ ├── browse.spec.js # Video pills, saved tab, save button
│ │ ├── lessons.spec.js # Lesson cards, resources, progress
│ │ ├── navigation.spec.js # Page routing & search bar
│ │ ├── guest-vs-loggedin.spec.js # Auth-gated UI behavior
│ │ ├── profile.spec.js # Profile page, dark mode, progress bar
│ │ └── helpers.js # skipSplash + loginAsTestUser helpers
│ │
│ └── src/
│ ├── App.jsx # Routes
│ ├── main.jsx # Entry point
│ ├── index.css # Global CSS variables & resets
│ ├── mockData.js # Fallback mock video data
│ ├── Error404.jsx # 404 page
│ │
│ ├── data/
│ │ ├── browseData.js # Instrument pills + search queries for Browse page
│ │ ├── howItWorksData.js # Steps, features, and path cards for How It Works page
│ │ ├── lessonData.js # Curriculum and resource data for all three learning paths
│ │ ├── mockData.js # Fallback mock YouTube video data
│ │ └── profileData.js # Level colors, XP goals, and next level mappings
│ │
│ ├── shared/components/
│ │ ├── Navbar.jsx / .css # Global navigation + avatar dropdown
│ │ ├── Layout.jsx # Route guard & sidebar logic
│ │ ├── Sidebar.jsx / .css # Dashboard sidebar
│ │ ├── Footer.jsx / .css # Global footer
│ │ ├── HowItWorks.jsx / .css # How it works page
│ │ └── ProtectedRoute.jsx # Auth-protected route wrapper
│ │
│ └── features/
│ ├── Auth/
│ │ ├── AuthContext.jsx # Global auth state (token, user, login, logout)
│ │ ├── LoginForm.jsx # Email/password + Google login
│ │ ├── Register.jsx # Registration form with instrument selection
│ │ └── Auth.css
│ │
│ ├── Dashboard/
│ │ ├── DashboardPage.jsx / .css # Main dashboard layout
│ │ ├── XPChart.jsx / .css # XP history chart
│ │ ├── SkillRadar.jsx / .css # Skill distribution radar
│ │ ├── StatsCards.jsx / .css # Level, XP, streak, path cards
│ │ ├── DailyGoals.jsx / .css # Daily goal tracking
│ │ ├── SavedItems.jsx / .css # Saved videos panel
│ │ ├── LearningJourney.jsx / .css # Progress timeline
│ │ └── RecommendedCard.jsx / .css # Recommended lesson widget
│ │
│ ├── Landing/
│ │ ├── LandingPage.jsx # Splash / enter screen
│ │ └── Landing.css
│ │
│ ├── Learning/
│ │ ├── LessonPage.jsx / .css # Structured lesson curriculum
│ │ └── VideoPlayer.jsx / .css # Browse videos + Flat.io sheet music
│ │
│ ├── Practice/
│ │ ├── PracticePage.jsx / .css # Practice room main page
│ │ ├── SongBrowser.jsx / .css # Flat.io song search
│ │ ├── SongPlayer.jsx / .css # Play-along interface
│ │ ├── components/
│ │ │ ├── AccuracyMeter.jsx / .css # Real-time accuracy display
│ │ │ ├── FallingNotes.jsx / .css # Falling notes game
│ │ │ ├── NoteDetector.jsx # Pitch detection via microphone
│ │ │ └── ResultsModal.jsx / .css # Session results + XP awarded
│ │ └── instruments/
│ │ ├── DrumDetector.jsx # Drum beat detection
│ │ ├── GuitarDetector.jsx # Guitar note detection
│ │ ├── PianoDetector.jsx # Piano note detection
│ │ ├── VocalDetector.jsx # Vocal pitch detection
│ │ └── ProductionQuiz.jsx # Production knowledge quiz
│ │
│ ├── Profile/
│ │ ├── ProfilePage.jsx # Profile editing, photo upload, theme toggle
│ │ └── ProfilePage.css
│ │
│ ├── Selection/
│ │ ├── SelectionPage.jsx # Path selection + Google OAuth token handler
│ │ ├── PathCard.jsx # Individual path card component
│ │ └── Selection.css
│ │
│ └── Settings/
│ ├── SettingsPage.jsx # Learning path + instrument preferences
│ └── SettingsPage.css
│
└── README.md

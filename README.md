# simple theory

Simple Theory is a music website/app designed for people who are trying to learn to play music on any instrument. We have teaching videos, a game-like learning experience, and more!

# How it's done

```simple-theory/
├── server/                        # BACKEND (Node/Express/SQL)
│   ├── .env                       # API Keys & DB Credentials
│   ├── index.js                   # Entry point (App.listen)
│   ├── package.json
│   │
│   ├── config/                    # Configuration Layer
│   │   └── db.js                  # PostgreSQL Pool connection logic
│   │
│   ├── db/                        # DATA LAYER
│   │   ├── schema.sql             # Table creation scripts
│   │   └── queries/               # Dedicated SQL functions
│   │       ├── userQueries.js     # XP, Streaks, Auth logic
│   │       ├── contentQueries.js  # YouTube/Flat ID lookups
│   │       └── progressQueries.js # Mark complete / Level up logic
│   │
│   └── api/                       # ROUTE LAYER
│       ├── middleware/            # Auth (JWT) & Validation
│       └── routes/                # Express Route Definitions
│           ├── auth.js            # /api/auth
│           ├── lessons.js         # /api/lessons
│           └── stats.js           # /api/stats

│   └── middleware/                # ROUTE LAYER
│           ├── getUserFromToken.js            # /api/auth
│           ├── requireBody.js         # /api/lessons
│           └── requireUser.js           # /api/stats
│
├── client/                        # FRONTEND (React/Vite)
│   ├── package.json
│   ├── vite.config.js             # Proxy settings
│   ├── src/
│   │   ├── main.jsx               # Entry point
│   │   ├── App.jsx                # Router & Global Layout
│   │   ├── index.css              # GLOBAL CSS (Colors, Fonts, Resets)
│   │   │
│   │   ├── shared/                # Global UI components
│   │   │   ├── components/        # Navbar, Footer, Buttons
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css     # Styles for navigation bar
│   │   │   └── context/           # UserContext for XP/Auth state
│   │   │       └── UserContext.js
│   │   │
│   │   └── features/              # PAGE-BASED FOLDERS
│   │       ├── 01-Landing/        # The "Enter" Screen
│   │       │   ├── LandingPage.jsx
│   │       │   └── Landing.css     # CSS for the landing animations
│   │       │
│   │       ├── 02-Selection/      # Novice/Inter/Pro Choice
│   │       │   ├── SelectionPage.jsx
│   │       │   ├── PathCard.jsx
│   │       │   └── Selection.css   # CSS for path cards
│   │       │
│   │       ├── 03-Dashboard/      # User Stats & Progress
│   │       │   ├── DashboardPage.jsx
│   │       │   ├── XPChart.jsx
│   │       │   └── Dashboard.css   # CSS for stats and charts
│   │       │
│   │       ├── 04-Learning/       # The Lesson Interface
│   │       │   ├── LessonPage.jsx
│   │       │   ├── VideoPlayer.jsx
│   │       │   ├── FlatNotation.jsx
│   │       │   └── Learning.css    # CSS for video/notation layout
│   │       │
│   │       └── 05-Auth/            # Login & Register
│   │           ├── AuthPage.jsx
│   │           ├── LoginForm.jsx
│   │           └── Auth.css        # CSS for login forms
│   │
│   └── public/                    # Static icons/instrument images
│
└── README.md                      # Project setup & documentation
```

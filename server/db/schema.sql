DROP TABLE IF EXISTS daily_goals CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS play_sessions CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_level CASCADE;
DROP TYPE IF EXISTS content_type CASCADE;


CREATE TYPE user_level AS ENUM ('Novice', 'Intermediate', 'Professional');
CREATE TYPE content_type AS ENUM ('Video', 'Notation', 'Plugin');


-- 1. USERS: The heart of the gamification
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
firstname VARCHAR(50),
lastname VARCHAR(50),
profile_photo TEXT,
interests TEXT[],
selected_path user_level DEFAULT 'Novice',
current_level user_level DEFAULT 'Novice',
instrument VARCHAR(50) NOT NULL,
total_xp INTEGER DEFAULT 0,
current_streak INTEGER DEFAULT 0,
last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CONTENT: Lessons, Sheet Music, and Plugins
CREATE TABLE content (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
type content_type NOT NULL,
difficulty user_level NOT NULL,
instrument VARCHAR(50),
external_url TEXT,
thumbnail_url TEXT,
description TEXT,
xp_reward INTEGER DEFAULT 100
);


-- 3. USER_PROGRESS: Tracks what a user has completed
CREATE TABLE user_progress (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(user_id, content_id)
);


-- 4. BOOKMARKS: The "Saved Items" page logic
CREATE TABLE bookmarks (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(user_id, content_id)
);

-- 5. SESSIONS: Plays the session
CREATE TABLE play_sessions(
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
accuracy_score NUMERIC(5,2),
xp_earned INTEGER DEFAULT 0,
skill_category VARCHAR(50),
played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Goals: gives goals to the user
CREATE TABLE daily_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL,
    goal_label VARCHAR(255) NOT NULL,
    target INTEGER NOT NULL,
    current INTEGER DEFAULT 0,
    bonus_xp INTEGER DEFAULT 50,
    completed BOOLEAN DEFAULT FALSE,
    date DATE DEFAULT CURRENT_DATE
);
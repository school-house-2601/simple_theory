import db from "#db/db";

/**creates a new user */
/** Creates a new user with extended profile data */
export async function createUser({
  username,
  email,
  password_hash,
  firstname,
  lastname,
  interests,
  selected_path = "Novice",
  current_level = "Novice",
}) {
  const {
    rows: [user],
  } = await db.query(
    `INSERT INTO users (
      username, email, password_hash, firstname, lastname, interests, selected_path, current_level
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, username, email, firstname, lastname, interests, selected_path, current_level, total_xp`,
    [
      username,
      email,
      password_hash,
      firstname,
      lastname,
      interests,
      selected_path,
      current_level,
    ],
  );
  return user;
}

/**finds a user by ID and shows their progress stats */
export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query(
    "SELECT id, username, email, firstname, lastname, interests, selected_path, current_level, total_xp, current_streak, created_at FROM users WHERE id = $1",
    [id],
  );
  return user;
}

/** Finds a user by username for login */
export async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  return user;
}

/**udates user XP, use this when they finish a lesson */
export async function updateUserXP(userId, xpAmount) {
  const {
    rows: [user],
  } = await db.query(
    "UPDATE users SET total_xp = total_xp + $1 WHERE id = $2 RETURNING total_xp",
    [xpAmount, userId],
  );
  return user;
}

/** Updates the user's selected learning path (Novice/Intermediate/Professional) */
export async function updateSelectedPath(userId, path) {
  const {
    rows: [user],
  } = await db.query(
    "UPDATE users SET selected_path = $1 WHERE id = $2 RETURNING selected_path",
    [path, userId],
  );
  return user;
}

/** Gets all bookmarked content for a specific user (Shows titles/thumbnails) */
export async function getBookmarkedContent(userId) {
  const { rows } = await db.query(
    `SELECT c.* FROM content c
     JOIN bookmarks b ON c.id = b.content_id
     WHERE b.user_id = $1`,
    [userId],
  );
  return rows;
}

/** Saves or removes a bookmark (Toggle logic) */
export async function toggleBookmark(userId, contentId) {
  // Check if bookmark already exists
  const { rowCount } = await db.query(
    "SELECT 1 FROM bookmarks WHERE user_id = $1 AND content_id = $2",
    [userId, contentId],
  );

  if (rowCount > 0) {
    // If it exists, delete it
    await db.query(
      "DELETE FROM bookmarks WHERE user_id = $1 AND content_id = $2",
      [userId, contentId],
    );
    return { bookmarked: false };
  } else {
    // If it doesn't exist, create it
    await db.query(
      "INSERT INTO bookmarks (user_id, content_id) VALUES ($1, $2)",
      [userId, contentId],
    );
    return { bookmarked: true };
  }
}

/** Records a play session (Play-Along results) */
export async function recordPlaySession(userId, contentId, accuracy, xp) {
  const {
    rows: [session],
  } = await db.query(
    `INSERT INTO play_sessions (user_id, content_id, accuracy_score, xp_earned)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, contentId, accuracy, xp],
  );
  return session;
}

/** gets full stats for the dashboard */
export async function getUserStats(userId) {
  const {
    rows: [stats],
  } = await db.query(
    `SELECT
      u.username,
      u.selected_path,
      u.current_level,
      u.total_xp,
      u.current_streak,
      COUNT(DISTINCT up.id) AS completed_count,
      ROUND(AVG(ps.accuracy_score), 2) AS avg_accuracy
    FROM users u
    LEFT JOIN user_progress up ON up.user_id = u.id
    LEFT JOIN play_sessions ps ON ps.user_id = u.id
    WHERE u.id = $1
    GROUP BY u.username, u.selected_path, u.current_level, u.total_xp, u.current_streak`,
    [userId],
  );
  return stats;
}

export async function getUserBookmarks(userId) {
  const { rows } = await db.query(
    `SELECT c.id, c.title, c.type, c.external_url, c.thumbnail_url
    FROM bookmarks b
    JOIN content c ON c.id = b.content_id
    WHERE b.user_id = $1
    ORDER BY b.saved_at DESC`,
    [userId],
  );
  return rows;
}

export async function getUserProgress(userId) {
  const { rows } = await db.query(
    `SELECT
      up.id,
      c.title,
      c.type,
      c.difficulty,
      c.xp_reward,
      up.completed_at
    FROM user_progress up
    JOIN content c ON c.id = up.content_id
    WHERE up.user_id = $1
    ORDER BY up.completed_at DESC
    LIMIT 10`,
    [userId],
  );
  return rows;
}

export async function getUserXPHistory(userId) {
  const { rows } = await db.query(
    `SELECT
      TO_CHAR(played_at, 'Dy') AS day,
      SUM(xp_earned) AS xp
    FROM play_sessions
    WHERE user_id = $1
    AND played_at >= NOW() - INTERVAL '7 days'
    GROUP BY TO_CHAR(played_at, 'Dy'), DATE(played_at)
    ORDER BY DATE(played_at) ASC`,
    [userId],
  );
  return rows;
}

export async function updateLoginStreak(userId) {
  const {
    rows: [user],
  } = await db.query(
    `UPDATE users
    SET current_streak = CASE
      WHEN last_login::date = CURRENT_DATE THEN current_streak
      WHEN last_login::date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak + 1
      ELSE 1
    END,
    last_login = NOW()
    WHERE id = $1
    RETURNING current_streak`,
    [userId],
  );
  return user;
}

export async function getUserSkillDistribution(userId) {
  const { rows } = await db.query(
    `SELECT
      skill_category,
      COUNT(*) as sessions,
      SUM(xp_earned) as total_xp
    FROM play_sessions
    WHERE user_id = $1
    AND skill_category IS NOT NULL
    GROUP BY skill_category`,
    [userId],
  );
  return rows;
}

export async function getDailyGoals(userId) {
  const { rows: existing } = await db.query(
    `SELECT * FROM daily_goals
    WHERE user_id = $1 AND date = CURRENT_DATE`,
    [userId],
  );

  if (existing.length > 0) return existing;

  const {
    rows: [user],
  } = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);

  const { rows: skills } = await db.query(
    `SELECT skill_category, SUM(xp_earned) as total_xp
    FROM play_sessions
    WHERE user_id = $1
    GROUP BY skill_category
    ORDER BY total_xp ASC
    LIMIT 1`,
    [userId],
  );

  const weakestSkill = skills[0]?.skill_category || "Theory";

  const goals = [
    {
      goal_type: "watch_videos",
      goal_label: "Watch 3 videos today",
      target: 3,
      bonus_xp: 50,
    },
    {
      goal_type: "weak_skill",
      goal_label: `Watch a ${weakestSkill} video`,
      target: 1,
      bonus_xp: 75,
    },
    {
      goal_type: "xp_goal",
      goal_label: `Earn 30 XP today`,
      target: 30,
      bonus_xp: 100,
    },
  ];

  const inserted = await Promise.all(
    goals.map((goal) =>
      db
        .query(
          `INSERT INTO daily_goals
        (user_id, goal_type, goal_label, target, bonus_xp)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
          [userId, goal.goal_type, goal.goal_label, goal.target, goal.bonus_xp],
        )
        .then((r) => r.rows[0]),
    ),
  );

  return inserted;
}

export async function updateDailyGoals(userId, xpEarned, skillCategory) {
  console.log("updateDailyGoals called:", userId, xpEarned, skillCategory);

  const { rows: goals } = await db.query(
    `SELECT * FROM daily_goals
    WHERE user_id = $1 AND date = CURRENT_DATE AND completed = FALSE`,
    [userId],
  );

  console.log("Goals found:", goals);

  for (const goal of goals) {
    let increment = 0;

    if (goal.goal_type === "watch_videos") increment = 1;
    if (
      goal.goal_type === "weak_skill" &&
      goal.goal_label.includes(skillCategory)
    )
      increment = 1;
    if (goal.goal_type === "xp_goal") increment = xpEarned;

    if (increment === 0) continue;

    const newCurrent = Math.min(goal.current + increment, goal.target);
    const completed = newCurrent >= goal.target;

    await db.query(
      `UPDATE daily_goals
      SET current = $1, completed = $2
      WHERE id = $3`,
      [newCurrent, completed, goal.id],
    );

    if (completed) {
      await db.query(
        `UPDATE users SET total_xp = total_xp + $1 WHERE id = $2`,
        [goal.bonus_xp, userId],
      );
    }
  }

  return getDailyGoals(userId);
}

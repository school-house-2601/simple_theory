import db from "#db/db";

/**creates a new user */
export async function createUser(
  username,
  email,
  password_hash,
  selected_path,
  current_level,
) {
  const {
    rows: [user],
  } = await db.query(
    `INSERT INTO users (username, email, password_hash, selected_path, current_level)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, email, selected_path, current_level, total_xp`,
    [username, email, password_hash, selected_path, current_level],
  );
  return user;
}

/**finds a user by ID and shows their progress stats */
export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query(
    "SELECT id, username, email, selected_path, current_level, total_xp, current_streak FROM users WHERE id = $1",
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

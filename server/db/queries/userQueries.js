import db from "#db/client";

/**creates a new user */
export async function createUser(username, email, password_hash, selected_path) {
  const {
    rows: [user],
  } = await db.query(
    `INSERT INTO users (username, email, password_hash, selected_path, current_level)
        VALUES ($1, $2, $3, $4, $4)
        RETURNING id, username, email, selected_path, current_level, total_xp`,
    [username, email, password_hash, selected_path],
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

/**udates user XP, use this when they finish a lesson */
export async function updateUserXP(userId, xpAmount) {
  const {
    rows: [user],
  } = await db.query(
    "UPDATE users SET total_xp = total_xp + $1 WHERE id = $2 RETURNING total_xp",
    [userId, xpAmount],
  );
  return user;
}
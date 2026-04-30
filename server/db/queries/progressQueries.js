import db from "#db/db";

export async function completeContent(userId, contentId) {
  const progressResult = await db.query(
    `INSERT INTO user_progress (user_id, content_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, content_id) DO NOTHING
        RETURNING *;`,
    [userId, contentId],
  );

  if (progressResult.rowCount === 0) {
    return { alreadyCompleted: true };
  }

  const {
    rows: [content],
  } = await db.query(`SELECT xp_reward FROM content WHERE id = $1;`, [
    contentId,
  ]);

  if (!content) throw new Error("Content not found");

  const {
    rows: [user],
  } = await db.query(
    `UPDATE users
        SET total_xp = total_xp + $1
        WHERE id = $2
        RETURNING *;`,
    [content.xp_reward, userId],
  );

  const newLevel = calculateLevel(user.total_xp);

  if (newLevel !== user.current_level) {
    const {
      rows: [updatedUser],
    } = await db.query(
      `UPDATE users
            SET current_level = $1
            WHERE id = $2
            RETURNING *;`,
      [newLevel, userId],
    );

    return { user: updatedUser, leveledUp: true };
  }

  return { user, leveledUp: false };
}

function calculateLevel(xp) {
  if (xp >= 1500) return "Professional";
  if (xp >= 500) return "Intermediate";
  return "Novice";
}

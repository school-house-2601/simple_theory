import db from "#db/db";

/** gets all content */
export async function getAllContent() {
  const { rows } = await db.query(`
    SELECT *
    FROM content
    ORDER BY id;
  `);

  return rows;
}

/** gets one content item by id */
export async function getContentById(id) {
  const {
    rows: [content],
  } = await db.query(
    `
    SELECT *
    FROM content
    WHERE id = $1;
    `,
    [id],
  );

  return content;
}

/** gets content by difficulty */
export async function getContentByDifficulty(difficulty) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM content
    WHERE difficulty = $1
    ORDER BY id;
    `,
    [difficulty],
  );

  return rows;
}

/** gets content by type */
export async function getContentByType(type) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM content
    WHERE type = $1
    ORDER BY id;
    `,
    [type],
  );

  return rows;
}

/** creates a new content item */
export async function createContent(content) {
  const {
    title,
    type,
    difficulty,
    instrument,
    external_url,
    thumbnail_url,
    description,
    xp_reward,
  } = content;

  const {
    rows: [newContent],
  } = await db.query(
    `
    INSERT INTO content (
      title,
      type,
      difficulty,
      instrument,
      external_url,
      thumbnail_url,
      description,
      xp_reward
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
    `,
    [
      title,
      type,
      difficulty,
      instrument,
      external_url,
      thumbnail_url,
      description,
      xp_reward,
    ],
  );

  return newContent;
}

/** deletes content by id */
export async function deleteContent(id) {
  const {
    rows: [deletedContent],
  } = await db.query(
    `
    DELETE FROM content
    WHERE id = $1
    RETURNING *;
    `,
    [id],
  );

  return deletedContent;
}

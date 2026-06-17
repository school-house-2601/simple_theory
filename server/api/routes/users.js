import express from "express";
import {
  createUser,
  getUserByUsername,
  getUserById,
  updateSelectedPath,
  getBookmarkedContent,
  toggleBookmark,
  updateLoginStreak,
} from "#db/queries/userQueries";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";
import bcrypt from "bcrypt";
import db from "#db/db";

const router = express.Router();
const SALT_ROUNDS = 10;

router.post(
  "/register",
  requireBody(["email", "password", "firstname", "lastname"]),
  async (req, res, next) => {
    try {
      const { email, password, firstname, lastname, interests, instrument } =
        req.body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await createUser({
        username: email,
        email,
        password_hash: hashedPassword,
        firstname,
        lastname,
        interests:
          interests?.length > 0 ? interests : instrument ? [instrument] : [],
        selected_path: "Novice",
        current_level: "Novice",
      });
      const token = createToken({ id: user.id });
      res.status(201).send({ token, user });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  requireBody(["email", "password"]),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await getUserByUsername(email);

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).send({ message: "Invalid credentials." });
      }

      const token = createToken({ id: user.id });
      res.send({ token, user });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/me", requireUser, async (req, res, next) => {
  try {
    await updateLoginStreak(req.user.id);
    const user = await getUserById(req.user.id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/path",
  requireUser,
  requireBody(["path"]),
  async (req, res, next) => {
    try {
      const updatedUser = await updateSelectedPath(req.user.id, req.body.path);
      res.send(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/bookmarks", requireUser, async (req, res, next) => {
  try {
    const bookmarks = await getBookmarkedContent(req.user.id);
    res.send(bookmarks);
  } catch (error) {
    next(error);
  }
});

router.post("/bookmarks/:contentId", requireUser, async (req, res, next) => {
  try {
    const result = await toggleBookmark(req.user.id, req.params.contentId);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/interests", requireUser, async (req, res, next) => {
  try {
    const { interests } = req.body;
    const {
      rows: [user],
    } = await db.query(
      `UPDATE users SET interests = $1 WHERE id = $2 RETURNING interests`,
      [interests, req.user.id]
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.patch("/me/profile", requireUser, async (req, res, next) => {
  try {
    const { firstname, lastname, email } = req.body;
    const {
      rows: [user],
    } = await db.query(
      `UPDATE users 
       SET firstname = $1, lastname = $2, email = $3
       WHERE id = $4 
       RETURNING id, firstname, lastname, email, username, current_level, total_xp, current_streak, created_at`,
      [firstname, lastname, email, req.user.id]
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.patch("/me/password", requireUser, async (req, res, next) => {
  try {
    const { current, newPass, confirm } = req.body;

    if (newPass !== confirm) {
      return res.status(400).json({ message: "New passwords don't match." });
    }

    if (newPass.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    // Get current password hash
    const {
      rows: [user],
    } = await db.query("SELECT password_hash FROM users WHERE id = $1", [
      req.user.id,
    ]);

    // Verify current password
    const isValid = await bcrypt.compare(current, user.password_hash);
    if (!isValid) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPass, SALT_ROUNDS);
    await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      hashedPassword,
      req.user.id,
    ]);

    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
});

router.delete("/reset", requireUser, async (req, res, next) => {
  try {
    await db.query(
      `UPDATE users
      SET selected_path = 'Novice', current_level = 'Novice',
        total_xp = 0, current_streak = 0
      WHERE id = $1`,
      [req.user.id]
    );

    await db.query(`DELETE FROM daily_goals WHERE user_id = $1`, [req.user.id]);
    await db.query(`DELETE FROM play_sessions WHERE user_id = $1`, [
      req.user.id,
    ]);
    await db.query(`DELETE FROM user_progress WHERE user_id = $1`, [
      req.user.id,
    ]);

    res.json({ success: true, message: "All data reset to Novice" });
  } catch (error) {
    next(error);
  }
});

export default router;

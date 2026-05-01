import express from "express";
import {
  createUser,
  getUserByUsername,
  getUserById,
  updateSelectedPath,
  getBookmarkedContent,
  toggleBookmark,
} from "#db/queries/userQueries";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";
import bcrypt from "bcrypt";

const router = express.Router();
const SALT_ROUNDS = 10;

router.post(
  "/register",
  requireBody(["username", "email", "password", "selected_path"]),
  async (req, res, next) => {
    try {
      const { username, email, password, selected_path } = req.body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await createUser(
        username,
        email,
        hashedPassword,
        selected_path,
        selected_path,
      );
      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await getUserByUsername(username);

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).send("Invalid credentials.");
      }

      const token = createToken({ id: user.id });
      res.send(token);
    } catch (error) {
      next(error);
    }
  },
);

router.get("/me", requireUser, async (req, res, next) => {
  try {
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
  },
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

export default router;

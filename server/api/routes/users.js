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
  requireBody(["email", "password", "firstname", "lastname"]),
  async (req, res, next) => {
    try {
      const { email, password, firstname, lastname, interests } = req.body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await createUser({
        username: email,
        email,
        password_hash: hashedPassword,
        firstname,
        lastname,
        interests: interests || [],
        selected_path: "Novice",
        current_level: "Novice",
      });
      const token = createToken({ id: user.id });
      res.status(201).send({ token, user });
    } catch (error) {
      next(error);
    }
  },
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

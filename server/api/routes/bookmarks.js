import { Router } from "express";
import { getUserBookmarks } from "#db/queries/userQueries";
import requireUser from "#middleware/requireUser";

const router = Router();

router.get("/", requireUser, async (req, res) => {
  try {
    const bookmarks = await getUserBookmarks(req.user.id);
    res.json(bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

export default router;

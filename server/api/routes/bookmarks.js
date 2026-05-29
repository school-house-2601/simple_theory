import { Router } from "express";
import { getUserBookmarks } from "#db/queries/userQueries";

const router = Router();

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const bookmarks = await getUserBookmarks(userId);
        res.json(bookmarks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
});

export default router;
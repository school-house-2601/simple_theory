import { Router } from "express";
import { getUserProgress } from "#db/queries/userQueries";
import { completeVideoWatch } from "#db/queries/progressQueries";

const router = Router();

router.post("/video-complete", async (req, res) => {
    try {
        const { userId, videoId, xpEarned, skillCategory } = req.body;
        const result = await completeVideoWatch(userId, videoId, xpEarned, skillCategory);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to award XP" });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await getUserProgress(userId);
        res.json(progress);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch progress" });
    }
});

export default router;
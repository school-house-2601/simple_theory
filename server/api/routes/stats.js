import { Router } from "express";
import { getUserStats } from "#db/queries/userQueries";

const router = Router();

const XP_THRESHOLDS = {
    Novice: 500,
    Intermediate: 1500,
    Professional: Infinity
};

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const stats = await getUserStats(userId);

        if (!stats) {
            return res.status(404).json({ error: "User not found" });
        }

        const xpToNext = XP_THRESHOLDS[stats.current_level] - stats.total_xp;

        res.json({
            ...stats,
            xp_to_next_level: xpToNext === Infinity ? null : xpToNext
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

export default router;



import { Router } from "express";
import { getUserXPHistory } from "#db/queries/userQueries";

const router = Router();

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await getUserXPHistory(userId);
        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch XP history"});
    }
});

export default router;
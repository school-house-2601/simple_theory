import { Router } from "express";
import { getUserProgress } from "#db/queries/userQueries";
import { completeVideoWatch } from "#db/queries/progressQueries";
import requireUser from "#middleware/requireUser";
import { bodyIdMatchesSession } from "#middleware/requireBody";

const router = Router();

router.post(
  "/video-complete",
  requireUser,
  bodyIdMatchesSession(),
  async (req, res) => {
    try {
      const { userId, videoId, xpEarned, skillCategory } = req.body;
      const result = await completeVideoWatch(
        userId,
        videoId,
        xpEarned,
        skillCategory
      );
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to award XP" });
    }
  }
);

router.get("/", requireUser, async (req, res) => {
  try {
    const progress = await getUserProgress(req.user.id);
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

export default router;

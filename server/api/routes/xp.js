import { Router } from "express";
import { getUserXPHistory } from "#db/queries/userQueries";
import requireUser from "#middleware/requireUser";

const router = Router();

router.get("/", requireUser, async (req, res) => {
  try {
    const history = await getUserXPHistory(req.user.id);
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch XP history" });
  }
});

export default router;

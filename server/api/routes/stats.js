import { Router } from "express";
import { getUserStats, getUserSkillDistribution, getDailyGoals } from "#db/queries/userQueries";
import db from "#db/db";

const router = Router();

const XP_THRESHOLDS = {
    Novice: 3000,
    Intermediate: 5000,
    Professional: Infinity
};

router.get("/skills/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const skills = await getUserSkillDistribution(userId);
        res.json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch skill distribution" });
    }
});

router.get("/goals/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const goals = await getDailyGoals(userId);
        res.json(goals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch goals" });
    }
});

router.get("/recommendations/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const { rows: [user] } = await db.query(
            `SELECT selected_path, current_level FROM users WHERE id = $1`,
            [userId]
        );

        const { rows: skills } = await db.query(
            `SELECT skill_category, SUM(xp_earned) as total_xp, COUNT(*) as sessions
            FROM play_sessions
            WHERE user_id = $1 AND skill_category IS NOT NULL
            GROUP BY skill_category
            ORDER BY total_xp ASC`,
            [userId]
        );

        const { rows: mostWatched } = await db.query(
            `SELECT skill_category, COUNT(*) as sessions
            FROM play_sessions
            WHERE user_id = $1 AND skill_category IS NOT NULL
            GROUP BY skill_category
            ORDER BY sessions DESC
            LIMIT 1`,
            [userId]
        );

        const weakestSkill = skills[0]?.skill_category || "Theory";
        const favoriteSkill = mostWatched[0]?.skill_category || user.selected_path;
        const level = user.current_level;

        const pool = [
            {
                title: `${level} ${weakestSkill} Practice`,
                description: `Your ${weakestSkill} needs work. This ${level.toLowerCase()} tutorial will help you catch up.`,
                searchQuery: `${weakestSkill} tutorial for ${level.toLowerCase()} musicians`,
                badge: "Needs Work",
                duration: "30-45 mins",
            },
            {
                title: `Advanced ${favoriteSkill} Techniques`,
                description: `You love ${favoriteSkill}. Take it to the next level with advanced techniques.`,
                searchQuery: `advanced ${favoriteSkill} techniques ${level.toLowerCase()}`,
                badge: "Keep Growing",
                duration: "20-40 mins",
            },
            {
                title: `${user.selected_path} Music Theory`,
                description: `Build your foundation with music theory for ${user.selected_path.toLowerCase()} musicians.`,
                searchQuery: `music theory ${user.selected_path}`,
                badge: "For You",
                duration: "20-30 mins",
            },
            {
                title: `${user.selected_path} Path: Next Steps`,
                description: `Continue your ${user.selected_path} journey with curated tutorials.`,
                searchQuery: `${user.selected_path} music lessons next level`,
                badge: "Your Path",
                duration: "30-50 mins",
            }
        ];

        let recommendation;
        if (skills.length === 0) {
            recommendation = pool[3];
        } else if (weakestSkill !== favoriteSkill) {
            recommendation = pool[0];
        } else {
            recommendation = pool[Math.floor(Math.random() * pool.length)];
        }

        res.json(recommendation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch recommendations" });
    }
});

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



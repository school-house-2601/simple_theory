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
            `SELECT selected_path, current_level, interests FROM users WHERE id = $1`,
            [userId]
        );

        const { rows: skills } = await db.query(
            `SELECT skill_category, SUM(xp_earned) as total_xp, COUNT(*) as sessions
            FROM play_sessions
            WHERE user_id = $1 AND skill_category IS NOT NULL
            GROUP BY skill_category
            ORDER BY sessions DESC`,
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

        const level = user.current_level;
        const userInterests = user.interests || [];
        const dominantSkill = skills.find((s) => Number(s.sessions) >= 5);
        const interestSkills = skills.filter((s) =>
            userInterests.includes(s.skill_category)
        );
        const weakestInterest = interestSkills.length > 0
            ? interestSkills.reduce((a, b) =>
                Number(a.total_xp) < Number(b.total_xp) ? a : b)
            : null;

        let focusSkill;
        let badge;
        let reason;

        if (dominantSkill) {
            focusSkill = dominantSkill.skill_category;
            badge = "Trending For You";
            reason = `You've been watching a lot of ${focusSkill} videos lately`;
        } else if (weakestInterest) {
            focusSkill = weakestInterest.skill_category;
            badge = "Build Your Skills";
            reason = `Your ${focusSkill} needs some work based on your interests`;
        } else if (userInterests.length > 0) {
            focusSkill = userInterests[Math.floor(Math.random() * userInterests.length)];
            badge = "Get Started";
            reason = `Start your ${focusSkill} journey`;
        } else {
            focusSkill = user.selected_path;
            badge = "Recommended";
            reason = `Based on your ${user.selected_path} path`;
        }

        const LEVEL_QUERIES = {
            Novice: "beginner tutorial",
            Intermediate: "intermediate tutorial",
            Professional: "advanced professional tutorial",
        };

        const levelQuery = LEVEL_QUERIES[level] || "tutorial";

        const recommendation = {
            title: `${focusSkill} - ${level} Pick`,
            description: `${reason}. Here's a ${level.toLowerCase()} ${focusSkill} tutorial picked just for you.`,
            searchQuery: `${focusSkill} ${levelQuery}`,
            badge,
            duration: "30-45 mins",
            focusSkill,
        };

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



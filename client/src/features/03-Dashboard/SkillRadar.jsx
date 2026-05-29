import { useEffect, useState } from "react";
import { useAuth } from "../05-Auth/AuthContext";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";
import "./SkillRadar.css";

const ALL_SKILLS = ["Theory", "Piano", "Guitar", "Drums", "Vocals", "Production"];

const SKILL_TIPS = {
    Theory: "Try watching a music theory video to understand scales and chords better.",
    Piano: "Practice your finger placement and try a beginner piano tutorial.",
    Guitar: "Work on chord transitions - try a strumming pattern tutorial.",
    Drums: "Focus on your timing - try a basic beat tutorial with a metronome.",
    Vocals: "Warm up your voice daily - try a vocal exercises tutorial",
    Production: "Learn your DAW basics - try a beginner production tutorial.",
};

export default function SkillRadar() {
    const { user } = useAuth();
    const [data, setData] = useState(ALL_SKILLS.map((s) => ({ skill: s, value: 0})));
    const [focusSkill, setFocusSkill] = useState(null);
    const VIDEOS_TO_MAX = 100;
    const XP_PER_VIDEO = 5;
    const MAX_XP_PER_SKILL = VIDEOS_TO_MAX * XP_PER_VIDEO;

    useEffect(() => {
        if (!user) return;
        
        const fetchSkills = () => {
            fetch(`/api/stats/skills/${user.id}`)
                .then((res) => res.json())
                .then((rows) => {
                    if (!Array.isArray(rows) || rows.length === 0) return;
                    const merged = ALL_SKILLS.map((skill) => {
                        const match = rows.find((r) => r.skill_category === skill);
                        const value = match 
                            ? Math.min(Math.round((Number(match.total_xp) / MAX_XP_PER_SKILL) * 100), 100)
                            : 0;
                        return { skill, value };
                    });
                    setData(merged);
                    const weakest = merged.reduce((a, b) => a.value < b.value ? a : b);
                    setFocusSkill(weakest.skill);
                })
                .catch(() => {});
    };

        fetchSkills();
        const interval = setInterval(fetchSkills, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const strongestSkill = data.reduce((a, b) => a.value > b.value ? a : b);

    return (
        <div className="skill-radar-card">
            <div className="skill-radar-header">
                <div>
                    <h2>Skill Distribution</h2>
                    <p>Your proficiency across musical disciplines</p>
                </div>
                <span className="balanced-badge">📈 Balanced Progress</span>
            </div>
            <div className="skill-radar-body">
                <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={data}>
                        <PolarGrid stroke="#1e1e3a" />
                        <PolarAngleAxis
                            dataKey="skill"
                            tick={{ fill: "#a0a0c0", fontSize: 12 }}
                        />
                        <Radar
                            dataKey="value"
                            stroke="#6c63ff"
                            fill="#6c63ff"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
                <div className="skill-panels">
                    <div className="skill-panel">
                        <span className="panel-icon">🎯</span>
                        <div>
                            <b>Focus Area</b>
                            <p>
                                {focusSkill
                                ? SKILL_TIPS[focusSkill] || `Work on your ${focusSkill} skills today.`
                                : "Watch videos across different categories to build your skills!"}
                            </p>
                        </div>
                    </div>
                    <div className="skill-panel">
                        <span className="panel-icon">🏆</span>
                        <div>
                            <b>Achievement</b>
                            <p>
                                {strongestSkill.value > 0
                                ? `You're strongest in ${strongestSkill.skill}! Keep building on it.`
                                : "Watch videos to start building your skills!"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
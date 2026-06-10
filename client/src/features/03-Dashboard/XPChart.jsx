import { useEffect, useState } from "react";
import { useAuth } from "../05-Auth/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./XPChart.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function XPChart() {
  const { user } = useAuth();
  const [data, setData] = useState(DAYS.map((day) => ({ day, xp: 0 })));

  useEffect(() => {
    if (!user) return;
    fetch(`${import.meta.env.VITE_API_URL}/xp/${user.id}`)
      .then((res) => res.json())
      .then((rows) => {
        if (rows.length === 0) return;
        const merged = DAYS.map((day) => {
          const match = rows.find((r) => r.day === day);
          return { day, xp: match ? Number(match.xp) : 0 };
        });
        setData(merged);
      })
      .catch(() => {});
  }, [user]);

  return (
    <div className="xp-chart-card">
      <div className="xp-chart-header">
        <div>
          <h2>XP Earnings</h2>
          <p>Visualizing your engagement over the last 7 days</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
          <XAxis
            dataKey="day"
            tick={{ fill: "a0a0c0", fontSize: 12 }}
            axisLine={{ stroke: "#1e1e3a" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#a0a0c0", fontSize: 12 }}
            axisLine={{ stroke: "#1e1e3a" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#12122a",
              border: "1px solid #3b3b6b",
              borderRadius: "8px",
              color: "#ffffff",
            }}
            labelStyle={{ color: "#a0a0c0" }}
          />
          <Line
            type="monotone"
            dataKey="xp"
            stroke="#6c63ff"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#6c63ff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

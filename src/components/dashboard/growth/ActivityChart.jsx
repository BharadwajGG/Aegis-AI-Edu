import React from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

const data = [
  { day: "Mon", focus: 2.1 },
  { day: "Tue", focus: 3.4 },
  { day: "Wed", focus: 1.8 },
  { day: "Thu", focus: 4.2 },
  { day: "Fri", focus: 3.9 },
  { day: "Sat", focus: 5.1 },
  { day: "Sun", focus: 4.5 },
];

export function ActivityChart({ t, accent, cardStyle }) {
  return (
    <motion.div layout className="bento-card md-col-span-3" style={{ ...cardStyle, padding: 24, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 9, color: "var(--text-subtle)", letterSpacing: 2, marginBottom: 16 }}>
        {t.focusTime.toUpperCase()} / VELOCITY
      </div>
      <div style={{ flex: 1, minHeight: 120, position: "relative", margin: "0 -10px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 'dataMax']} />
            <Area type="monotone" dataKey="focus" stroke={accent} strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
        {[
          { label: t.weeklyGoal, val: "25h" },
          { label: "Daily Avg", val: "3.5h" },
        ].map(({ label, val }) => (
          <div key={label} style={{
            padding: "10px 12px", borderRadius: 10,
            background: "var(--input-bg)", textAlign: "center",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontSize: 9, color: "var(--text-subtle)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

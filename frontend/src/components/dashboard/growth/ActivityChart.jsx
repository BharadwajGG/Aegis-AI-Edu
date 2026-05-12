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
    <motion.div className="bento-card md-col-span-3 p-6 flex flex-col" style={cardStyle}>
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-6 font-semibold">
        {t.focusTime} / VELOCITY
      </div>
      <div className="flex-1 min-h-[120px] relative -mx-2">
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 'dataMax']} />
            <Area type="monotone" dataKey="focus" stroke={accent} strokeWidth={2.5} fillOpacity={1} fill="url(#colorFocus)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6">
        {[
          { label: t.weeklyGoal, val: "25h" },
          { label: "Daily Avg", val: "3.5h" },
        ].map(({ label, val }) => (
          <div key={label} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="text-lg font-bold tracking-tight" style={{ color: accent }}>{val}</div>
            <div className="text-[10px] text-slate-500 font-medium uppercase mt-1">{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Target, Zap, Clock, Flame } from "lucide-react";

export function StatsSidebar({ accent, cardStyle }) {
  return (
    <motion.div className="bento-card md-col-span-4 p-6" style={cardStyle}>
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-6 font-semibold">
        Match Stats
      </div>
      <div className="space-y-3">
        {[
          { label: "Win Rate", value: "68%", icon: <Target size={14} /> },
          { label: "Challenges", value: "142", icon: <Zap size={14} /> },
          { label: "Avg Time", value: "4.2m", icon: <Clock size={14} /> },
          { label: "Streak", value: "12W", icon: <Flame size={14} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span style={{ color: accent }}>{icon}</span>
              {label}
            </div>
            <span className="text-sm font-bold" style={{ color: accent }}>{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

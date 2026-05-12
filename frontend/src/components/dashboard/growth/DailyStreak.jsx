import React from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { RadialProgress } from "../../ui/RadialProgress";
import { PulseDot } from "../../ui/PulseDot";

export function DailyStreak({ t, accent, accentCardStyle }) {
  return (
    <motion.div 
      className="bento-card md-col-span-4 p-6" 
      style={accentCardStyle}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">
            {t.dailyStreak}
          </div>
          <div className="text-5xl font-bold tracking-tighter" style={{ color: accent }}>47</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">{t.streakDays}</div>
        </div>
        <div className="relative">
          <RadialProgress value={78} color={accent} size={72} stroke={5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Flame size={20} style={{ color: accent }} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`h-8 rounded-lg transition-colors duration-300 ${i < 5 ? "" : "bg-slate-800/50"}`}
            style={{ 
              background: i < 5 ? accent : undefined,
              opacity: i < 5 ? (1 - i * 0.1) : 1
            }} 
          />
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <PulseDot color={accent} />
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
          {t.personalBest}: 63 {t.streakDays}
        </span>
      </div>
    </motion.div>
  );
}

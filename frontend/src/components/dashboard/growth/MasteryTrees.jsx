import React from "react";
import { motion } from "framer-motion";
import { Hash, Cpu, Activity, ChevronRight } from "lucide-react";
import { BarProgress } from "../../ui/BarProgress";

export function MasteryTrees({ t, accent, cardStyle }) {
  return (
    <motion.div className="bento-card md-col-span-5 p-6" style={cardStyle}>
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-6 font-semibold">
        {t.masteryProgress}
      </div>
      {[
        { label: t.mathFundamentals, value: 82, icon: <Hash size={13} /> },
        { label: t.algorithmics, value: 61, icon: <Cpu size={13} /> },
        { label: t.physics, value: 44, icon: <Activity size={13} /> },
      ].map(({ label, value, icon }) => (
        <div key={label} className="mb-5 last:mb-0">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span style={{ color: accent }}>{icon}</span>
              {label}
            </div>
            <span className="text-xs font-bold" style={{ color: accent }}>{value}%</span>
          </div>
          <BarProgress value={value} color={accent} />
        </div>
      ))}
      <div className="mt-8 p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
        <div className="text-[10px] text-slate-500 font-semibold uppercase">{t.nextMilestone}</div>
        <div className="text-xs font-bold flex items-center gap-1" style={{ color: accent }}>
          Calculus II <ChevronRight size={12} />
        </div>
      </div>
    </motion.div>
  );
}

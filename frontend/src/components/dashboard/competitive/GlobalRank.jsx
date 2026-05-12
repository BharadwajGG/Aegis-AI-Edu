import React from "react";
import { motion } from "framer-motion";
import { Trophy, EyeOff, ArrowUp, ChevronRight } from "lucide-react";
import { PulseDot } from "../../ui/PulseDot";
import { BarProgress } from "../../ui/BarProgress";

export function GlobalRank({ t, accent, accentCardStyle, isGhost }) {
  return (
    <motion.div className="bento-card md-col-span-4 p-6" style={accentCardStyle}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
          <Trophy size={16} />
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          {t.globalRank}
        </div>
        <div className="ml-auto">
          <PulseDot color={accent} />
        </div>
      </div>

      {isGhost ? (
        <div className="text-center py-8">
          <EyeOff size={32} className="mx-auto mb-3 text-purple-500/40" />
          <div className="text-xs text-purple-500/60 font-bold uppercase tracking-widest">{t.rankHidden}</div>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-2 mb-2">
            <div className="text-5xl font-black tracking-tighter" style={{ color: accent }}>#247</div>
            <div className="mb-2">
              <ArrowUp size={18} className="text-emerald-500" />
            </div>
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-6">
            {t.outOf} 14,832 {t.students}
          </div>
          <BarProgress value={83} color={accent} />
          <div className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            +18 ↑ this week
          </div>
        </>
      )}

      <div className="mt-8 p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex justify-between items-center group cursor-pointer hover:border-slate-700 transition-colors">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.rankUp}</span>
        <span className="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: accent }}>Top 200 <ChevronRight size={14} /></span>
      </div>
    </motion.div>
  );
}

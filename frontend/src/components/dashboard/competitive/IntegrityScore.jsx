import React from "react";
import { motion } from "framer-motion";
import { Shield, Award } from "lucide-react";
import { RadialProgress } from "../../ui/RadialProgress";

export function IntegrityScore({ t, accent, cardStyle }) {
  return (
    <motion.div className="bento-card md-col-span-3 p-6" style={cardStyle}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
          <Shield size={16} />
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          {t.integrityScore}
        </div>
      </div>
      <div className="flex justify-center relative mb-8">
        <RadialProgress value={94} color={accent} size={100} stroke={8} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-black tracking-tighter" style={{ color: accent }}>94</div>
          <div className="text-[8px] text-slate-500 font-black uppercase tracking-tighter mt-1">{t.publicScore}</div>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
        <div className="size-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
          <Award size={12} />
        </div>
        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{t.verified}</span>
      </div>
    </motion.div>
  );
}

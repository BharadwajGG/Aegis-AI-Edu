import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useTimer } from "../../../hooks/useTimer";

export function LiveChallenge({ t, accent, accentGlow, accentCardStyle }) {
  const [ans, setAns] = useState("");
  const timer = useTimer(847);

  const submitDef = () => {
    if(!ans) return;
    toast.success("Answer submitted successfully!");
    setAns("");
  }

  return (
    <motion.div className="bento-card md-col-span-8 p-8" style={accentCardStyle}>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Zap size={20} />
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            {t.liveChallenge}
          </div>
          <div className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[8px] font-black text-rose-500 tracking-widest uppercase">Ranked</div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 ring-1 ring-purple-500/10">
          <Clock size={14} className="text-purple-500" />
          <span className="text-xl font-black tracking-tighter text-purple-400 tabular-nums">
            {timer}
          </span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 mb-8">
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">
          {t.challengeLabel} · Calculus II
        </div>
        <div className="text-lg text-slate-200 leading-relaxed italic font-medium">
          "{t.challengeQ}"
        </div>
      </div>

      <div className="flex gap-3">
        <input
          placeholder="f(x) = ..."
          value={ans}
          onChange={e => setAns(e.target.value)}
          className="flex-1 px-5 py-4 rounded-xl border border-slate-800 bg-slate-900/30 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 font-mono"
        />
        <button onClick={submitDef} className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-all whitespace-nowrap">
          {t.submit}
        </button>
      </div>
    </motion.div>
  );
}

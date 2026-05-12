import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { PulseDot } from "../../ui/PulseDot";

export function LiveLeaderboard({ accent, accentDim, accentGlow, cardStyle, isGhost, ghostName }) {
  return (
    <motion.div className="bento-card md-col-span-5 p-6" style={cardStyle}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
          <BarChart3 size={16} />
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          Leaderboard
        </div>
        <div className="ml-auto flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          <PulseDot color="#10b981" />
          <span className="text-[8px] font-black text-emerald-500 tracking-tighter uppercase">Live</span>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { rank: 1, name: "Priya K.", score: 9840, delta: "+34" },
          { rank: 2, name: "Rahul M.", score: 9721, delta: "+12" },
          { rank: 3, name: "Sneha V.", score: 9650, delta: "+28" },
          { rank: 4, name: isGhost ? ghostName : "Aryan D.", score: 9410, delta: "+18", isMe: true },
          { rank: 5, name: "Dev P.", score: 9302, delta: "+7" },
        ].map(({ rank, name, score, delta, isMe }) => (
          <div key={rank} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${isMe ? "bg-purple-500/10 ring-1 ring-purple-500/30" : "bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800"}`}>
            <div className={`size-6 rounded-lg flex items-center justify-center text-[10px] font-black ${rank <= 3 ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "bg-slate-800 text-slate-500"}`}>
              {rank}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-bold truncate flex items-center gap-2 ${isMe ? "text-white" : "text-slate-400"}`}>
                {isMe && isGhost ? <span className="blur-sm">{name}</span> : name}
                {isMe && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/20 font-black">YOU</span>}
              </div>
            </div>
            <div className="text-[10px] font-bold text-slate-500">{score.toLocaleString()}</div>
            <div className="text-[9px] font-black text-emerald-500">{delta}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

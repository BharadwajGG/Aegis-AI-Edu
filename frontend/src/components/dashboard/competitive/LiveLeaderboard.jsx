import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { PulseDot } from "../../ui/PulseDot";

export function LiveLeaderboard({ accent, accentDim, accentGlow, cardStyle, isGhost, ghostName }) {
  return (
    <motion.div layout className="bento-card md-col-span-5" style={{ ...cardStyle, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <BarChart3 size={14} color={accent} />
        <div style={{ fontSize: 9, color: "var(--text-subtle)", letterSpacing: 2 }}>
          LEADERBOARD
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <PulseDot color={accent} />
          <span style={{ fontSize: 9, color: "var(--text-subtle)" }}>LIVE</span>
        </div>
      </div>
      {[
        { rank: 1, name: "Priya K.", score: 9840, delta: "+34" },
        { rank: 2, name: "Rahul M.", score: 9721, delta: "+12" },
        { rank: 3, name: "Sneha V.", score: 9650, delta: "+28" },
        { rank: 4, name: isGhost ? ghostName : "Aryan D.", score: 9410, delta: "+18", isMe: true },
        { rank: 5, name: "Dev P.", score: 9302, delta: "+7" },
      ].map(({ rank, name, score, delta, isMe }) => (
        <div key={rank} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 12px", borderRadius: 6,
          marginBottom: 6,
          background: isMe ? accentDim : "var(--input-bg)",
          border: isMe ? `1px solid ${accentGlow}` : "1px solid transparent",
          transition: "all 0.3s",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 4,
            background: rank <= 3 ? accent : "var(--input-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700,
            color: rank <= 3 ? "#fff" : "var(--text-muted)",
          }}>
            {rank}
          </div>
          <div style={{ flex: 1, fontSize: 12, color: isMe ? "var(--text-main)" : "var(--text-muted)" }}>
            {isMe && isGhost ? <span style={{ filter: "blur(4px)" }}>{name}</span> : name}
            {isMe && <span style={{ fontSize: 9, color: accent, marginLeft: 6 }}>YOU</span>}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-subtle)", marginRight: 4 }}>{score.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: "#10b981" }}>{delta}</div>
        </div>
      ))}
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Target, Zap, Clock, Flame } from "lucide-react";

export function StatsSidebar({ accent, cardStyle }) {
  return (
    <motion.div layout className="bento-card md-col-span-4" style={{ ...cardStyle, padding: 24 }}>
      <div style={{ fontSize: 9, color: "var(--text-subtle)", letterSpacing: 2, marginBottom: 16 }}>
        MATCH STATS
      </div>
      {[
        { label: "Win Rate", value: "68%", icon: <Target size={13} /> },
        { label: "Challenges", value: "142", icon: <Zap size={13} /> },
        { label: "Avg Time", value: "4.2m", icon: <Clock size={13} /> },
        { label: "Streak", value: "12W", icon: <Flame size={13} /> },
      ].map(({ label, value, icon }) => (
        <div key={label} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 14px", borderRadius: 6, marginBottom: 8,
          background: "var(--input-bg)",
          border: "1px solid var(--input-border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
            <span style={{ color: accent }}>{icon}</span>
            {label}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{value}</span>
        </div>
      ))}
    </motion.div>
  );
}

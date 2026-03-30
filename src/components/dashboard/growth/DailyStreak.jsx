import React from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { RadialProgress } from "../../ui/RadialProgress";
import { PulseDot } from "../../ui/PulseDot";

export function DailyStreak({ t, accent, accentCardStyle }) {
  return (
    <motion.div layout style={{ ...accentCardStyle, gridColumn: "span 4", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, marginBottom: 6 }}>
            {t.dailyStreak.toUpperCase()}
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, color: accent, lineHeight: 1 }}>47</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{t.streakDays}</div>
        </div>
        <div style={{ position: "relative" }}>
          <RadialProgress value={78} color={accent} size={72} stroke={5} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={20} color={accent} />
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{
            height: 28, borderRadius: 4,
            background: i < 5 ? accent : "rgba(255,255,255,0.06)",
            opacity: i < 5 ? (1 - i * 0.08) : 1,
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
        <PulseDot color={accent} />
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>
          {t.personalBest}: 63 {t.streakDays}
        </span>
      </div>
    </motion.div>
  );
}

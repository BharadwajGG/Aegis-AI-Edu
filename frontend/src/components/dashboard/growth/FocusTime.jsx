import React from "react";
import { motion } from "framer-motion";
import { RadialProgress } from "../../ui/RadialProgress";

export function FocusTime({ t, accent, cardStyle }) {
  return (
    <motion.div layout style={{ ...cardStyle, gridColumn: "span 3", padding: 24 }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, marginBottom: 16 }}>
        {t.focusTime.toUpperCase()}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, position: "relative" }}>
        <RadialProgress value={65} color={accent} size={96} stroke={7} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: accent }}>4.2</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{t.hrs}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: t.weeklyGoal, val: "6h" },
          { label: "Sessions", val: "12" },
        ].map(({ label, val }) => (
          <div key={label} style={{
            padding: "10px 12px", borderRadius: 10,
            background: "rgba(255,255,255,0.03)", textAlign: "center",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

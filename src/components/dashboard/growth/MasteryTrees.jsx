import React from "react";
import { motion } from "framer-motion";
import { Hash, Cpu, Activity } from "lucide-react";
import { BarProgress } from "../../ui/BarProgress";

export function MasteryTrees({ t, accent, cardStyle }) {
  return (
    <motion.div layout style={{ ...cardStyle, gridColumn: "span 5", padding: 24 }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, marginBottom: 18 }}>
        {t.masteryProgress.toUpperCase()}
      </div>
      {[
        { label: t.mathFundamentals, value: 82, icon: <Hash size={13} /> },
        { label: t.algorithmics, value: 61, icon: <Cpu size={13} /> },
        { label: t.physics, value: 44, icon: <Activity size={13} /> },
      ].map(({ label, value, icon }) => (
        <div key={label} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              <span style={{ color: accent }}>{icon}</span>
              {label}
            </div>
            <span style={{ fontSize: 12, color: accent, fontWeight: 700 }}>{value}%</span>
          </div>
          <BarProgress value={value} color={accent} />
        </div>
      ))}
      <div style={{
        marginTop: 8, padding: "10px 14px", borderRadius: 10,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{t.nextMilestone}</div>
        <div style={{ fontSize: 11, color: accent, fontWeight: 600 }}>Calculus II →</div>
      </div>
    </motion.div>
  );
}

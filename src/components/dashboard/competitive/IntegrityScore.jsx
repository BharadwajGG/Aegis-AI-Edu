import React from "react";
import { motion } from "framer-motion";
import { Shield, Award } from "lucide-react";
import { RadialProgress } from "../../ui/RadialProgress";

export function IntegrityScore({ t, accent, cardStyle }) {
  return (
    <motion.div layout style={{ ...cardStyle, gridColumn: "span 3", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Shield size={14} color={accent} />
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
          {t.integrityScore.toUpperCase()}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", position: "relative", marginBottom: 16 }}>
        <RadialProgress value={94} color={accent} size={96} stroke={7} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: accent }}>94</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{t.publicScore}</div>
        </div>
      </div>
      <div style={{
        padding: "10px 14px", borderRadius: 6,
        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <Award size={12} color="#10b981" />
        <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>{t.verified}</span>
      </div>
    </motion.div>
  );
}

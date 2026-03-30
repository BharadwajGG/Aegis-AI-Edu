import React from "react";
import { motion } from "framer-motion";
import { Map } from "lucide-react";

export function PersonalRoadmap({ t, accent, cardStyle }) {
  return (
    <motion.div layout style={{ ...cardStyle, gridColumn: "span 7", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Map size={14} color={accent} />
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
          {t.personalRoadmap.toUpperCase()}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        {t.roadmapItems.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: i < 3 ? 16 : 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: i < 2 ? accent : "rgba(255,255,255,0.06)",
              border: i === 2 ? `2px solid ${accent}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
              color: i < 2 ? "#fff" : i === 2 ? accent : "rgba(255,255,255,0.3)",
            }}>
              {i < 2 ? "✓" : i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{
                  fontSize: 12, fontWeight: i === 2 ? 600 : 400,
                  color: i < 2 ? "rgba(255,255,255,0.4)" : i === 2 ? "#fff" : "rgba(255,255,255,0.35)",
                }}>{item}</span>
                <span style={{ fontSize: 9, color: accent, letterSpacing: 1 }}>
                  {t.roadmapPhase} {i + 1}
                </span>
              </div>
              {i < 3 && <div style={{
                width: "100%", height: 1,
                background: i < 2 ? `linear-gradient(90deg, ${accent}, transparent)` : "rgba(255,255,255,0.05)"
              }} />}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

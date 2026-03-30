import React from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { PulseDot } from "../../ui/PulseDot";

export function ConceptCoach({ t, accent, accentGlow, cardStyle, coachInput, setCoachInput }) {
  return (
    <motion.div layout style={{ ...cardStyle, gridColumn: "span 5", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Brain size={14} color={accent} />
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
          {t.conceptCoach.toUpperCase()}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <PulseDot color={accent} />
        </div>
      </div>
      <div style={{
        padding: "14px 16px", borderRadius: 12,
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${accentGlow}`,
        marginBottom: 14,
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Sparkles size={13} color={accent} style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
            {t.coachTip}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={coachInput}
          onChange={e => setCoachInput(e.target.value)}
          placeholder={t.coachPrompt}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.8)", fontSize: 12,
            outline: "none",
          }}
        />
        <button style={{
          padding: "10px 16px", borderRadius: 10,
          background: accent, border: "none",
          color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600,
        }}>
          →
        </button>
      </div>
    </motion.div>
  );
}

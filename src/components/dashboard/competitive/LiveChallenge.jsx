import React from "react";
import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";

export function LiveChallenge({ t, accent, accentGlow, accentCardStyle, timer }) {
  return (
    <motion.div layout style={{ ...accentCardStyle, gridColumn: "span 8", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={14} color={accent} />
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
            {t.liveChallenge.toUpperCase()}
          </div>
          <div style={{
            padding: "2px 8px", borderRadius: 4,
            background: "rgba(244,63,94,0.2)", border: "1px solid rgba(244,63,94,0.3)",
            fontSize: 9, color: accent, letterSpacing: 1,
          }}>RANKED</div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 14px", borderRadius: 6,
          background: "rgba(0,0,0,0.4)", border: `1px solid ${accentGlow}`,
        }}>
          <Clock size={11} color={accent} />
          <span style={{ fontSize: 16, fontWeight: 900, color: accent, fontVariantNumeric: "tabular-nums" }}>
            {timer}
          </span>
        </div>
      </div>

      <div style={{
        padding: "18px 20px", borderRadius: 8,
        background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1, marginBottom: 10 }}>
          {t.challengeLabel.toUpperCase()} · CALCULUS II
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.7, fontStyle: "italic" }}>
          {t.challengeQ}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="f(x) = ..."
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 6,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.8)", fontSize: 13, outline: "none",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        />
        <button style={{
          padding: "12px 20px", borderRadius: 6,
          background: accent, border: "none",
          color: "#fff", fontSize: 12, cursor: "pointer",
          fontWeight: 700, letterSpacing: 1,
          boxShadow: `0 0 20px ${accentGlow}`,
        }}>
          {t.submit}
        </button>
      </div>
    </motion.div>
  );
}

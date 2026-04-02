import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";
import toast from "react-hot-toast";

export function LiveChallenge({ t, accent, accentGlow, accentCardStyle, timer }) {
  const [ans, setAns] = useState("");

  const submitDef = () => {
    if(!ans) return;
    toast.success("Answer submitted successfully!");
    setAns("");
  }

  return (
    <motion.div layout className="bento-card md-col-span-8" style={{ ...accentCardStyle, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={14} color={accent} />
          <div style={{ fontSize: 9, color: "var(--text-subtle)", letterSpacing: 2 }}>
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
          background: "var(--input-bg)", border: `1px solid ${accentGlow}`,
        }}>
          <Clock size={11} color={accent} />
          <span style={{ fontSize: 16, fontWeight: 900, color: accent, fontVariantNumeric: "tabular-nums" }}>
            {timer}
          </span>
        </div>
      </div>

      <div style={{
        padding: "18px 20px", borderRadius: 8,
        background: "var(--input-bg)", border: "1px solid var(--input-border)",
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: "var(--text-subtle)", letterSpacing: 1, marginBottom: 10 }}>
          {t.challengeLabel.toUpperCase()} · CALCULUS II
        </div>
        <div style={{ fontSize: 14, color: "var(--text-main)", lineHeight: 1.7, fontStyle: "italic" }}>
          {t.challengeQ}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="f(x) = ..."
          value={ans}
          onChange={e => setAns(e.target.value)}
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 6,
            background: "var(--bg-main)",
            border: "1px solid var(--input-border)",
            color: "var(--text-main)", fontSize: 13, outline: "none",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        />
        <button onClick={submitDef} style={{
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

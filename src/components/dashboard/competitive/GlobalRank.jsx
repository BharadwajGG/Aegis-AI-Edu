import React from "react";
import { motion } from "framer-motion";
import { Trophy, EyeOff, ArrowUp } from "lucide-react";
import { PulseDot } from "../../ui/PulseDot";
import { BarProgress } from "../../ui/BarProgress";

export function GlobalRank({ t, accent, accentCardStyle, isGhost }) {
  return (
    <motion.div layout style={{ ...accentCardStyle, gridColumn: "span 4", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <Trophy size={13} color={accent} />
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
          {t.globalRank.toUpperCase()}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <PulseDot color={accent} />
        </div>
      </div>

      {isGhost ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <EyeOff size={28} color="rgba(139,92,246,0.6)" style={{ margin: "0 auto 8px" }} />
          <div style={{ fontSize: 12, color: "rgba(139,92,246,0.7)", letterSpacing: 1 }}>{t.rankHidden}</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: accent, lineHeight: 1 }}>#247</div>
            <div style={{ marginBottom: 8 }}>
              <ArrowUp size={16} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
            {t.outOf} 14,832 {t.students}
          </div>
          <BarProgress value={83} color={accent} />
          <div style={{ marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
            +18 ↑ this week
          </div>
        </>
      )}

      <div style={{
        marginTop: 16, padding: "10px 14px", borderRadius: 6,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{t.rankUp}</span>
        <span style={{ fontSize: 11, color: accent, fontWeight: 700 }}>Top 200 →</span>
      </div>
    </motion.div>
  );
}

import React from "react";
import { Ghost } from "lucide-react";
import { PulseDot } from "../ui/PulseDot";

export function ModeIndicator({ isGrowth, accent, isGhost }) {
  return (
    <div style={{
      marginTop: 24, padding: "12px 20px",
      borderRadius: isGrowth ? 16 : 6,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.05)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "border-radius 0.5s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PulseDot color={accent} />
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
          {isGrowth ? "PRIVATE JOURNAL MODE" : "COMPETITIVE ARENA MODE"} · AEGIS v2.4
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {isGhost && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#a78bfa" }}>
            <Ghost size={11} /> IDENTITY SHIELDED
          </div>
        )}
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

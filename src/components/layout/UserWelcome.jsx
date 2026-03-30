import React from "react";
import { motion } from "framer-motion";
import { EyeOff } from "lucide-react";

export function UserWelcome({ t, displayName, isGhost }) {
  return (
    <motion.div layout style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 4 }}>
          {t.welcomeBack},
        </div>
        <motion.div layout style={{
          fontSize: 22, fontWeight: 700, letterSpacing: 1,
          filter: isGhost ? "blur(8px)" : "none",
          transition: "filter 0.5s ease",
        }}>
          {displayName}
        </motion.div>
      </div>
      {isGhost && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 12px", borderRadius: 20,
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.3)",
            fontSize: 10, color: "#a78bfa", letterSpacing: 1,
          }}>
          <EyeOff size={11} /> {t.ghostMode.toUpperCase()} ACTIVE
        </motion.div>
      )}
    </motion.div>
  );
}

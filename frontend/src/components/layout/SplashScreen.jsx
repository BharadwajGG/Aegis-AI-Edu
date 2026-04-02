import React from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function SplashScreen({ onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.0, duration: 0.8 }}
      onAnimationComplete={onComplete}
      style={{
        position: "fixed", inset: 0,
        background: "var(--bg-main)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: `linear-gradient(135deg, #10b981, transparent)`,
          border: `1px solid #10b981`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 40px rgba(16,185,129,0.3)`,
          marginBottom: 24,
        }}>
          <Shield size={40} color="#10b981" />
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        style={{ textAlign: "center" }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 8, color: "var(--text-main)" }}>
          AEGIS
        </div>
        <div style={{ fontSize: 12, color: "var(--text-subtle)", letterSpacing: 4, marginTop: 8 }}>
          INITIALIZING OS...
        </div>
      </motion.div>
    </motion.div>
  );
}

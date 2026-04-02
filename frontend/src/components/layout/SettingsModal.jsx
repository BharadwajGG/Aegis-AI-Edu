import React from "react";
import { motion } from "framer-motion";
import { X, Moon, Sun, User, Key } from "lucide-react";
import toast from "react-hot-toast";

export function SettingsModal({ onClose, theme, toggleTheme, userName, setUserName, apiKey, setApiKey, accent, accentGlow }) {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: -20, opacity: 0 }}
        style={{
          width: "100%", maxWidth: 440,
          background: "var(--bg-main)",
          border: `1px solid ${accentGlow}`,
          borderRadius: 16,
          boxShadow: `0 20px 60px var(--shadow-color)`,
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--card-border)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", letterSpacing: 1 }}>
            OS CONFIGURATION
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-subtle)", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Theme Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-main)" }}>
              {theme === "dark" ? <Moon size={16} color={accent} /> : <Sun size={16} color={accent} />}
              <span style={{ fontSize: 14 }}>System Theme</span>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                background: "var(--card-bg)", color: "var(--text-main)", border: "1px solid var(--card-border)"
              }}
            >
              Toggle {theme === "dark" ? "Light" : "Dark"} Mode
            </button>
          </div>

          {/* Profile Name */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--text-main)", fontSize: 13 }}>
              <User size={14} color={accent} /> Display Name
            </div>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 8,
                background: "var(--input-bg)", border: "1px solid var(--input-border)",
                color: "var(--text-main)", outline: "none", fontSize: 14,
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Anthropic Key */}
          <div>
             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--text-main)", fontSize: 13 }}>
              <Key size={14} color={accent} /> Anthropic API Key
            </div>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 8,
                background: "var(--input-bg)", border: "1px solid var(--input-border)",
                color: "var(--text-main)", outline: "none", fontSize: 14,
                fontFamily: "inherit"
              }}
            />
            <div style={{ fontSize: 10, color: "var(--text-subtle)", marginTop: 6, lineHeight: 1.4 }}>
              Stored locally on your device for testing the AI Concept Coach. Leave blank to run in simulated mock mode.
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 24px", background: "var(--card-bg)", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 700,
              background: accent, color: "#fff", border: "none", cursor: "pointer",
              boxShadow: `0 0 15px ${accentGlow}`
            }}
          >
            Apply Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

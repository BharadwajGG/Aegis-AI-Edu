import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Globe, ChevronDown, Ghost } from "lucide-react";

export function TopNavigation({
  t, accent, accentDim, accentGlow,
  lang, setLang, langOpen, setLangOpen,
  mode, setMode,
  isGhost, setIsGhost,
  displayAvatar
}) {
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
      marginBottom: 28,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `linear-gradient(135deg, ${accent}, transparent)`,
          border: `1px solid ${accent}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 20px ${accentGlow}`,
          transition: "all 0.5s ease",
        }}>
          <Shield size={18} color={accent} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 4, color: accent, transition: "color 0.5s" }}>
            {t.appName}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>
            {t.tagline}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Language Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setLangOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.7)", fontSize: 11,
              cursor: "pointer", letterSpacing: 1,
            }}>
            <Globe size={13} />
            {lang.toUpperCase()}
            <ChevronDown size={11} />
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50,
                  background: "#111", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, overflow: "hidden", minWidth: 130,
                }}>
                {[["en", "English"], ["hi", "हिंदी"], ["mr", "मराठी"]].map(([code, label]) => (
                  <button key={code}
                    onClick={() => { setLang(code); setLangOpen(false); }}
                    style={{
                      width: "100%", padding: "9px 14px", textAlign: "left",
                      background: lang === code ? accentDim : "transparent",
                      color: lang === code ? accent : "rgba(255,255,255,0.6)",
                      fontSize: 12, cursor: "pointer", letterSpacing: 0.5,
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      transition: "all 0.2s",
                    }}>
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mode Switcher */}
        <div style={{
          display: "flex", background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 3,
        }}>
          {["growth", "competitive"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 11, letterSpacing: 0.5,
                cursor: "pointer", transition: "all 0.4s ease", fontWeight: 600,
                background: mode === m ? (m === "growth" ? "#10b981" : "#f43f5e") : "transparent",
                color: mode === m ? "#fff" : "rgba(255,255,255,0.4)",
                border: "none",
              }}>
              {m === "growth" ? t.growth : t.competitive}
            </button>
          ))}
        </div>

        {/* Ghost Toggle */}
        <button
          onClick={() => setIsGhost(g => !g)}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 14px", borderRadius: 10, fontSize: 11,
            cursor: "pointer", transition: "all 0.4s ease", fontWeight: 600,
            background: isGhost ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
            border: isGhost ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
            color: isGhost ? "#a78bfa" : "rgba(255,255,255,0.4)",
          }}>
          <Ghost size={13} />
          {isGhost ? t.ghostOn : t.ghostOff}
        </button>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${accent}66, ${accent}22)`,
          border: `1px solid ${accent}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: accent,
          filter: isGhost ? "blur(6px)" : "none",
          transition: "filter 0.5s ease",
        }}>
          {displayAvatar || <Ghost size={16} />}
        </div>
      </div>
    </nav>
  );
}

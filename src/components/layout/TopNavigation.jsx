import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Globe, ChevronDown, Ghost, Settings } from "lucide-react";

export function TopNavigation({
  t, accent, accentDim, accentGlow,
  lang, setLang, langOpen, setLangOpen,
  mode, setMode,
  isGhost, setIsGhost,
  displayAvatar,
  openSettings
}) {
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 0", borderBottom: "1px solid var(--card-border)",
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
          <div style={{ fontSize: 9, color: "var(--text-subtle)", letterSpacing: 2 }}>
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
              background: "var(--input-bg)",
              border: "1px solid var(--input-border)",
              color: "var(--text-main)", fontSize: 11,
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
                  background: "var(--card-bg)", border: "1px solid var(--card-border)",
                  borderRadius: 10, overflow: "hidden", minWidth: 130, padding: 4,
                  backdropFilter: "blur(20px)"
                }}>
                {[["en", "English"], ["hi", "हिंदी"], ["mr", "मराठी"]].map(([code, label]) => (
                  <button key={code}
                    onClick={() => { setLang(code); setLangOpen(false); }}
                    style={{
                      width: "100%", padding: "9px 14px", textAlign: "left", borderRadius: 6,
                      background: lang === code ? accentDim : "transparent",
                      color: lang === code ? accent : "var(--text-muted)",
                      fontSize: 12, cursor: "pointer", letterSpacing: 0.5, border: "none",
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
          display: "flex", background: "var(--input-bg)",
          border: "1px solid var(--input-border)", borderRadius: 10, padding: 3,
        }}>
          {["growth", "competitive"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 11, letterSpacing: 0.5,
                cursor: "pointer", transition: "all 0.4s ease", fontWeight: 600,
                background: mode === m ? (m === "growth" ? "#10b981" : "#f43f5e") : "transparent",
                color: mode === m ? "#fff" : "var(--text-muted)",
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
            background: isGhost ? "rgba(139,92,246,0.2)" : "var(--input-bg)",
            border: isGhost ? "1px solid rgba(139,92,246,0.5)" : "1px solid var(--input-border)",
            color: isGhost ? "#a78bfa" : "var(--text-muted)",
          }}>
          <Ghost size={13} />
          {isGhost ? t.ghostOn : t.ghostOff}
        </button>
        
        {/* Settings button */}
        <button
          onClick={openSettings}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--input-bg)", border: "1px solid var(--input-border)",
            color: "var(--text-muted)", cursor: "pointer", transition: "all 0.2s ease"
          }}
        >
          <Settings size={16} />
        </button>

        {/* Avatar */}
        <button
          onClick={openSettings}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${accent}66, ${accent}22)`,
            border: `1px solid ${accent}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: accent, cursor: "pointer",
            filter: isGhost ? "blur(6px)" : "none",
            transition: "filter 0.5s ease",
          }}>
          {displayAvatar || <Ghost size={16} />}
        </button>
      </div>
    </nav>
  );
}

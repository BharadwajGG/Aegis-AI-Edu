import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Globe, ChevronDown, ChevronLeft, ChevronRight, 
  Ghost, Settings, LayoutDashboard, Map, BrainCircuit
} from "lucide-react";

export function Sidebar({
  t, accent, accentDim, accentGlow,
  lang, setLang, langOpen, setLangOpen,
  mode, setMode,
  isGhost, setIsGhost,
  displayAvatar,
  openSettings,
  activeView, setActiveView,
  collapsed, setCollapsed
}) {
  
  const navItems = [
    { id: "overview", label: t.appName || "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "roadmap", label: "AI Roadmap", icon: <Map size={18} /> },
    { id: "coach", label: "Concept Coach", icon: <BrainCircuit size={18} /> }
  ];

  return (
    <motion.div 
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        background: "var(--card-bg)",
        borderRight: "1px solid var(--card-border)",
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 12px",
        overflowX: "hidden"
      }}
    >
      {/* --- TOP: BRANDING & NAVIGATION --- */}
      <div>
        {/* Logo & Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", marginBottom: 40, padding: "0 8px" }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `linear-gradient(135deg, ${accent}, transparent)`,
                border: `1px solid ${accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 15px ${accentGlow}`,
              }}>
                <Shield size={16} color={accent} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 3, color: accent }}>
                AEGIS
              </div>
            </div>
          )}
          
          {collapsed && (
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${accent}, transparent)`,
              border: `1px solid ${accent}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 15px ${accentGlow}`,
              marginBottom: 10
            }}>
              <Shield size={16} color={accent} />
            </div>
          )}

          <button 
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--text-subtle)", padding: 4, display: "flex", alignItems: "center",
              position: collapsed ? "absolute" : "static", top: collapsed ? 70 : "auto"
            }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button key={item.id} onClick={() => setActiveView(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 16px", borderRadius: 12,
                  background: isActive ? accentDim : "transparent",
                  color: isActive ? accent : "var(--text-subtle)",
                  border: isActive ? `1px solid ${accentGlow}` : "1px solid transparent",
                  cursor: "pointer", transition: "all 0.3s ease",
                  justifyContent: collapsed ? "center" : "flex-start",
                  position: "relative", overflow: "hidden"
                }}
              >
                {isActive && (
                  <motion.div layoutId="nav-indicator"
                    style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: accent }}
                  />
                )}
                <div style={{ flexShrink: 0 }}>{item.icon}</div>
                {!collapsed && (
                  <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, letterSpacing: 1 }}>
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- BOTTOM: CONTROLS & SETTINGS --- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        
        {/* Language & Settings Row */}
        {!collapsed && (
           <div style={{ display: "flex", gap: 8, padding: "0 8px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <button
                onClick={() => setLangOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "8px 12px", borderRadius: 8,
                  background: "var(--input-bg)", border: "1px solid var(--input-border)",
                  color: "var(--text-main)", fontSize: 11, cursor: "pointer", letterSpacing: 1,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Globe size={13} /> {lang.toUpperCase()}
                </div>
                <ChevronDown size={11} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    style={{
                      position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50,
                      background: "var(--card-bg)", border: "1px solid var(--card-border)",
                      borderRadius: 10, overflow: "hidden", padding: 4, backdropFilter: "blur(20px)"
                    }}>
                    {[["en", "English"], ["hi", "हिंदी"], ["mr", "मराठी"]].map(([code, label]) => (
                      <button key={code}
                        onClick={() => { setLang(code); setLangOpen(false); }}
                        style={{
                          width: "100%", padding: "9px 10px", textAlign: "left", borderRadius: 6,
                          background: lang === code ? accentDim : "transparent",
                          color: lang === code ? accent : "var(--text-muted)",
                          fontSize: 12, cursor: "pointer", border: "none"
                        }}>
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={openSettings} style={{
              width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--input-bg)", border: "1px solid var(--input-border)",
              color: "var(--text-muted)", cursor: "pointer"
            }}>
              <Settings size={14} />
            </button>
          </div>
        )}

        {/* Short Controls Row (when collapsed) */}
        {collapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <button onClick={() => setLangOpen(o => !o)} style={{
              width: 36, height: 36, borderRadius: 8, background: "var(--input-bg)", border: "1px solid var(--input-border)",
              color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
            }}>
              <Globe size={14} />
            </button>
            <button onClick={openSettings} style={{
              width: 36, height: 36, borderRadius: 8, background: "var(--input-bg)", border: "1px solid var(--input-border)",
              color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
            }}>
              <Settings size={14} />
            </button>
          </div>
        )}

        {/* Mode Switcher */}
        <div style={{
          display: "flex", flexDirection: collapsed ? "column" : "row",
          background: "var(--input-bg)",
          border: "1px solid var(--input-border)", borderRadius: 10, padding: 3,
        }}>
          {["growth", "competitive"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                flex: 1, padding: collapsed ? "10px 0" : "7px 0", borderRadius: 8, fontSize: 10, letterSpacing: 0.5,
                cursor: "pointer", transition: "all 0.4s ease", fontWeight: 600,
                background: mode === m ? (m === "growth" ? "#10b981" : "#f43f5e") : "transparent",
                color: mode === m ? "#fff" : "var(--text-muted)", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
              {collapsed ? m[0].toUpperCase() : (m === "growth" ? t.growth : t.competitive)}
            </button>
          ))}
        </div>

        {/* User / Ghost Box */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between",
          padding: "10px", borderRadius: 12,
          background: isGhost ? "rgba(139,92,246,0.1)" : "var(--input-bg)",
          border: isGhost ? "1px solid rgba(139,92,246,0.3)" : "1px solid var(--input-border)"
        }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `linear-gradient(135deg, ${accent}66, ${accent}22)`,
                border: `1px solid ${accent}66`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: accent,
                filter: isGhost ? "blur(4px)" : "none", transition: "filter 0.5s"
              }}>
                {displayAvatar}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: isGhost ? "#a78bfa" : "var(--text-main)" }}>
                {isGhost ? "Ghost Mode" : "User Profile"}
              </div>
            </div>
          )}
          
          <button onClick={() => setIsGhost(g => !g)} title="Toggle Ghost Mode" style={{
            background: isGhost ? "#a78bfa" : "transparent",
            color: isGhost ? "#fff" : "var(--text-muted)",
            border: isGhost ? "none" : "1px solid var(--input-border)",
            width: 32, height: 32, borderRadius: 8, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s"
          }}>
            <Ghost size={14} />
          </button>
        </div>
      </div>

    </motion.div>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

import { useTheme } from "./src/hooks/useTheme";
import { LANG } from "./src/constants/translations";
import { GHOST_NAMES } from "./src/constants/ghostNames";
import { useTimer } from "./src/hooks/useTimer";

import { SplashScreen } from "./src/components/layout/SplashScreen";
import { Sidebar } from "./src/components/layout/Sidebar";
import { UserWelcome } from "./src/components/layout/UserWelcome";
import { ModeIndicator } from "./src/components/layout/ModeIndicator";
import { SettingsModal } from "./src/components/layout/SettingsModal";

import { DailyStreak } from "./src/components/dashboard/growth/DailyStreak";
import { MasteryTrees } from "./src/components/dashboard/growth/MasteryTrees";
import { ActivityChart } from "./src/components/dashboard/growth/ActivityChart";
import { ConceptCoach } from "./src/components/dashboard/growth/ConceptCoach";
import { AIRoadmapCard } from "./src/components/dashboard/growth/AIRoadmapCard";

import { GlobalRank } from "./src/components/dashboard/competitive/GlobalRank";
import { LiveLeaderboard } from "./src/components/dashboard/competitive/LiveLeaderboard";
import { IntegrityScore } from "./src/components/dashboard/competitive/IntegrityScore";
import { LiveChallenge } from "./src/components/dashboard/competitive/LiveChallenge";
import { StatsSidebar } from "./src/components/dashboard/competitive/StatsSidebar";

export default function AegisDashboard() {
  const [showSplash, setShowSplash] = useState(true);
  const { theme, toggleTheme } = useTheme();
  
  const [mode, setMode] = useState("growth");
  const [isGhost, setIsGhost] = useState(false);
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  
  // Sidebar & View States
  const [activeView, setActiveView] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Settings & Profile
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userName, setUserName] = useState("Aryan Desai");
  const [apiKey, setApiKey] = useState(() => window.localStorage.getItem("gemini_key") || "AIzaSyAi39J90J6TLajkiXzEFBEq673DzZKiM1w");
  useEffect(() => window.localStorage.setItem("gemini_key", apiKey), [apiKey]);

  const [ghostName] = useState(GHOST_NAMES[Math.floor(Math.random() * GHOST_NAMES.length)]);
  const [coachInput, setCoachInput] = useState("");
  const [tick, setTick] = useState(0);
  const timer = useTimer(847);
  const t = LANG[lang];

  const isGrowth = mode === "growth";
  const accent = isGrowth ? "#10b981" : "#f43f5e";
  const accentDim = isGrowth ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)";
  const accentGlow = isGrowth ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)";
  const radius = isGrowth ? "24px" : "12px";

  useEffect(() => {
    const id = setInterval(() => setTick(x => x + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const displayName = isGhost ? ghostName : userName;
  const displayAvatar = isGhost ? null : displayName.substring(0, 2).toUpperCase();

  const cardStyle = {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    backdropFilter: "blur(20px)",
    borderRadius: radius,
    transition: "border-radius 0.5s ease",
  };

  const accentCardStyle = {
    ...cardStyle,
    background: accentDim,
    border: `1px solid ${accentGlow}`,
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ 
        style: { background: "var(--card-bg)", color: "var(--text-main)", border: "1px solid var(--card-border)" }
      }} />
      
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div style={{
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
        display: "flex" // Changed from block to flex to support sidebar layout
      }}>
        {/* Ambient background glow */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: isGrowth
            ? "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(16,185,129,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 80% 80%, rgba(16,185,129,0.04) 0%, transparent 70%)"
            : "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(244,63,94,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(244,63,94,0.05) 0%, transparent 70%)",
          transition: "background 0.8s ease",
        }} />

        {/* Scanline overlay */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, var(--scanline) 2px, var(--scanline) 4px)",
        }} />
        
        {/* Static Sidebar spacer so the fixed absolute Sidebar doesn't overlap text */}
        <motion.div 
          animate={{ width: sidebarCollapsed ? 80 : 260 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ flexShrink: 0 }}
        />

        <Sidebar 
          t={t} accent={accent} accentDim={accentDim} accentGlow={accentGlow}
          lang={lang} setLang={setLang} langOpen={langOpen} setLangOpen={setLangOpen}
          mode={mode} setMode={setMode}
          isGhost={isGhost} setIsGhost={setIsGhost}
          displayAvatar={displayAvatar}
          openSettings={() => setSettingsOpen(true)}
          activeView={activeView} setActiveView={setActiveView}
          collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}
        />

        {/* Main Content Area */}
        <div style={{ flex: 1, position: "relative", zIndex: 2, padding: "40px 60px" }}>
          
          <UserWelcome t={t} displayName={displayName} isGhost={isGhost} />

          {/* ── CONDITIONAL VIEWS ── */}
          <AnimatePresence mode="wait">
            
            {activeView === "overview" && (
              <motion.div key="overview"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {isGrowth ? (
                  <div className="bento-grid">
                    <DailyStreak t={t} accent={accent} accentCardStyle={accentCardStyle} />
                    <MasteryTrees t={t} accent={accent} cardStyle={cardStyle} />
                    <ActivityChart t={t} accent={accent} cardStyle={cardStyle} />
                  </div>
                ) : (
                  <div className="bento-grid">
                    <GlobalRank t={t} accent={accent} accentCardStyle={accentCardStyle} isGhost={isGhost} />
                    <LiveLeaderboard accent={accent} accentDim={accentDim} accentGlow={accentGlow} cardStyle={cardStyle} isGhost={isGhost} ghostName={ghostName} />
                    <IntegrityScore t={t} accent={accent} cardStyle={cardStyle} />
                    <LiveChallenge t={t} accent={accent} accentGlow={accentGlow} accentCardStyle={accentCardStyle} timer={timer} />
                    <StatsSidebar accent={accent} cardStyle={cardStyle} />
                  </div>
                )}
              </motion.div>
            )}

            {activeView === "roadmap" && (
              <motion.div key="roadmap"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}
              >
                <AIRoadmapCard t={t} accent={accent} accentGlow={accentGlow} cardStyle={{...cardStyle, gridColumn: "span 12", minHeight: 400}} />
              </motion.div>
            )}

            {activeView === "coach" && (
              <motion.div key="coach"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}
              >
                <ConceptCoach 
                  t={t} accent={accent} accentGlow={accentGlow} cardStyle={{...cardStyle, gridColumn: "span 12", minHeight: 400}}
                  coachInput={coachInput} setCoachInput={setCoachInput} apiKey={apiKey}
                />
              </motion.div>
            )}

          </AnimatePresence>

          {activeView === "overview" && <ModeIndicator isGrowth={isGrowth} accent={accent} isGhost={isGhost} />}
        </div>
      </div>
      
      <AnimatePresence>
        {settingsOpen && (
          <SettingsModal 
            onClose={() => setSettingsOpen(false)}
            theme={theme} toggleTheme={toggleTheme}
            userName={userName} setUserName={setUserName}
            apiKey={apiKey} setApiKey={setApiKey}
            accent={accent} accentGlow={accentGlow}
          />
        )}
      </AnimatePresence>
    </>
  );
}

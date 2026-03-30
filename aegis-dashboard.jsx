import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

import { useTheme } from "./src/hooks/useTheme";
import { LANG } from "./src/constants/translations";
import { GHOST_NAMES } from "./src/constants/ghostNames";
import { useTimer } from "./src/hooks/useTimer";

import { SplashScreen } from "./src/components/layout/SplashScreen";
import { TopNavigation } from "./src/components/layout/TopNavigation";
import { UserWelcome } from "./src/components/layout/UserWelcome";
import { ModeIndicator } from "./src/components/layout/ModeIndicator";
import { SettingsModal } from "./src/components/layout/SettingsModal";

import { DailyStreak } from "./src/components/dashboard/growth/DailyStreak";
import { MasteryTrees } from "./src/components/dashboard/growth/MasteryTrees";
import { ActivityChart } from "./src/components/dashboard/growth/ActivityChart";
import { ConceptCoach } from "./src/components/dashboard/growth/ConceptCoach";
import { PersonalRoadmap } from "./src/components/dashboard/growth/PersonalRoadmap";

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
  
  // Settings & Profile
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userName, setUserName] = useState("Aryan Desai");
  const [apiKey, setApiKey] = useState(() => window.localStorage.getItem("anthropic_key") || "");
  useEffect(() => window.localStorage.setItem("anthropic_key", apiKey), [apiKey]);

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

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "0 20px 40px" }}>
          <TopNavigation 
            t={t} accent={accent} accentDim={accentDim} accentGlow={accentGlow}
            lang={lang} setLang={setLang} langOpen={langOpen} setLangOpen={setLangOpen}
            mode={mode} setMode={setMode}
            isGhost={isGhost} setIsGhost={setIsGhost}
            displayAvatar={displayAvatar}
            theme={theme} toggleTheme={toggleTheme}
            openSettings={() => setSettingsOpen(true)}
          />

          <UserWelcome 
            t={t} displayName={displayName} isGhost={isGhost}
          />

          {/* ── BENTO GRID ── */}
          <AnimatePresence mode="wait">
            {isGrowth ? (
              <motion.div key="growth"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bento-grid">
                
                <DailyStreak t={t} accent={accent} accentCardStyle={accentCardStyle} />
                <MasteryTrees t={t} accent={accent} cardStyle={cardStyle} />
                <ActivityChart t={t} accent={accent} cardStyle={cardStyle} />
                
                <ConceptCoach 
                  t={t} accent={accent} accentGlow={accentGlow} cardStyle={cardStyle}
                  coachInput={coachInput} setCoachInput={setCoachInput} apiKey={apiKey}
                />
                
                <PersonalRoadmap t={t} accent={accent} cardStyle={cardStyle} />

              </motion.div>
            ) : (
              <motion.div key="competitive"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bento-grid">
                
                <GlobalRank t={t} accent={accent} accentCardStyle={accentCardStyle} isGhost={isGhost} />
                <LiveLeaderboard accent={accent} accentDim={accentDim} accentGlow={accentGlow} cardStyle={cardStyle} isGhost={isGhost} ghostName={ghostName} />
                <IntegrityScore t={t} accent={accent} cardStyle={cardStyle} />
                
                <LiveChallenge t={t} accent={accent} accentGlow={accentGlow} accentCardStyle={accentCardStyle} timer={timer} />
                
                <StatsSidebar accent={accent} cardStyle={cardStyle} />
                
                {/* Concept coach is also available in competitive mode! */}
                <ConceptCoach 
                  t={t} accent={accent} accentGlow={accentGlow} cardStyle={cardStyle}
                  coachInput={coachInput} setCoachInput={setCoachInput} apiKey={apiKey}
                  isCompetitive={true}
                />

              </motion.div>
            )}
          </AnimatePresence>

          <ModeIndicator isGrowth={isGrowth} accent={accent} isGhost={isGhost} />
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

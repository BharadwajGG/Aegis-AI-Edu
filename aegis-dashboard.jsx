import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { LANG } from "./src/constants/translations";
import { GHOST_NAMES } from "./src/constants/ghostNames";
import { useTimer } from "./src/hooks/useTimer";

import { TopNavigation } from "./src/components/layout/TopNavigation";
import { UserWelcome } from "./src/components/layout/UserWelcome";
import { ModeIndicator } from "./src/components/layout/ModeIndicator";

import { DailyStreak } from "./src/components/dashboard/growth/DailyStreak";
import { MasteryTrees } from "./src/components/dashboard/growth/MasteryTrees";
import { FocusTime } from "./src/components/dashboard/growth/FocusTime";
import { ConceptCoach } from "./src/components/dashboard/growth/ConceptCoach";
import { PersonalRoadmap } from "./src/components/dashboard/growth/PersonalRoadmap";

import { GlobalRank } from "./src/components/dashboard/competitive/GlobalRank";
import { LiveLeaderboard } from "./src/components/dashboard/competitive/LiveLeaderboard";
import { IntegrityScore } from "./src/components/dashboard/competitive/IntegrityScore";
import { LiveChallenge } from "./src/components/dashboard/competitive/LiveChallenge";
import { StatsSidebar } from "./src/components/dashboard/competitive/StatsSidebar";

export default function AegisDashboard() {
  const [mode, setMode] = useState("growth");
  const [isGhost, setIsGhost] = useState(false);
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [ghostName] = useState(GHOST_NAMES[Math.floor(Math.random() * GHOST_NAMES.length)]);
  const [coachInput, setCoachInput] = useState("");
  const [tick, setTick] = useState(0);
  const timer = useTimer(847);
  const t = LANG[lang];

  const isGrowth = mode === "growth";
  const accent = isGrowth ? "#10b981" : "#f43f5e";
  const accentDim = isGrowth ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)";
  const accentGlow = isGrowth ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)";
  const radius = isGrowth ? "24px" : "6px";

  useEffect(() => {
    const id = setInterval(() => setTick(x => x + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const displayName = isGhost ? ghostName : "Aryan Desai";
  const displayAvatar = isGhost ? null : "AD";

  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
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
    <div style={{
      minHeight: "100vh",
      background: "#050505",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      color: "rgba(255,255,255,0.9)",
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
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)",
      }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "0 20px 40px" }}>
        <TopNavigation 
          t={t} accent={accent} accentDim={accentDim} accentGlow={accentGlow}
          lang={lang} setLang={setLang} langOpen={langOpen} setLangOpen={setLangOpen}
          mode={mode} setMode={setMode}
          isGhost={isGhost} setIsGhost={setIsGhost}
          displayAvatar={displayAvatar}
        />

        <UserWelcome 
          t={t} displayName={displayName} isGhost={isGhost}
        />

        {/* ── BENTO GRID ── */}
        <AnimatePresence mode="wait">
          {isGrowth ? (
            <motion.div key="growth"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
              
              <DailyStreak t={t} accent={accent} accentCardStyle={accentCardStyle} />
              <MasteryTrees t={t} accent={accent} cardStyle={cardStyle} />
              <FocusTime t={t} accent={accent} cardStyle={cardStyle} />
              
              <ConceptCoach 
                t={t} accent={accent} accentGlow={accentGlow} cardStyle={cardStyle}
                coachInput={coachInput} setCoachInput={setCoachInput}
              />
              
              <PersonalRoadmap t={t} accent={accent} cardStyle={cardStyle} />

            </motion.div>
          ) : (
            <motion.div key="competitive"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
              
              <GlobalRank t={t} accent={accent} accentCardStyle={accentCardStyle} isGhost={isGhost} />
              <LiveLeaderboard accent={accent} accentDim={accentDim} accentGlow={accentGlow} cardStyle={cardStyle} isGhost={isGhost} ghostName={ghostName} />
              <IntegrityScore t={t} accent={accent} cardStyle={cardStyle} />
              
              <LiveChallenge t={t} accent={accent} accentGlow={accentGlow} accentCardStyle={accentCardStyle} timer={timer} />
              
              <StatsSidebar accent={accent} cardStyle={cardStyle} />

            </motion.div>
          )}
        </AnimatePresence>

        <ModeIndicator isGrowth={isGrowth} accent={accent} isGhost={isGhost} />
      </div>
    </div>
  );
}

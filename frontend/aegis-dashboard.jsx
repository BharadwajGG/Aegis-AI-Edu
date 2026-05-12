import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { VideoIcon, Shield, ChevronRight } from "lucide-react";

import { useTheme } from "./src/hooks/useTheme";
import { LANG } from "./src/constants/translations";
import { GHOST_NAMES } from "./src/constants/ghostNames";
import { useAuth } from "./src/hooks/useAuth";
import { useIsMobile } from "./src/hooks/useIsMobile";

import { SplashScreen } from "./src/components/layout/SplashScreen";
import { Navbar } from "./src/components/layout/Navbar";
import { Footer } from "./src/components/layout/Footer";
import { SmoothScroll } from "./src/components/layout/SmoothScroll";
import { CustomCursor } from "./src/components/ui/CustomCursor";
import { SettingsModal } from "./src/components/layout/SettingsModal";
import { AuthLanding } from "./src/components/layout/AuthLanding";
import { RoleSelection } from "./src/components/layout/RoleSelection";
import { EmptyDashboard } from "./src/components/layout/EmptyDashboard";

import { DailyStreak } from "./src/components/dashboard/growth/DailyStreak";
import { MasteryTrees } from "./src/components/dashboard/growth/MasteryTrees";
import { ActivityChart } from "./src/components/dashboard/growth/ActivityChart";
import { ConceptCoach } from "./src/components/dashboard/growth/ConceptCoach";
import { AIRoadmapCard } from "./src/components/dashboard/growth/AIRoadmapCard";
import { CommunityHub } from "./src/components/dashboard/growth/CommunityHub";
import { ConsistencyTracker } from "./src/components/dashboard/growth/ConsistencyTracker";
import { GrowthCalendar } from "./src/components/dashboard/calendar/GrowthCalendar";
import { CalendarTicker } from "./src/components/dashboard/calendar/CalendarTicker";
import { useCalendarEngine } from "./src/hooks/useCalendarEngine";

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
  const [activeView, setActiveView] = useState("overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userName, setUserName] = useState("Aryan Desai");
  const [userCollege, setUserCollege] = useState("Maharashtra Institute of Technology (MIT)");
  const isMobile = useIsMobile();
  
  const { user, login, logout, loading, userRole, setRole } = useAuth();

  const [apiKey, setApiKey] = useState(() => {
    const saved = window.localStorage.getItem("gemini_key");
    if (saved === "AIzaSyAi39J90J6TLajkiXzEFBEq673DzZKiM1w") return "";
    return saved || "";
  });
  
  useEffect(() => window.localStorage.setItem("gemini_key", apiKey), [apiKey]);

  const [ghostName] = useState(GHOST_NAMES[Math.floor(Math.random() * GHOST_NAMES.length)]);
  const [coachInput, setCoachInput] = useState("");
  const t = LANG[lang];
  
  const activeUserEmail = user ? user.email : "student@example.edu";
  const activeDisplayName = user ? user.displayName : userName;
  const { events, addEvent, syncUniversityEvents } = useCalendarEngine(mode, activeUserEmail);

  const isGrowth = mode === "growth";
  const accent = isGrowth ? "#10b981" : "#f43f5e";
  const accentDim = isGrowth ? "rgba(16,185,129,0.05)" : "rgba(244,63,94,0.05)";
  const accentGlow = isGrowth ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)";
  
  const displayName = isGhost ? ghostName : activeDisplayName;

  const cardStyle = {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    backdropFilter: "blur(40px)",
    borderRadius: "24px",
  };

  const accentCardStyle = {
    ...cardStyle,
    background: accentDim,
    border: `1px solid ${accentGlow}`,
  };

  const isStudent = userRole === "student";

  if (loading) return <SplashScreen onComplete={() => setShowSplash(false)} />;
  if (!user) return <AuthLanding login={login} />;
  
  // If user is logged in but hasn't selected a role, show RoleSelection
  if (!userRole) {
    return <RoleSelection onSelect={setRole} />;
  }

  return (
    <SmoothScroll>
      <CustomCursor />
      <Toaster position="top-center" />
      
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div className="min-h-screen bg-gray-950 text-white selection:bg-purple-500/30">
        <Navbar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={user} 
          userRole={userRole}
          logout={logout} 
        />

        {/* Hero Background Gradient */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-purple-600/20 blur-[120px] rounded-full opacity-50" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[100px] rounded-full opacity-30" />
        </div>

        <main className="relative z-10 pt-32 px-6 md:px-16 lg:px-24 xl:px-32">
          
          {!isStudent && activeView === "overview" ? (
             <EmptyDashboard role={userRole} accent={accent} />
          ) : (
            <AnimatePresence mode="wait">
              {activeView === "overview" && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-20"
                >
                  {/* Spark-style Hero Section */}
                  <section className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 px-4 py-1.5 mb-8 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-md"
                    >
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="size-6 rounded-full bg-slate-800 border-2 border-gray-950 flex items-center justify-center text-[10px] font-bold">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400">Trusted by 10k+ high-performing students</p>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                      Master any concept with <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent italic">AEGIS</span>
                    </h1>
                    
                    <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
                      The ultimate student growth operating system. Intelligent roadmaps, Socratic coaching, and real-time performance tracking in one sleek interface.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <button 
                        onClick={() => setActiveView('airoadmap')}
                        className="px-8 h-12 bg-purple-600 hover:bg-purple-700 transition-all rounded-xl font-semibold flex items-center gap-2 group"
                      >
                        Get Started <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button className="px-8 h-12 border border-slate-800 hover:bg-slate-900 transition-all rounded-xl font-semibold flex items-center gap-2">
                        <VideoIcon size={18} /> Watch Demo
                      </button>
                    </div>
                  </section>

                  {/* Mode Toggle & Dashboard Grid */}
                  <section className="space-y-12">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-2 uppercase tracking-widest text-xs text-purple-500">Dashboard</h2>
                        <p className="text-slate-400 text-sm">Welcome back, <span className="text-white font-medium">{displayName}</span></p>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black mt-1">Logged in as: <span style={{ color: accent }}>{userRole}</span></p>
                      </div>
                      <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                        <button 
                          onClick={() => setMode('growth')}
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${isGrowth ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                          Growth
                        </button>
                        <button 
                          onClick={() => setMode('competitive')}
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${!isGrowth ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                          Competitive
                        </button>
                      </div>
                    </div>

                    <div className="bento-grid">
                      {isGrowth ? (
                        <>
                          <DailyStreak t={t} accent={accent} accentCardStyle={accentCardStyle} />
                          <MasteryTrees t={t} accent={accent} cardStyle={cardStyle} />
                          <ActivityChart t={t} accent={accent} cardStyle={cardStyle} />
                          <CalendarTicker t={t} accent={accent} accentCardStyle={accentCardStyle} events={events} mode={mode} />
                          <ConsistencyTracker t={t} accent={accent} cardStyle={cardStyle} />
                        </>
                      ) : (
                        <>
                          <GlobalRank t={t} accent={accent} accentCardStyle={accentCardStyle} isGhost={isGhost} />
                          <LiveLeaderboard accent={accent} accentDim={accentDim} accentGlow={accentGlow} cardStyle={cardStyle} isGhost={isGhost} ghostName={ghostName} />
                          <IntegrityScore t={t} accent={accent} cardStyle={cardStyle} />
                          <LiveChallenge t={t} accent={accent} accentGlow={accentGlow} accentCardStyle={accentCardStyle} />
                          <StatsSidebar accent={accent} cardStyle={cardStyle} />
                          <CalendarTicker t={t} accent={accent} accentCardStyle={accentCardStyle} events={events} mode={mode} />
                        </>
                      )}
                    </div>
                  </section>
                </motion.div>
              )}

              {activeView === "airoadmap" && (
                <motion.div key="roadmap" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto">
                  <AIRoadmapCard t={t} accent={accent} accentGlow={accentGlow} cardStyle={{...cardStyle, minHeight: 600}} apiKey={apiKey} />
                </motion.div>
              )}

              {activeView === "conceptcoach" && (
                <motion.div key="coach" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto">
                  <ConceptCoach t={t} accent={accent} accentGlow={accentGlow} cardStyle={{...cardStyle, minHeight: 600}} coachInput={coachInput} setCoachInput={setCoachInput} apiKey={apiKey} />
                </motion.div>
              )}

              {activeView === "community" && (
                <motion.div key="community" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto">
                  <CommunityHub t={t} accent={accent} accentGlow={accentGlow} accentDim={accentDim} cardStyle={{...cardStyle, minHeight: 600}} userCollege={userCollege} />
                </motion.div>
              )}

              {activeView === "calendar" && (
                <motion.div key="calendar" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto">
                  <GrowthCalendar t={t} accent={accent} accentDim={accentDim} accentGlow={accentGlow} cardStyle={{...cardStyle, minHeight: 600}} events={events} addEvent={addEvent} syncUniversityEvents={syncUniversityEvents} mode={mode} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>

        <Footer setActiveView={setActiveView} userRole={userRole} />
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
    </SmoothScroll>
  );
}

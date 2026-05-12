import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

export function AIRoadmapCard({ t, accent, accentGlow, cardStyle, apiKey }) {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [mode, setMode] = useState("Balanced");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPhases, setExpandedPhases] = useState({});

  const togglePhase = (index) => {
    setExpandedPhases(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const generateRoadmap = async () => {
    if (!goal) return setError("Please enter a goal (e.g., 'Learn React')");
    setError("");
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/roadmap/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, level, mode, api_key: apiKey }),
      });
      
      if (!res.ok) throw new Error("Failed to generate roadmap");

      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
      } else {
        throw new Error("Invalid format from server");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="bento-card md-col-span-7 p-8" style={cardStyle}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
          <Map size={20} />
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          AI Roadmap Generator
        </div>
      </div>

      {!roadmap ? (
        <div className="space-y-6">
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Enter your learning objective to generate a structured AI curriculum tailored to your pace and level.
          </p>
          
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What do you want to master? (e.g. System Design)"
            className="w-full px-5 py-4 rounded-xl border border-slate-800 bg-slate-900/30 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-white text-sm cursor-pointer outline-none focus:border-purple-500/50"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-white text-sm cursor-pointer outline-none focus:border-purple-500/50"
            >
              <option value="Relaxed">Relaxed Pace</option>
              <option value="Balanced">Balanced</option>
              <option value="Intensive">Intensive Bootcamp</option>
            </select>
          </div>

          {error && <div className="text-rose-500 text-xs font-medium bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</div>}

          <button
            onClick={generateRoadmap}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              loading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 active:scale-[0.98]"
            }`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Crafting Strategy..." : "Generate Roadmap"}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold tracking-tight text-white">{roadmap.title}</h3>
            <button 
              onClick={() => setRoadmap(null)}
              className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-purple-400 transition-colors"
            >
              Reset
            </button>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            {roadmap.summary}
          </p>

          <div className="space-y-4">
            <AnimatePresence>
              {roadmap.phases.map((phase, i) => (
                <div key={i} className={`rounded-2xl border transition-all duration-300 ${expandedPhases[i] ? "border-purple-500/30 bg-purple-500/5" : "border-slate-800 hover:border-slate-700 bg-slate-900/20"}`}>
                  <div 
                    onClick={() => togglePhase(i)}
                    className="p-5 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-purple-600/20">
                        {phase.phaseNumber || i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white leading-tight">{phase.title}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{phase.duration}</div>
                      </div>
                    </div>
                    <div className="text-slate-600">
                      {expandedPhases[i] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {expandedPhases[i] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5">
                      <div className="ml-12 border-l border-slate-800 pl-6 space-y-3">
                        <ul className="space-y-2">
                          {phase.topics?.map((topic, tIdx) => (
                            <li key={tIdx} className="text-sm text-slate-300 flex items-start gap-2 leading-relaxed">
                              <span className="mt-2 size-1 rounded-full bg-purple-500 shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                        
                        {phase.resources && phase.resources.length > 0 && (
                          <div className="pt-4 border-t border-slate-800 mt-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resources</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {phase.resources.map((res, rIdx) => (
                                <span key={rIdx} className="px-2 py-1 bg-slate-900 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-800">
                                  {res}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

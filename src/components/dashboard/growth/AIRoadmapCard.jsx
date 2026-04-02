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
      // Points to our new FastAPI Backend
      const res = await fetch("http://localhost:8000/api/roadmap/generate", {
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
    <motion.div layout className="bento-card md-col-span-7" style={{ ...cardStyle, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Map size={16} color={accent} />
        <div style={{ fontSize: 11, color: "var(--text-subtle)", letterSpacing: 2, fontWeight: 600 }}>
          AI ROADMAP GENERATOR
        </div>
      </div>

      {!roadmap ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 13, color: "var(--text-main)", marginBottom: 8 }}>
            Enter your learning objective to generate a structured AI curriculum.
          </p>
          
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What do you want to master? (e.g. System Design)"
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid var(--input-border)",
              background: "var(--input-bg)",
              color: "var(--text-main)",
              fontSize: 14,
              outline: "none"
            }}
          />

          <div style={{ display: "flex", gap: 12 }}>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 8,
                border: "1px solid var(--input-border)", background: "var(--input-bg)",
                color: "var(--text-main)", fontSize: 13, cursor: "pointer"
              }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 8,
                border: "1px solid var(--input-border)", background: "var(--input-bg)",
                color: "var(--text-main)", fontSize: 13, cursor: "pointer"
              }}
            >
              <option value="Relaxed">Relaxed Pace</option>
              <option value="Balanced">Balanced</option>
              <option value="Intensive">Intensive Bootcamp</option>
            </select>
          </div>

          {error && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>{error}</div>}

          <button
            onClick={generateRoadmap}
            disabled={loading}
            style={{
              background: accent,
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 8,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? "Crafting Strategy..." : "Generate Roadmap"}
          </button>
        </div>
      ) : (
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-main)", fontWeight: 700 }}>
              {roadmap.title}
            </h3>
            <button 
              onClick={() => setRoadmap(null)}
              style={{
                background: "transparent", border: "none", color: "var(--text-subtle)",
                cursor: "pointer", fontSize: 12, textDecoration: "underline"
              }}
            >
              Reset
            </button>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-subtle)", marginBottom: 24, lineHeight: 1.5 }}>
            {roadmap.summary}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AnimatePresence>
              {roadmap.phases.map((phase, i) => (
                <div key={i} style={{ 
                    border: `1px solid var(--card-border)`, 
                    borderRadius: 12, 
                    overflow: "hidden",
                    background: expandedPhases[i] ? "var(--bg-card-hover, rgba(0,0,0,0.02))" : "transparent",
                    transition: "all 0.2s"
                  }}
                >
                  <div 
                    onClick={() => togglePhase(i)}
                    style={{
                      padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: expandedPhases[i] ? `linear-gradient(90deg, ${accentGlow}, transparent)` : "transparent",
                      borderBottom: expandedPhases[i] ? `1px solid var(--card-border)` : "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: accent, color: "#fff", display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold"
                      }}>
                        {phase.phaseNumber || i + 1}
                      </div>
                      <div>
                        <div style={{ color: "var(--text-main)", fontSize: 14, fontWeight: 600 }}>
                          {phase.title}
                        </div>
                        <div style={{ color: "var(--text-subtle)", fontSize: 11, marginTop: 2 }}>
                          {phase.duration}
                        </div>
                      </div>
                    </div>
                    {expandedPhases[i] ? <ChevronUp size={16} color="var(--text-subtle)" /> : <ChevronDown size={16} color="var(--text-subtle)" />}
                  </div>

                  {expandedPhases[i] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ padding: "0 16px 16px 56px" }}
                    >
                      <ul style={{ margin: 0, paddingLeft: 16, color: "var(--text-subtle)", fontSize: 13, lineHeight: 1.6 }}>
                        {phase.topics?.map((topic, tIdx) => (
                          <li key={tIdx}>{topic}</li>
                        ))}
                      </ul>
                      
                      {phase.resources && phase.resources.length > 0 && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed var(--card-border)" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-main)", textTransform: "uppercase", letterSpacing: 1 }}>
                            Recommended Resources:
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                            {phase.resources.map((res, rIdx) => (
                              <span key={rIdx} style={{ 
                                padding: "4px 8px", background: "var(--input-bg)", 
                                borderRadius: 4, fontSize: 11, color: "var(--text-subtle)" 
                              }}>
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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

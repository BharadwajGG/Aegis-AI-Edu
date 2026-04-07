import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Send, RefreshCw, Key, Lightbulb, CheckCircle2 } from "lucide-react";
import { PulseDot } from "../../ui/PulseDot";
import { fetchConceptCoach } from "../../../utils/geminiApi";
import { playPop, playSuccess } from "../../../utils/audioUtils";
import toast from "react-hot-toast";

export function ConceptCoach({ t, accent, accentGlow, cardStyle, apiKey, isCompetitive }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [unlockedHints, setUnlockedHints] = useState(0); // 0-4
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setCoachData(null);
    setUnlockedHints(0);
    
    try {
      const res = await fetchConceptCoach(input, apiKey, "Progressive Coach");
      if (typeof res === "string" && res.includes("Mock Mode Active")) {
        // Fallback for mock strings if no API key
        setCoachData({ hint1: res, hint2: "", hint3: "", answer: "" });
      } else {
        setCoachData(res);
      }
      setUnlockedHints(1); // Auto unlock hint 1
      setInput("");
    } catch (err) {
      toast.error(err.message || "Failed to load AI hints");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const unlockNext = () => {
    setUnlockedHints(prev => {
      const next = Math.min(prev + 1, 4);
      if (next === 4) playSuccess();
      else playPop();
      return next;
    });
  };

  return (
    <motion.div className={`bento-card ${isCompetitive ? 'md-col-span-12' : 'md-col-span-5'}`} style={{ ...cardStyle, padding: 24, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Brain size={14} color={accent} />
          <div style={{ fontSize: 9, color: "var(--text-subtle)", letterSpacing: 2 }}>
            CONCEPT COACH
          </div>
          <PulseDot color={accent} />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, overflowY: "auto" }}>
        
        {/* Placeholder / Welcome state */}
        {!coachData && !loading && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--text-subtle)", fontSize: 13 }}>
            Paste a complex problem, code snippet, or mathematical equation below. 
            The AI will give you progressive hints instead of spoiling the answer immediately!
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 16, color: accent }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RefreshCw size={14} />
            </motion.div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Analyzing problem constraints...</span>
          </div>
        )}

        {/* Sequential Rendered Content */}
        {coachData && (
          <AnimatePresence>
            {unlockedHints >= 1 && coachData.hint1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: 16, background: "var(--card-bg)", border: `1px solid ${accentGlow}`, borderRadius: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: accent, marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Lightbulb size={12} /> HINT 1: BROAD CONCEPT
                </div>
                <div style={{ fontSize: 13, color: "var(--text-main)", lineHeight: 1.6 }}>{coachData.hint1}</div>
                {unlockedHints === 1 && (
                  <button onClick={unlockNext} style={{ marginTop: 12, padding: "8px 12px", background: "var(--input-bg)", color: "var(--text-main)", border: "1px solid var(--input-border)", borderRadius: 8, fontSize: 11, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Key size={12} /> Unlock Hint 2
                  </button>
                )}
              </motion.div>
            )}

            {unlockedHints >= 2 && coachData.hint2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: 16, background: "var(--card-bg)", border: `1px solid ${accentGlow}`, borderRadius: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: accent, marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Lightbulb size={12} /> HINT 2: SPECIFIC APPROACH
                </div>
                <div style={{ fontSize: 13, color: "var(--text-main)", lineHeight: 1.6 }}>{coachData.hint2}</div>
                {unlockedHints === 2 && (
                  <button onClick={unlockNext} style={{ marginTop: 12, padding: "8px 12px", background: "var(--input-bg)", color: "var(--text-main)", border: "1px solid var(--input-border)", borderRadius: 8, fontSize: 11, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Key size={12} /> Unlock Hint 3
                  </button>
                )}
              </motion.div>
            )}

            {unlockedHints >= 3 && coachData.hint3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: 16, background: "var(--card-bg)", border: `1px solid ${accentGlow}`, borderRadius: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: accent, marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Lightbulb size={12} /> HINT 3: SOLUTION GUIDANCE
                </div>
                <div style={{ fontSize: 13, color: "var(--text-main)", lineHeight: 1.6 }}>{coachData.hint3}</div>
                {unlockedHints === 3 && (
                  <button onClick={unlockNext} style={{ marginTop: 12, padding: "8px 14px", background: accent, color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={12} /> Reveal Direct Answer
                  </button>
                )}
              </motion.div>
            )}

            {unlockedHints >= 4 && coachData.answer && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                style={{ padding: 16, background: "rgba(16, 185, 129, 0.05)", border: `1px solid rgba(16, 185, 129, 0.3)`, borderRadius: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Sparkles size={12} /> FINAL OPTIMIZED ANSWER
                </div>
                <div style={{ fontSize: 13, color: "var(--text-main)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{coachData.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your problem here... (Shift+Enter for new line)"
          disabled={loading}
          style={{
            flex: 1, padding: "12px 14px", borderRadius: 10,
            background: "var(--input-bg)",
            border: "1px solid var(--input-border)",
            color: "var(--text-main)", fontSize: 13, lineHeight: 1.5,
            outline: "none", opacity: loading ? 0.6 : 1, fontFamily: "inherit",
            resize: "none", minHeight: "44px"
          }}
        />
        <button type="submit" disabled={loading} style={{
          padding: "12px 16px", borderRadius: 10, height: "44px",
          background: accent, border: "none", flexShrink: 0,
          color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600,
          opacity: loading || !input.trim() ? 0.6 : 1, display: "flex", alignItems: "center"
        }}>
          <Send size={15} />
        </button>
      </form>
    </motion.div>
  );
}

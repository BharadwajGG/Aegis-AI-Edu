import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Send, RefreshCw, Key, Lightbulb } from "lucide-react";
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
    <motion.div className={`bento-card p-8 flex flex-col ${isCompetitive ? 'md-col-span-12' : 'md-col-span-5'}`} style={cardStyle}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Brain size={20} />
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Concept Coach
          </div>
          <PulseDot color={accent} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 mb-8 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {!coachData && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-900/20 rounded-[24px] border border-slate-800/50">
            <Lightbulb className="text-purple-500/50 mb-4" size={40} />
            <p className="text-sm text-slate-400 leading-relaxed max-w-[240px]">
              Paste a complex problem below. The AI will give you progressive hints instead of spoiling the answer immediately!
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 p-5 bg-purple-500/5 rounded-2xl border border-purple-500/10 text-purple-400">
            <RefreshCw size={18} className="animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Analyzing problem constraints...</span>
          </div>
        )}

        {coachData && (
          <AnimatePresence>
            {[1, 2, 3].map(i => (
              unlockedHints >= i && coachData[`hint${i}`] && (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3"
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                    <Lightbulb size={14} /> Hint {i}: {i === 1 ? "Broad Concept" : i === 2 ? "Specific Approach" : "Solution Guidance"}
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed">{coachData[`hint${i}`]}</div>
                  {unlockedHints === i && (
                    <button 
                      onClick={unlockNext} 
                      className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-slate-700"
                    >
                      <Key size={12} /> {i < 3 ? `Unlock Hint ${i+1}` : "Reveal Direct Answer"}
                    </button>
                  )}
                </motion.div>
              )
            ))}

            {unlockedHints >= 4 && coachData.answer && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  <Sparkles size={14} /> Final Optimized Answer
                </div>
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{coachData.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your problem here..."
          disabled={loading}
          className="flex-1 p-4 rounded-xl bg-slate-900/30 border border-slate-800 text-white text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 resize-none min-h-[48px]"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()} 
          className={`size-12 rounded-xl flex items-center justify-center transition-all ${
            loading || !input.trim()
              ? "bg-slate-800 text-slate-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 active:scale-[0.98]"
          }`}
        >
          <Send size={20} />
        </button>
      </form>
    </motion.div>
  );
}

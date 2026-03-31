import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Send, RefreshCw } from "lucide-react";
import { PulseDot } from "../../ui/PulseDot";
import { fetchConceptCoach } from "../../../utils/geminiApi";
import toast from "react-hot-toast";

export function ConceptCoach({ t, accent, accentGlow, cardStyle, apiKey, isCompetitive }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(t.coachTip);
  const [mode, setMode] = useState("socratic"); // "socratic" | "direct"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse(""); // Clear for loading state
    try {
      const systemPrompt = mode === "socratic" 
        ? "You are a concept coach. Do not directly give the final answer. Instead, provide hints based on the student's current understanding, ask thought-provoking questions, and give small quizzes to help them discover the answer themselves. Your goal is to make the core concepts clear through guided discovery." 
        : "You are a competitive tutor. Give the concise, mathematically direct answer instantly.";
      
      const res = await fetchConceptCoach(input, apiKey, systemPrompt);
      setResponse(res);
      setInput("");
    } catch (err) {
      toast.error(err.message);
      setResponse("Failed to connect to AI. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div layout className={`bento-card ${isCompetitive ? 'md-col-span-12' : 'md-col-span-5'}`} style={{ ...cardStyle, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Brain size={14} color={accent} />
          <div style={{ fontSize: 9, color: "var(--text-subtle)", letterSpacing: 2 }}>
            {t.conceptCoach.toUpperCase()}
          </div>
          <PulseDot color={accent} />
        </div>
        
        {/* Toggle Mode */}
        <div style={{ display: "flex", background: "var(--input-bg)", padding: 2, borderRadius: 6, border: "1px solid var(--input-border)" }}>
          <button onClick={() => setMode("socratic")} style={{
            fontSize: 10, padding: "4px 8px", borderRadius: 4, cursor: "pointer", border: "none",
            background: mode === "socratic" ? accent : "transparent",
            color: mode === "socratic" ? "#fff" : "var(--text-muted)", transition: "all 0.2s"
          }}>Socratic</button>
          <button onClick={() => setMode("direct")} style={{
            fontSize: 10, padding: "4px 8px", borderRadius: 4, cursor: "pointer", border: "none",
            background: mode === "direct" ? accent : "transparent",
            color: mode === "direct" ? "#fff" : "var(--text-muted)", transition: "all 0.2s"
          }}>Direct</button>
        </div>
      </div>

      <div style={{
        padding: "14px 16px", borderRadius: 12,
        background: "var(--card-bg)",
        border: `1px solid ${accentGlow}`,
        marginBottom: 14, minHeight: 60,
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          {loading ? (
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ marginTop: 2, flexShrink: 0 }}>
               <RefreshCw size={13} color={accent} />
             </motion.div>
          ) : (
             <Sparkles size={13} color={accent} style={{ marginTop: 2, flexShrink: 0 }} />
          )}
          <div style={{ fontSize: 12, color: "var(--text-main)", lineHeight: 1.7 }}>
            {loading ? "Thinking..." : response}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t.coachPrompt}
          disabled={loading}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10,
            background: "var(--input-bg)",
            border: "1px solid var(--input-border)",
            color: "var(--text-main)", fontSize: 12,
            outline: "none", opacity: loading ? 0.6 : 1, fontFamily: "inherit"
          }}
        />
        <button type="submit" disabled={loading} style={{
          padding: "10px 16px", borderRadius: 10,
          background: accent, border: "none",
          color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600,
          opacity: loading ? 0.6 : 1, display: "flex", alignItems: "center"
        }}>
          <Send size={14} />
        </button>
      </form>
    </motion.div>
  );
}

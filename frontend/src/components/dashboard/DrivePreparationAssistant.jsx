import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Zap, CheckCircle2, AlertCircle, BookOpen, 
  Code, FileText, Target, ChevronRight, Loader2 
} from "lucide-react";

export function DrivePreparationAssistant({ driveId, cardStyle }) {
  const [prepData, setPrepData] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState(null);
  const [generatingGuide, setGeneratingGuide] = useState(false);

  useEffect(() => {
    // ... same as before
    if (!driveId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prepRes, eligRes] = await Promise.all([
          fetch(`http://localhost:8000/api/drives/${driveId}/roadmap`),
          fetch(`http://localhost:8000/api/drives/${driveId}/eligibility`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              skills: ["Python", "React", "DSA"],
              interests: ["AI/ML", "Web"],
              gpa: 8.2
            })
          })
        ]);
        const prep = await prepRes.json();
        const elig = await eligRes.json();
        setPrepData(prep);
        setEligibility(elig);
      } catch (err) {
        console.error("Error fetching prep data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [driveId]);

  const handleGenerateGuide = async () => {
    setGeneratingGuide(true);
    try {
      const res = await fetch(`http://localhost:8000/api/drives/${driveId}/guide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: ["Python", "React", "DSA"],
          interests: ["AI/ML", "Web"],
          gpa: 8.2
        })
      });
      const data = await res.json();
      setGuide(data);
    } catch (err) {
      console.error("Error generating guide:", err);
    } finally {
      setGeneratingGuide(false);
    }
  };

  if (loading) return (
    <div className="p-12 flex flex-col items-center justify-center text-slate-500">
      <Loader2 size={32} className="animate-spin mb-4 text-purple-500" />
      <p className="text-sm font-medium">AI is crafting your preparation strategy...</p>
    </div>
  );

  if (!prepData) return null;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      {/* Eligibility Section */}
      <section style={cardStyle} className="p-6 border-l-4 border-l-purple-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-purple-400" />
            <h3 className="font-bold text-lg">Eligibility Checker</h3>
          </div>
          {eligibility?.is_eligible ? (
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 size={14} /> ELIGIBLE
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 text-xs font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              <AlertCircle size={14} /> NOT ELIGIBLE
            </span>
          )}
        </div>

        {eligibility?.missing_requirements.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-black text-slate-500 uppercase mb-2">Missing Requirements</p>
            <div className="space-y-1">
              {eligibility.missing_requirements.map(req => (
                <div key={req} className="flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle size={12} /> {req}
                </div>
              ))}
            </div>
          </div>
        )}

        {eligibility?.suggestions.length > 0 && (
          <div>
            <p className="text-xs font-black text-slate-500 uppercase mb-2">AI Recommendations to Qualify</p>
            <div className="space-y-2">
              {eligibility.suggestions.map((sug, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                  {sug}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Roadmap Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div style={cardStyle} className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-blue-400" />
            <h3 className="font-bold text-lg">5-Day Prep Roadmap</h3>
          </div>
          <div className="space-y-6">
            {prepData.roadmap.map((step, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute left-0 top-0 size-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  {step.day}
                </div>
                {idx < prepData.roadmap.length - 1 && (
                  <div className="absolute left-[11px] top-6 w-[2px] h-10 bg-slate-800" />
                )}
                <p className="text-sm text-slate-300 leading-relaxed">{step.task}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div style={cardStyle} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code size={20} className="text-emerald-400" />
              <h3 className="font-bold text-lg">High-Yield DSA Topics</h3>
            </div>
            <div className="space-y-3">
              {prepData.recommended_questions.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-all cursor-pointer group">
                  <span className="text-xs text-slate-300 font-medium group-hover:text-emerald-400">{q}</span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-emerald-400" />
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-amber-400" />
              <h3 className="font-bold text-lg">Resume Enhancements</h3>
            </div>
            <div className="space-y-3">
              {prepData.resume_tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <Zap size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!guide ? (
        <button 
          onClick={handleGenerateGuide}
          disabled={generatingGuide}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-bold text-white shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {generatingGuide ? (
            <><Loader2 className="animate-spin" size={20} /> Crafting your guide...</>
          ) : (
            <><Zap size={20} /> Generate Personalized Study Guide</>
          )}
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={cardStyle} 
          className="p-8 border-2 border-purple-500/30 bg-purple-500/5 shadow-2xl shadow-purple-500/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="size-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{guide.title}</h3>
              <p className="text-slate-400 text-sm italic">{guide.final_tip}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-widest font-black text-purple-400">Focus Areas</h4>
              {guide.focus_areas.map((area, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-bold text-slate-200 mb-1">{area.topic}</p>
                  <p className="text-xs text-slate-400 mb-3">{area.reason}</p>
                  <div className="flex flex-wrap gap-2">
                    {area.resources.map(res => (
                      <span key={res} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">{res}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-widest font-black text-blue-400">Preparation Schedule</h4>
              <div className="space-y-3">
                {guide.daily_plan.map(item => (
                  <div key={item.day} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                    <span className="text-blue-500 font-black text-sm">D{item.day}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.activity}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-xs uppercase tracking-widest font-black text-emerald-400 mb-4">Sample Interview Questions</h4>
                <div className="space-y-2">
                  {guide.interview_questions.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-emerald-200/70 italic">
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

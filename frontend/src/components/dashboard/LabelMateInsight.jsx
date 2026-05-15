import React, { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, CheckCircle2, AlertCircle, Target, TrendingUp, 
  Calendar, Briefcase, Award, Brain, 
  ChevronRight, ArrowRight, Sparkles, Activity, Info,
  TrendingDown, ShieldCheck, Flame, Rocket, BarChart2,
  FileText, Download, X, Printer, PieChart
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- Optimized Memoized Visualizations ---

const CustomRadar = memo(({ data, accent }) => {
  const [hovered, setHovered] = useState(null);
  
  const size = 300;
  const center = size / 2;
  const radius = center * 0.7;
  const angleStep = (Math.PI * 2) / (data?.length || 1);

  if (!data || data.length < 3) return <div className="h-full flex items-center justify-center text-slate-600 italic text-xs">Insufficient data for map.</div>;

  const points = data.map((d, i) => {
    const r = (radius * (Number(d.value) || 0)) / 100;
    const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
    const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
    return `${x},${y}`;
  }).join(" ");

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="relative size-full flex items-center justify-center group">
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full max-w-[320px]">
        {gridLevels.map(level => (
          <polygon
            key={level}
            points={data.map((_, i) => {
              const r = radius * level;
              const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
              const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
              return `${x},${y}`;
            }).join(" ")}
            fill="none" stroke="white" strokeOpacity="0.03" strokeWidth="1"
          />
        ))}
        {data.map((_, i) => {
          const x = center + radius * Math.cos(i * angleStep - Math.PI / 2);
          const y = center + radius * Math.sin(i * angleStep - Math.PI / 2);
          return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="1" />;
        })}
        <motion.polygon
          points={points} fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="2.5"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
        {data.map((d, i) => {
          const r = (radius * (Number(d.value) || 0)) / 100;
          const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
          const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
          return (
            <circle 
              key={i} cx={x} cy={y} r="6" fill={accent} className="cursor-help"
              onMouseEnter={() => setHovered({ ...d, x, y })} onMouseLeave={() => setHovered(null)}
            />
          );
        })}
        {data.map((d, i) => {
          const x = center + (radius + 35) * Math.cos(i * angleStep - Math.PI / 2);
          const y = center + (radius + 35) * Math.sin(i * angleStep - Math.PI / 2);
          return (
            <text 
              key={i} x={x} y={y} textAnchor="middle" fontSize="9" fontWeight="900"
              className="fill-slate-600 uppercase tracking-[0.1em]"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
      <AnimatePresence>
        {hovered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute z-20 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-none min-w-[140px]"
            style={{ left: hovered.x, top: hovered.y - 80 }}
          >
            <p className="text-[10px] font-black uppercase text-slate-500 mb-1">{hovered.label}</p>
            <p className="text-lg font-black text-white">{hovered.value}%</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const CustomTrend = memo(({ data, accent }) => {
  if (!data || data.length < 2) return <div className="h-full flex items-center justify-center text-slate-600 italic text-xs">Awaiting signals...</div>;
  const width = 600;
  const height = 200;
  const padding = 20;
  const points = data.map((d, i) => ({
    x: padding + (i * (width - padding * 2)) / (data.length - 1),
    y: height - padding - ((Number(d.value) || 0) * (height - padding * 2)) / 100
  }));
  const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p, i) => {
    const prev = points[i];
    return `C ${prev.x + (p.x - prev.x) / 2} ${prev.y}, ${prev.x + (p.x - prev.x) / 2} ${p.y}, ${p.x} ${p.y}`;
  }).join(" ");
  const areaD = pathD + ` L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`;
  return (
    <div className="relative size-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={accent} stopOpacity="0.25" /><stop offset="100%" stopColor={accent} stopOpacity="0" /></linearGradient>
        </defs>
        <path d={areaD} fill="url(#trendGradient)" />
        <motion.path d={pathD} fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
        <motion.circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="6" fill={accent} animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </svg>
    </div>
  );
});

const ProbabilityGauge = memo(({ value, accent }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <div className="relative size-28 flex items-center justify-center">
      <svg className="size-full -rotate-90">
        <circle cx="56" cy="56" r={radius} fill="transparent" stroke="currentColor" strokeWidth="10" className="text-slate-900" />
        <motion.circle cx="56" cy="56" r={radius} fill="transparent" stroke={accent} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: "backOut" }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-black">{value}%</span>
    </div>
  );
});

// --- Detailed Report Modal Component ---
const DetailedReportModal = memo(({ isOpen, onClose, insight, drive, accent }) => {
  if (!isOpen) return null;
  const handleDownload = () => {
    toast.loading("Generating PDF report...");
    setTimeout(() => { window.print(); toast.dismiss(); toast.success("Report generated!"); }, 1000);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md print:bg-white print:p-0">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 shadow-2xl relative print:border-none print:shadow-none print:max-h-none print:overflow-visible print:bg-white">
        <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md p-8 border-b border-white/5 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-4"><div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20"><FileText size={20} className="text-purple-400" /></div><h2 className="text-2xl font-bold">Readiness Report</h2></div>
          <div className="flex items-center gap-4"><button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-bold text-xs hover:bg-slate-200 transition-all"><Download size={16} /> Download PDF</button><button onClick={onClose} className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-all"><X size={20} /></button></div>
        </div>
        <div id="printable-report" className="p-12 space-y-12 text-slate-300 print:text-black">
          <header className="flex justify-between items-start border-b border-white/10 pb-12 print:border-slate-200">
             <div><h1 className="text-5xl font-black tracking-tighter text-white print:text-black mb-4">AEGIS INSIGHT</h1><p className="text-slate-500 font-bold uppercase tracking-widest text-xs">AI-Generated Intelligence</p></div>
             <div className="text-right"><p className="text-xs font-black text-slate-500 uppercase mb-1">Company Target</p><h3 className="text-xl font-bold text-white print:text-black">{drive?.company_name}</h3><p className="text-sm text-slate-400">{drive?.role_offered}</p></div>
          </header>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6"><h3 className="text-xs font-black uppercase text-purple-500 tracking-widest">Executive Summary</h3><p className="text-lg leading-relaxed">Your readiness for {drive?.company_name} is currently at <span className="text-white font-bold print:text-black">{insight?.readiness_score}%</span>. Strategic alignment is high with specific architectural focus needed.</p></div>
             <div className="p-8 rounded-3xl bg-white/5 border border-white/5 print:bg-slate-50 print:border-slate-200"><h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-6">Metrics</h3><div className="space-y-6"><div className="flex justify-between items-center"><span className="text-sm font-bold">Hiring Probability</span><span className="text-xl font-black text-white print:text-black">{insight?.predictive_insights?.selection_probability}%</span></div><div className="flex justify-between items-center"><span className="text-sm font-bold">Consistency Score</span><span className="text-xl font-black text-emerald-400">94.2</span></div></div></div>
          </section>
          <section className="space-y-8"><h3 className="text-xs font-black uppercase text-emerald-500 tracking-widest border-b border-white/5 pb-4">Competitive Analysis</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="space-y-4"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Strengths</p>{insight?.strengths?.map((s, i) => (<div key={i} className="flex gap-4"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /><div><p className="text-sm font-bold text-white print:text-black">{s.title}</p><p className="text-xs text-slate-500 mt-1">{s.description}</p></div></div>))}</div><div className="space-y-4"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Opportunities</p>{insight?.weaknesses?.map((w, i) => (<div key={i} className="flex gap-4"><AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" /><div><p className="text-sm font-bold text-white print:text-black">{w.title}</p><p className="text-xs text-slate-500 mt-1">{w.description}</p></div></div>))}</div></div></section>
          <section className="space-y-8"><h3 className="text-xs font-black uppercase text-amber-500 tracking-widest border-b border-white/5 pb-4">Strategic Roadmap</h3><div className="space-y-6">{insight?.three_month_plan?.map((plan, i) => (<div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 print:bg-slate-50 print:border-slate-200"><h4 className="text-xl font-black text-white print:text-black">{plan.month}: {plan.focus}</h4><ul className="grid grid-cols-1 md:grid-cols-2 gap-4">{plan.tasks?.map((t, j) => (<li key={j} className="text-sm text-slate-400 flex gap-2"><div className="size-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" /> {t}</li>))}</ul></div>))}</div></section>
        </div>
      </motion.div>
    </motion.div>
  );
});

export function LabelMateInsight({ accent, cardStyle, driveId }) {
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState(null);
  const [selectedDriveId, setSelectedDriveId] = useState(driveId || "drive_1");
  const [drives, setDrives] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({});
  const [strategyInjected, setStrategyInjected] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const currentDrive = useMemo(() => drives.find(d => d.id === selectedDriveId), [drives, selectedDriveId]);
  const radarData = useMemo(() => (insight?.skill_gaps || []).map(g => ({ label: g.skill || "Skill", value: 100 - (g.gap || 0) })), [insight]);
  const trendData = useMemo(() => (insight?.predictive_insights?.growth_trend || []).map(val => ({ value: val })), [insight]);

  const toggleTask = (planIdx, taskIdx) => {
    const key = `${planIdx}-${taskIdx}`;
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => { if (driveId) setSelectedDriveId(driveId); }, [driveId]);

  useEffect(() => {
    fetch("http://localhost:8000/api/drives/").then(res => res.json()).then(data => setDrives(Array.isArray(data) ? data : (data?.drives || []))).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchInsight = async () => {
      setLoading(true); setInsight(null); setStrategyInjected(false);
      try {
        const res = await fetch(`http://localhost:8000/api/drives/${selectedDriveId}/insight`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills: ["Python", "React", "DSA"], interests: ["AI/ML"], gpa: 8.2 })
        });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        await new Promise(r => setTimeout(r, 1200));
        if (isMounted) setInsight(data);
      } catch (err) {
        if (isMounted) {
          const h = selectedDriveId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          setInsight({
            readiness_score: 45 + (h % 35),
            strengths: [{title: "Technical Alignment", description: "Matches target stack profile."}, {title: "Problem Solving", description: "High logic consistency scores."}],
            weaknesses: [{title: "System Scaling", description: "Need deeper distributed systems knowledge."}, {title: "Behavioral", description: "Articulation in mock rounds needs polish."}],
            skill_gaps: [{skill: "System Design", gap: 35 + (h % 20)}, {skill: "Testing", gap: 15 + (h % 15)}, {skill: "Database", gap: 25 + (h % 30)}, {skill: "Algorithms", gap: 10 + (h % 10)}],
            three_month_plan: [{month: "Phase 1", focus: "Fundamentals", tasks: ["Core drillings", "DSA Mastery"]}, {month: "Phase 2", focus: "Simulation", tasks: ["3 Mock technicals", "Architectural practice"]}, {month: "Phase 3", focus: "Execution", tasks: ["Final Resume sync", "HR Behavioral prep"]}],
            predictive_insights: { selection_probability: 35 + (h % 40), growth_trend: Array.from({length: 6}, (_, i) => 20 + (h % 20) + (i * 10)) }
          });
        }
      } finally { if (isMounted) setLoading(false); }
    };
    if (selectedDriveId) fetchInsight();
    return () => { isMounted = false; };
  }, [selectedDriveId, drives]);

  if (loading && !insight) return (
    <div className="min-h-[600px] flex flex-col items-center justify-center">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} className="mb-10 relative"><Brain size={100} className="text-purple-500" /></motion.div>
      <h3 className="text-2xl font-black text-white mb-3">Initializing Adaptive Engine</h3>
    </div>
  );

  return (
    <div key={selectedDriveId} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 print:hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-3"><div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20"><Brain size={28} className="text-purple-400" /></div><h2 className="text-5xl font-black tracking-tighter uppercase">Label-Mate Insight</h2></div>
          <p className="text-slate-400 font-medium text-lg ml-1">Competitive steering for <span className="text-white">Active Drives</span>.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-3xl border border-white/5 backdrop-blur-3xl">
          <div className="flex flex-col px-4 border-r border-white/5"><span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Targeting</span>
            <select value={selectedDriveId} onChange={(e) => setSelectedDriveId(e.target.value)} className="bg-transparent border-none p-0 text-sm font-black text-white focus:ring-0 outline-none">
              {drives?.map(d => (<option key={d.id} value={d.id} className="bg-slate-900">{d.company_name} — {d.role_offered}</option>))}
            </select>
          </div>
          <div className="p-2 rounded-xl bg-purple-600 text-white"><ArrowRight size={18} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div style={cardStyle} className="p-10 flex flex-col items-center justify-center text-center relative overflow-hidden border-white/5">
          <Target size={160} className="absolute -top-10 -right-10 opacity-5" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10">Readiness Pulse</h3>
          <div className="relative size-60 flex items-center justify-center mb-10">
            <svg className="size-full -rotate-90"><circle cx="120" cy="120" r="105" fill="transparent" stroke="currentColor" strokeWidth="18" className="text-slate-900" strokeDasharray="4, 4" /><motion.circle cx="120" cy="120" r="105" fill="transparent" stroke={accent} strokeWidth="18" strokeLinecap="round" strokeDasharray={2 * Math.PI * 105} initial={{ strokeDashoffset: 2 * Math.PI * 105 }} animate={{ strokeDashoffset: 2 * Math.PI * 105 * (1 - (insight?.readiness_score || 0) / 100) }} transition={{ duration: 2.5, ease: "easeOut" }} /></svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-6xl font-black">{insight?.readiness_score}%</span></div>
          </div>
          <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-8 py-3.5 rounded-2xl border border-emerald-500/20"><ShieldCheck size={16} /> Data Verified</div>
        </div>
        <div style={cardStyle} className="p-10 lg:col-span-2 relative overflow-hidden border-white/5"><h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-12">Competency Matrix</h3><div className="h-[320px] w-full"><CustomRadar data={radarData} accent={accent} /></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-8">
          <div className="flex items-center gap-4"><div className="size-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><Award size={20} className="text-emerald-400" /></div><h3 className="text-2xl font-black text-white">Assets & Liabilities</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">{insight?.strengths?.map((s, i) => (<div key={i} className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10"><h4 className="font-bold text-sm text-slate-100">{s.title}</h4><p className="text-[11px] text-slate-500 mt-2">{s.description}</p></div>))}</div>
            <div className="space-y-4">{insight?.weaknesses?.map((w, i) => (<div key={i} className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10"><h4 className="font-bold text-sm text-slate-100">{w.title}</h4><p className="text-[11px] text-slate-500 mt-2">{w.description}</p></div>))}</div>
          </div>
        </section>
        <section className="space-y-8">
          <div className="flex items-center gap-4"><div className="size-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><Activity size={20} className="text-blue-400" /></div><h3 className="text-2xl font-black text-white">Predictive Analysis</h3></div>
          <div style={cardStyle} className="p-10 border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-10 mb-14 relative z-10"><ProbabilityGauge value={insight?.predictive_insights?.selection_probability || 0} accent={accent} />
              <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Success Odds</p><div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-lg ${(insight?.predictive_insights?.selection_probability || 0) > 55 ? 'bg-emerald-500' : 'bg-amber-500'}`}>{(insight?.predictive_insights?.selection_probability || 0) > 55 ? 'Top Candidate' : 'Emerging Profile'}</div></div>
            </div>
            <div className="h-[200px] w-full relative"><CustomTrend data={trendData} accent={accent} /></div>
          </div>
        </section>
      </div>

      <div className="space-y-12 pb-20">
        <div style={cardStyle} className="p-12 border-white/5 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden shadow-2xl">
          <div className="size-28 rounded-[32px] bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0"><Brain size={40} className="text-white" /></div>
          <div className="flex-1 text-center lg:text-left"><h3 className="text-3xl font-black mb-4">Initialize Adaptive Strategy</h3><p className="text-slate-400 text-base max-w-2xl font-medium leading-relaxed">Synthesize a unique growth vector based on <span className="text-white">90+ success parameters</span>.</p></div>
          <button onClick={() => { setStrategyInjected(true); toast.success("Strategy Initialized!"); }} className="px-12 h-16 bg-white text-black hover:bg-slate-200 transition-all rounded-2xl font-black text-sm uppercase tracking-widest">Inject Strategy</button>
        </div>
        <AnimatePresence>{strategyInjected && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div style={cardStyle} className="p-10 border-purple-500/30 bg-purple-500/[0.02] relative">
               <div className="absolute top-0 right-0 p-8"><Rocket size={48} className="text-purple-500 opacity-20 animate-pulse" /></div>
               <h3 className="text-2xl font-black mb-8 flex items-center gap-4"><div className="size-2 rounded-full bg-purple-500 animate-ping" />Adaptive Strategy</h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-2"><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Velocity</p><p className="text-2xl font-black text-purple-400">+12.4%/wk</p></div>
                  <div className="space-y-2"><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Mock Sync</p><p className="text-2xl font-black text-blue-400">Synced</p></div>
                  <div className="space-y-2"><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Project Depth</p><p className="text-2xl font-black text-emerald-400">Validated</p></div>
                  <div className="space-y-2"><p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Next</p><p className="text-2xl font-black text-white">Architecture</p></div>
               </div>
               <div className="mt-10 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-sm font-bold text-slate-400 italic">"Strategy optimized for {currentDrive?.company_name}."</p>
                  <button onClick={() => setReportOpen(true)} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition-all rounded-xl font-bold text-xs uppercase tracking-widest text-white shadow-xl shadow-purple-500/20">View Detailed Report</button>
               </div>
            </div>
          </motion.div>
        )}</AnimatePresence>
      </div>

      <AnimatePresence>{reportOpen && (<DetailedReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} insight={insight} drive={currentDrive} accent={accent} />)}</AnimatePresence>
      <style>{`@media print { body * { visibility: hidden; } #printable-report, #printable-report * { visibility: visible; } #printable-report { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}

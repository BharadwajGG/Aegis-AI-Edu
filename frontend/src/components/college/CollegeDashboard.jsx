import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Landmark, Shield, Users, BarChart3, PlusCircle, Calendar, Megaphone, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function CollegeDashboard({ user, logout }) {
  const collegeName = user?.displayName || 'College Name';
  const collegeId = user?.collegeId || 'CLG-001';
  const naacGrade = user?.naacGrade || 'Not Accredited';

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, avgIntegrityScore: 0, clubsRegistered: 0, eventsHeld: 0 });
  const [feed, setFeed] = useState([]);

  const [clubForm, setClubForm] = useState({ name: '', tags: '', description: '', memberCount: '' });
  const [eventForm, setEventForm] = useState({ name: '', date: '', type: 'seminar', description: '', targetAudience: '' });
  const [feedForm, setFeedForm] = useState({ company: '', date: '', role: '', ctc: '' });

  const fetchDashboardData = () => {
    fetch(`${API_URL}/api/college/clubs`).then(r => r.json()).then(d => setClubs(d.clubs || [])).catch(() => {});
    fetch(`${API_URL}/api/college/events`).then(r => r.json()).then(d => setEvents(d.events || [])).catch(() => {});
    fetch(`${API_URL}/api/college/students`).then(r => r.json()).then(d => setStudents(d.students || [])).catch(() => {});
    fetch(`${API_URL}/api/college/achievements`).then(r => r.json()).then(d => setAchievements(d.achievements || [])).catch(() => {});
    fetch(`${API_URL}/api/college/stats`).then(r => r.json()).then(d => setStats(d || {})).catch(() => {});
    fetch(`${API_URL}/api/college/recruiter-feed`).then(r => r.json()).then(d => setFeed(d.feed || [])).catch(() => {});
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/college/clubs`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({...clubForm, memberCount: parseInt(clubForm.memberCount) || 0})
      });
      if (res.ok) { fetchDashboardData(); setClubForm({ name: '', tags: '', description: '', memberCount: '' }); }
    } catch(err) { console.error(err); }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/college/events`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventForm)
      });
      if (res.ok) { fetchDashboardData(); setEventForm({ name: '', date: '', type: 'seminar', description: '', targetAudience: '' }); }
    } catch(err) { console.error(err); }
  };

  const handleFeedSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/college/recruiter-feed`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(feedForm)
      });
      if (res.ok) { fetchDashboardData(); setFeedForm({ company: '', date: '', role: '', ctc: '' }); }
    } catch(err) { console.error(err); }
  };

  const exportCSV = () => {
    const csvRows = [['ID', 'Name', 'Department', 'Skill Score', 'Mastery Level', 'Streak']];
    students.forEach(s => csvRows.push([s.id, s.name, s.dept, s.skillScore, s.masteryLevel, s.streak]));
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n"));
    link.download = "student_data.csv";
    link.click();
  };

  const cardStyle = "bg-[#0d1f0d] border border-[#1a3a1a] rounded-xl p-6 relative overflow-hidden";
  const inputStyle = "w-full bg-[#0a0f0a] border border-[#1a3a1a] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00ff88]/50 transition-colors placeholder:text-slate-600";
  const labelStyle = "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block";
  const btnStyle = "w-full bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0f0a] font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)] active:scale-[0.98] flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white selection:bg-[#00ff88]/30 font-sans">
      <nav className="fixed top-0 w-full z-50 bg-[#0a0f0a]/90 backdrop-blur-xl border-b border-[#1a3a1a] h-20 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-[#00ff88]/10 text-[#00ff88] rounded-xl flex items-center justify-center border border-[#00ff88]/20 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
            <Landmark size={20} strokeWidth={2} />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight leading-none block">AEGIS</span>
            <span className="text-[10px] uppercase tracking-widest text-[#00ff88] font-bold">College Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-4 text-sm">
             <div className="text-right">
               <p className="font-semibold text-slate-200">{collegeName}</p>
               <p className="text-[10px] text-slate-500 uppercase tracking-widest">{collegeId}</p>
             </div>
             <div className="px-3 py-1.5 rounded-full bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
               <Shield size={14} /> NAAC: {naacGrade}
             </div>
           </div>
           <button onClick={logout} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
             <LogOut size={20} />
           </button>
        </div>
      </nav>

      <main className="pt-28 px-6 lg:px-12 max-w-[1600px] mx-auto pb-20 space-y-6">
        
        {/* 5. NAAC REPORTING DASHBOARD */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardStyle}>
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2"><BarChart3 className="text-[#00ff88]" /> NAAC Reporting & Stats</h2>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Institutional Overview</p>
            </div>
            <button onClick={exportCSV} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <Download size={16} /> Export Student Data (CSV)
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{label: "Total Students", val: stats.totalStudents, icon: Users},
              {label: "Avg Integrity Score", val: `${stats.avgIntegrityScore}%`, icon: Shield},
              {label: "Registered Clubs", val: stats.clubsRegistered, icon: Landmark},
              {label: "Events Hosted", val: stats.eventsHeld, icon: Calendar}].map((s, i) => (
                <div key={i} className="bg-[#0a0f0a] border border-[#1a3a1a] rounded-xl p-4 flex items-center gap-4">
                  <div className="p-3 bg-[#00ff88]/10 text-[#00ff88] rounded-lg"><s.icon size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">{s.label}</p>
                    <p className="text-2xl font-bold">{s.val}</p>
                  </div>
                </div>
            ))}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 3. STUDENT TRACKING TABLE */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`lg:col-span-2 ${cardStyle} flex flex-col`}>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Users className="text-[#00ff88]" /> Student Tracking</h2>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase tracking-widest text-slate-500 bg-[#0a0f0a]">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Name</th>
                    <th className="px-4 py-3">Dept</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Mastery</th>
                    <th className="px-4 py-3">Streak</th>
                    <th className="px-4 py-3 rounded-tr-lg rounded-br-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...students].sort((a,b) => b.skillScore - a.skillScore).map(s => (
                    <tr key={s.id} className={`border-b border-[#1a3a1a] hover:bg-white/[0.02] transition-colors ${s.skillScore < 70 ? 'bg-rose-500/5' : ''}`}>
                      <td className="px-4 py-4 font-medium">{s.name}</td>
                      <td className="px-4 py-4 text-slate-400">{s.dept}</td>
                      <td className="px-4 py-4 font-bold text-[#00ff88]">{s.skillScore}</td>
                      <td className="px-4 py-4"><span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs">{s.masteryLevel}</span></td>
                      <td className="px-4 py-4">{s.streak}🔥</td>
                      <td className="px-4 py-4 flex items-center gap-2">
                        {s.skillScore < 70 ? <AlertCircle size={16} className="text-rose-500" /> : <CheckCircle2 size={16} className="text-[#00ff88]" />}
                        {s.skillScore < 70 ? <span className="text-rose-500 text-xs font-bold uppercase">Flagged</span> : <span className="text-slate-400 text-xs">On Track</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* 4. DEPARTMENT-WISE ACHIEVEMENT PANEL */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardStyle}>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><BarChart3 className="text-[#00ff88]" /> Achievement Index</h2>
            <div className="h-64 w-full bg-[#0a0f0a] border border-[#1a3a1a] rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={achievements} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="department" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip cursor={{fill: '#1a3a1a'}} contentStyle={{backgroundColor: '#0d1f0d', border: '1px solid #1a3a1a', borderRadius: '8px'}} />
                  <Bar dataKey="score" fill="#00ff88" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">Top Performing Dept</p>
              {[...achievements].sort((a,b)=>b.score-a.score).slice(0,1).map(a => (
                <div key={a.department} className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-xl flex justify-between items-center">
                  <span className="font-bold text-[#00ff88]">{a.department}</span>
                  <span className="text-sm font-bold bg-[#00ff88]/20 px-2 py-1 rounded text-[#00ff88]">{a.score} pts</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. CLUB REGISTRATION */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardStyle}>
             <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><PlusCircle className="text-[#00ff88]" /> Register Club</h2>
             <form onSubmit={handleClubSubmit} className="space-y-4">
               <div><label className={labelStyle}>Club Name</label><input required className={inputStyle} value={clubForm.name} onChange={e=>setClubForm({...clubForm, name: e.target.value})} placeholder="e.g. AI Enthu..." /></div>
               <div><label className={labelStyle}>Domain / Tags</label><input required className={inputStyle} value={clubForm.tags} onChange={e=>setClubForm({...clubForm, tags: e.target.value})} placeholder="e.g. AI, Tech" /></div>
               <div><label className={labelStyle}>Description</label><textarea required className={inputStyle} value={clubForm.description} onChange={e=>setClubForm({...clubForm, description: e.target.value})} placeholder="Brief description..." rows={2} /></div>
               <div><label className={labelStyle}>Member Count</label><input type="number" required className={inputStyle} value={clubForm.memberCount} onChange={e=>setClubForm({...clubForm, memberCount: e.target.value})} placeholder="0" /></div>
               <button type="submit" className={btnStyle}>Register Club</button>
             </form>
             <div className="mt-6 pt-6 border-t border-[#1a3a1a]">
               <p className={labelStyle}>Recent Clubs</p>
               <div className="space-y-2">
                 {clubs.slice(-3).reverse().map((c, i) => (
                   <div key={i} className="flex justify-between items-center p-3 bg-[#0a0f0a] border border-[#1a3a1a] rounded-lg">
                     <span className="text-sm font-bold">{c.name}</span>
                     <span className="text-xs text-slate-500">{c.memberCount} members</span>
                   </div>
                 ))}
               </div>
             </div>
          </motion.section>

          {/* 2. POST UPCOMING EVENTS */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={cardStyle}>
             <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Calendar className="text-[#00ff88]" /> Post Event</h2>
             <form onSubmit={handleEventSubmit} className="space-y-4">
               <div><label className={labelStyle}>Event Name</label><input required className={inputStyle} value={eventForm.name} onChange={e=>setEventForm({...eventForm, name: e.target.value})} placeholder="e.g. Hackathon 2026" /></div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className={labelStyle}>Date</label><input type="date" required className={inputStyle} value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} /></div>
                 <div>
                   <label className={labelStyle}>Type</label>
                   <select className={`${inputStyle} appearance-none`} value={eventForm.type} onChange={e=>setEventForm({...eventForm, type: e.target.value})}>
                     <option value="seminar">Seminar</option>
                     <option value="hackathon">Hackathon</option>
                     <option value="workshop">Workshop</option>
                     <option value="drive">Drive</option>
                   </select>
                 </div>
               </div>
               <div><label className={labelStyle}>Target Audience</label><input required className={inputStyle} value={eventForm.targetAudience} onChange={e=>setEventForm({...eventForm, targetAudience: e.target.value})} placeholder="e.g. All CS Students" /></div>
               <button type="submit" className={btnStyle}>Publish Event</button>
             </form>
             <div className="mt-6 pt-6 border-t border-[#1a3a1a]">
               <p className={labelStyle}>Upcoming Events</p>
               <div className="space-y-2">
                 {events.slice(-3).reverse().map((e, i) => (
                   <div key={i} className="p-3 bg-[#0a0f0a] border border-[#1a3a1a] rounded-lg">
                     <div className="flex justify-between items-center mb-1"><span className="text-sm font-bold text-[#00ff88]">{e.name}</span><span className="text-[10px] uppercase font-black text-slate-500 bg-white/5 px-2 py-0.5 rounded">{e.type}</span></div>
                     <span className="text-xs text-slate-400">{e.date}</span>
                   </div>
                 ))}
               </div>
             </div>
          </motion.section>

          {/* 6. RECRUITER INFO FEED */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={cardStyle}>
             <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Megaphone className="text-[#00ff88]" /> Recruiter Feed</h2>
             <form onSubmit={handleFeedSubmit} className="space-y-4">
               <div><label className={labelStyle}>Company Name</label><input required className={inputStyle} value={feedForm.company} onChange={e=>setFeedForm({...feedForm, company: e.target.value})} placeholder="e.g. Google" /></div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className={labelStyle}>Role</label><input required className={inputStyle} value={feedForm.role} onChange={e=>setFeedForm({...feedForm, role: e.target.value})} placeholder="SDE-1" /></div>
                 <div><label className={labelStyle}>CTC</label><input required className={inputStyle} value={feedForm.ctc} onChange={e=>setFeedForm({...feedForm, ctc: e.target.value})} placeholder="15 LPA" /></div>
               </div>
               <div><label className={labelStyle}>Visit Date</label><input type="date" required className={inputStyle} value={feedForm.date} onChange={e=>setFeedForm({...feedForm, date: e.target.value})} /></div>
               <button type="submit" className={btnStyle}>Post to Student Feed</button>
             </form>
             <div className="mt-6 pt-6 border-t border-[#1a3a1a] h-40 overflow-y-auto pr-2">
               <p className={labelStyle}>Recent Announcements</p>
               <div className="space-y-3">
                 {feed.slice().reverse().map((f, i) => (
                   <div key={i} className="p-3 border-l-2 border-[#00ff88] bg-[#0a0f0a] rounded-r-lg">
                     <p className="text-sm"><span className="font-bold">{f.company}</span> is visiting on <span className="text-[#00ff88]">{f.date}</span></p>
                     <p className="text-xs text-slate-400 mt-1">Role: {f.role} • CTC: {f.ctc}</p>
                   </div>
                 ))}
               </div>
             </div>
          </motion.section>

        </div>
      </main>
    </div>
  );
}

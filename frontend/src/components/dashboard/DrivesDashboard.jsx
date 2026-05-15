import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, LayoutGrid, List, Calendar as CalendarIcon, 
  ChevronRight, ArrowLeft, Briefcase, Bookmark, Bell,
  CheckCircle, XCircle, Info, Star, Zap, ChevronLeft, Brain
} from "lucide-react";
import toast from "react-hot-toast";
import { DrivePreparationAssistant } from "./DrivePreparationAssistant";
import { db } from "../../utils/firebase";
import { collectionGroup, query, getDocs } from "firebase/firestore";

export function DrivesDashboard({ accent, cardStyle, onBack, onViewInsight }) {
  const [view, setView] = useState("card"); // card, timeline, calendar
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [prepMode, setPrepMode] = useState(false);

  useEffect(() => {
    if (selectedDrive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedDrive]);

  useEffect(() => {
    // Fetch all drives from Firestore
    const fetchDrives = async () => {
      try {
        const q = query(collectionGroup(db, 'recruiterFeed'));
        const snapshot = await getDocs(q);
        const fbDrives = snapshot.docs.map(doc => {
          const f = doc.data();
          return {
            id: doc.id,
            company_name: f.company || 'Unknown Company',
            role_offered: f.role || 'SDE',
            package_stipend: f.ctc || 'N/A',
            drive_date: f.date ? new Date(f.date).toISOString() : new Date().toISOString(),
            registration_deadline: f.date ? new Date(f.date).toISOString() : new Date().toISOString(),
            location: "Campus",
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(f.company || 'C')}&background=random`,
            type: "On-Campus",
            drive_mode: "Offline",
            eligibility_criteria: "Refer to college placement cell.",
            required_skills: ["Communication", "Problem Solving"],
            hiring_process: ["Aptitude Test", "Technical Interview", "HR Interview"]
          };
        });
        setDrives(fbDrives);
      } catch (err) {
        console.error("Error fetching drives:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();

    // Fetch recommendations (mock profile)
    fetch("http://localhost:8000/api/drives/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills: ["Python", "React", "DSA"],
        interests: ["AI/ML", "Web"],
        gpa: 8.2
      })
    })
      .then(res => res.json())
      .then(data => setRecommendations(data))
      .catch(err => console.error("Error fetching recommendations:", err));
  }, []);

  const handleApply = (drive) => {
    toast.success(`Successfully applied to ${drive.company_name}!`, {
      icon: '🎉',
      style: { background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--card-border)' }
    });
  };

  if (loading) return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all mb-6 group px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Overview</span>
          </button>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Upcoming Drives</h2>
          <p className="text-slate-400 text-lg">Manage your future career opportunities in one place.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setView("card")}
            className={`p-2 rounded-lg transition-all ${view === "card" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setView("timeline")}
            className={`p-2 rounded-lg transition-all ${view === "timeline" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setView("calendar")}
            className={`p-2 rounded-lg transition-all ${view === "calendar" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            <CalendarIcon size={20} />
          </button>
        </div>
      </div>

      {/* Recommended Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-amber-400" />
          <h3 className="text-lg font-semibold">AI Recommended for You</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.slice(0, 4).map((drive, idx) => (
            <div 
              key={`rec-${drive.id}`} 
              style={cardStyle}
              className="p-4 border-l-4 border-l-amber-500 hover:bg-white/5 transition-all cursor-pointer"
              onClick={() => setSelectedDrive(drive)}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={drive.logo} alt="" className="size-8 object-contain" />
                <h4 className="font-bold text-sm">{drive.company_name}</h4>
              </div>
              <p className="text-xs text-slate-400 mb-2">{drive.role_offered}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">
                  {drive.recommendation_score}% Match
                </span>
                <ChevronRight size={14} className="text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main View Area */}
      <AnimatePresence mode="wait">
        {view === "card" && (
          <motion.div 
            key="card-view"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {drives.map(drive => (
              <DriveCard key={drive.id} drive={drive} cardStyle={cardStyle} onApply={() => handleApply(drive)} onInfo={() => setSelectedDrive(drive)} />
            ))}
          </motion.div>
        )}

        {view === "timeline" && (
          <motion.div 
            key="timeline-view"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {drives.map((drive, idx) => (
              <DriveTimelineItem key={drive.id} drive={drive} cardStyle={cardStyle} isLast={idx === drives.length - 1} onInfo={() => setSelectedDrive(drive)} />
            ))}
          </motion.div>
        )}

        {view === "calendar" && (
          <motion.div 
            key="calendar-view"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-[500px] flex items-center justify-center border border-dashed border-slate-800 rounded-3xl"
          >
            <div className="text-center">
              <CalendarIcon size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-slate-500 italic">Calendar View integration coming soon...</p>
              <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-widest font-black">Syncing with Growth Calendar</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drive Detail Sidebar/Modal (Simplified) */}
      <AnimatePresence>
        {selectedDrive && (
          <div className="fixed inset-0 z-[200] flex items-center justify-end pointer-events-none">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedDrive(null)} />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onWheel={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="w-full max-w-2xl h-screen bg-slate-950 border-l border-slate-800 p-8 pt-20 pointer-events-auto overflow-y-auto shadow-2xl relative"
              style={{ background: 'rgba(5,5,10,0.98)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => {
                    if (prepMode) setPrepMode(false);
                    else setSelectedDrive(null);
                  }} 
                  className="p-2 hover:bg-white/5 rounded-full text-slate-400 flex items-center gap-2 group"
                >
                  <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs uppercase font-black tracking-widest">{prepMode ? "Back to Details" : "Close"}</span>
                </button>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-full text-slate-400"><Bookmark size={20} /></button>
                  <button className="p-2 hover:bg-white/5 rounded-full text-slate-400"><Bell size={20} /></button>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="size-16 md:size-20 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0">
                  <img src={selectedDrive.logo} alt="" className="size-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold">{selectedDrive.company_name}</h3>
                  <p className="text-purple-400 font-medium text-sm md:text-base">{selectedDrive.role_offered}</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!prepMode ? (
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <section>
                      <h4 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">About the Role</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <InfoBox label="Type" value={selectedDrive.type} icon={<Briefcase size={14}/>} />
                        <InfoBox label="Location" value={selectedDrive.location} icon={<MapPin size={14}/>} />
                        <InfoBox label="Package" value={selectedDrive.package_stipend} icon={<Star size={14}/>} />
                        <InfoBox label="Mode" value={selectedDrive.drive_mode} icon={<LayoutGrid size={14}/>} />
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Eligibility</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{selectedDrive.eligibility_criteria}</p>
                    </section>

                    <section>
                      <h4 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDrive.required_skills.map(skill => (
                          <span key={skill} className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Hiring Process</h4>
                      <div className="space-y-3">
                        {selectedDrive.hiring_process.map((stage, idx) => (
                          <div key={stage} className="flex items-center gap-3">
                            <div className="size-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-slate-300">{stage}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="pt-8 flex gap-4">
                      <button 
                        onClick={() => handleApply(selectedDrive)}
                        className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 transition-all rounded-xl font-bold"
                      >
                        Apply Now
                      </button>
                      <button 
                        onClick={() => setPrepMode(true)}
                        className="flex-1 h-12 border border-slate-800 hover:bg-slate-900 transition-all rounded-xl font-bold"
                      >
                        Prepare Now
                      </button>
                    </div>
                    <button 
                      onClick={() => onViewInsight(selectedDrive.id)}
                      className="w-full mt-4 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all rounded-xl font-bold text-white shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
                    >
                      <Brain size={18} /> View Label-Mate Insight
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="prep"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <DrivePreparationAssistant driveId={selectedDrive.id} cardStyle={cardStyle} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DriveCard({ drive, cardStyle, onApply, onInfo }) {
  return (
    <motion.div 
      style={cardStyle}
      className="p-6 group relative overflow-hidden flex flex-col h-full hover:border-purple-500/50 transition-all"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="size-12 rounded-2xl bg-white/5 p-2 flex items-center justify-center border border-white/10">
          <img src={drive.logo} alt="" className="size-full object-contain" />
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Deadline</p>
          <p className="text-xs font-bold text-rose-500">{new Date(drive.registration_deadline).toLocaleDateString()}</p>
        </div>
      </div>

      <h4 className="text-xl font-bold mb-1">{drive.company_name}</h4>
      <p className="text-slate-400 text-sm mb-6">{drive.role_offered}</p>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><MapPin size={12}/> {drive.location}</span>
          <span className="flex items-center gap-1.5 font-bold text-slate-300">{drive.package_stipend}</span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onApply}
            className="flex-1 py-2 rounded-lg bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all text-xs font-bold"
          >
            Apply
          </button>
          <button 
            onClick={onInfo}
            className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 transition-all"
          >
            <Info size={16} className="text-slate-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DriveTimelineItem({ drive, cardStyle, isLast, onInfo }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="size-4 rounded-full bg-purple-600 ring-4 ring-purple-600/20" />
        {!isLast && <div className="flex-1 w-px bg-slate-800 my-2" />}
      </div>
      <div 
        style={cardStyle} 
        className="flex-1 p-5 mb-4 flex items-center justify-between group cursor-pointer hover:border-purple-500/50 transition-all"
        onClick={onInfo}
      >
        <div className="flex items-center gap-6">
          <div className="text-center w-20">
            <p className="text-xs font-black text-slate-500 uppercase">{new Date(drive.drive_date).toLocaleString('en-us', { month: 'short' })}</p>
            <p className="text-2xl font-black text-white">{new Date(drive.drive_date).getDate()}</p>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div>
            <h4 className="font-bold">{drive.company_name}</h4>
            <p className="text-xs text-slate-500">{drive.role_offered}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <p className="text-[10px] uppercase font-black text-slate-600">Location</p>
            <p className="text-xs font-medium">{drive.location}</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] uppercase font-black text-slate-600">Type</p>
            <p className="text-xs font-medium">{drive.type}</p>
          </div>
          <ChevronRight size={20} className="text-slate-700 group-hover:text-purple-500 transition-colors" />
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, icon }) {
  return (
    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
      <div className="flex items-center gap-2 text-slate-500 mb-1">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-200">{value}</p>
    </div>
  );
}

function MapPin(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>; }

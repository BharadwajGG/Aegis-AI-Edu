import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Rocket, ChevronRight, BookOpen, MessageSquare, Activity, ShieldAlert, Award, Star } from "lucide-react";
import { db } from "../../../utils/firebase";
import { collectionGroup, query, where, onSnapshot } from "firebase/firestore";

const MOCK_CLUBS = [
  {
    id: "rocketry",
    name: "AeroSpace Innovators / Rocketry",
    college: "Maharashtra Institute of Technology (MIT)",
    members: 142,
    tags: ["Engineering", "Physics", "Aerospace"],
    description: "Designing and building high-powered rockets for the annual Spaceport America Cup.",
    projects: [
      { name: "Solid Fuel Booster Test Phase II", status: "Active", progress: 65 },
      { name: "Avionics Telemetry Board", status: "Planning", progress: 15 }
    ],
    updates: [
      { author: "Rahul P. (Captain)", text: "Next payload design meeting is on Tuesday. Ensure you read up on the fluid dynamics material!", time: "2h ago" },
      { author: "Prof. Sharma", text: "New wind tunnel slots acquired for the team this week.", time: "1d ago" }
    ],
    basics: [
      { title: "Intro to Applied Aerodynamics", type: "Course", icon: <BookOpen size={14} /> },
      { title: "OpenRocket Simulator Basics", type: "Tutorial", icon: <Rocket size={14} /> },
      { title: "Solid Propellant Chemistry", type: "Article", icon: <Activity size={14} /> }
    ]
  },
  {
    id: "cybersec",
    name: "ZeroDay Security Club",
    college: "Maharashtra Institute of Technology (MIT)",
    members: 284,
    tags: ["InfoSec", "CTF", "Networking"],
    description: "Ethical hacking, pentesting, and participating in global CTF competitions.",
    projects: [
      { name: "Campus Network Audit", status: "Active", progress: 40 }
    ],
    updates: [
      { author: "Anjali K.", text: "HackTheBox session this Friday night!", time: "5h ago" }
    ],
    basics: [
      { title: "CTF For Beginners", type: "Course", icon: <ShieldAlert size={14} /> }
    ]
  },
  {
    id: "robotics",
    name: "MechaTron Robotics",
    college: "Maharashtra Institute of Technology (MIT)",
    members: 198,
    tags: ["Robotics", "AI", "Hardware"],
    description: "Building autonomous rovers and drones for university challenges.",
    projects: [],
    updates: [],
    basics: []
  }
];

export function CommunityHub({ accent, accentGlow, accentDim, cardStyle, userCollege }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeClubId, setActiveClubId] = useState(null);
  const [realClubs, setRealClubs] = useState([]);
  
  useEffect(() => {
    if (!userCollege) return;
    const q = query(collectionGroup(db, 'clubs'), where('collegeName', '==', userCollege));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedClubs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Unnamed Club",
          college: data.collegeName,
          members: data.memberCount || 0,
          tags: data.tags || [],
          description: data.description || "",
          projects: [], // Fallback until projects are implemented
          updates: [],  // Fallback until updates are implemented
          basics: []    // Fallback until basics are implemented
        };
      });
      setRealClubs(fetchedClubs.length > 0 ? fetchedClubs : MOCK_CLUBS.filter(c => c.college === userCollege));
    });
    return () => unsubscribe();
  }, [userCollege]);

  const filteredClubs = realClubs.filter(c => 
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const activeClub = realClubs.find(c => c.id === activeClubId);

  return (
    <div className="bento-card p-8 min-h-[600px] relative" style={cardStyle}>
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <Users size={24} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Community Hub</h2>
          </div>
          <p className="text-sm text-slate-400">
            Exclusive clubs & teams at <strong style={{ color: accent }}>{userCollege}</strong>
          </p>
        </div>

        {!activeClubId && (
          <div className="flex items-center w-full md:w-72 px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-purple-500/30 transition-all">
            <Search size={18} className="text-slate-600 mr-3" />
            <input 
              type="text" 
              placeholder="Search clubs, tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-white text-sm outline-none w-full placeholder:text-slate-600 font-medium"
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!activeClubId ? (
          <motion.div 
            key="browse"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredClubs.map(club => (
              <div key={club.id} 
                className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-purple-500/5"
                onClick={() => setActiveClubId(club.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white leading-tight group-hover:text-purple-400 transition-colors">{club.name}</h3>
                  <div className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                    {club.members} Members
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1 line-clamp-3">
                  {club.description}
                </p>
                <div className="flex gap-2 flex-wrap mb-8">
                  {club.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-900 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-800/50">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full py-3.5 rounded-xl bg-purple-600/10 text-purple-400 font-bold text-xs uppercase tracking-widest group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  View & Join Team
                </button>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          >
            <button 
              onClick={() => setActiveClubId(null)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-purple-400 transition-colors mb-8"
            >
              <ChevronRight size={14} className="rotate-180" /> Back to Teams
            </button>

            {/* Club Hero */}
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 size-64 bg-purple-600/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{activeClub.name}</h2>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-slate-400 font-medium">{activeClub.members} Active Members</span>
                  <span className="text-sm text-purple-400 font-bold flex items-center gap-2">
                    <Award size={16} /> Joined Officially
                  </span>
                </div>
              </div>
              <div className="relative z-10 flex gap-2">
                {activeClub.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-gray-950/50 backdrop-blur-md text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Active Projects */}
                <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <Activity size={20} className="text-purple-500" />
                    <h3 className="text-xl font-bold text-white tracking-tight">Ongoing Team Projects</h3>
                  </div>
                  {activeClub.projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeClub.projects.map(proj => (
                        <div key={proj.name} className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-slate-200">{proj.name}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">{proj.status}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]" style={{ width: `${proj.progress}%` }} />
                          </div>
                          <div className="text-[10px] font-bold text-slate-500 text-right uppercase tracking-tighter">{proj.progress}% Complete</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No active projects listed currently.</p>
                  )}
                </div>

                {/* Team Updates */}
                <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                    <MessageSquare size={20} className="text-purple-500" />
                    <h3 className="text-xl font-bold text-white tracking-tight">Official Updates</h3>
                  </div>
                  <div className="space-y-6">
                    {activeClub.updates.length > 0 ? activeClub.updates.map((update, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="size-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-purple-600/20 shrink-0">
                          {update.author[0]}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">{update.author}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{update.time}</span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{update.text}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-500 italic">No recent updates from the core team.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Learn Basics */}
                <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
                  <h3 className="text-xl font-bold text-white tracking-tight">Learn Basics & Growth</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Master these fundamentals to contribute effectively to team projects and unlock career paths in {activeClub.tags[0]}.
                  </p>
                  
                  <div className="space-y-3">
                    {activeClub.basics.length > 0 ? activeClub.basics.map((b, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-purple-500/30 hover:bg-purple-500/[0.02] transition-all flex items-center gap-4 cursor-pointer group">
                        <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                          {b.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white leading-tight mb-1">{b.title}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{b.type}</div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-xs text-slate-500 italic">Learning paths are being updated.</p>
                    )}
                  </div>
                </div>

                {/* Contribution Tracker */}
                <div className="p-8 rounded-[32px] bg-purple-600 text-white space-y-6 shadow-2xl shadow-purple-600/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 size-32 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Star size={20} /> Your Impact
                    </h3>
                    <div className="text-center py-4">
                      <div className="text-5xl font-black tracking-tighter mb-1">Level 1</div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Trainee / Member</div>
                    </div>
                    <button className="w-full py-4 bg-white text-purple-600 rounded-xl font-bold text-sm shadow-xl hover:bg-purple-50 transition-colors active:scale-[0.98]">
                      Log Contribution
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

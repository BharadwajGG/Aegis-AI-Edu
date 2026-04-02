import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Rocket, ChevronRight, BookOpen, MessageSquare, Activity, ShieldAlert, Award, Star } from "lucide-react";

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
  
  // Filter by college and search query
  const filteredClubs = MOCK_CLUBS.filter(c => 
    c.college === userCollege && 
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const activeClub = MOCK_CLUBS.find(c => c.id === activeClubId);

  return (
    <div style={{ ...cardStyle, padding: "30px", position: "relative" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ 
              width: 40, height: 40, borderRadius: 12, background: accentDim, 
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 20px ${accentGlow}`
            }}>
              <Users size={20} color={accent} />
            </div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--text-main)" }}>
              Community Hub
            </h2>
          </div>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            Exclusive clubs & teams at <strong style={{ color: accent }}>{userCollege}</strong>
          </p>
        </div>

        {!activeClubId && (
          <div style={{ 
            display: "flex", alignItems: "center", background: "var(--input-bg)", 
            border: "1px solid var(--input-border)", borderRadius: 12, padding: "8px 16px",
            width: 250
          }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: 10 }} />
            <input 
              type="text" 
              placeholder="Search clubs, tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent", border: "none", color: "var(--text-main)", outline: "none",
                fontSize: 13, width: "100%"
              }}
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!activeClubId ? (
          /* --- BROWSE CLUBS MODE --- */
          <motion.div 
            key="browse"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}
          >
            {filteredClubs.map(club => (
              <div key={club.id} 
                style={{
                  padding: "20px", borderRadius: 16, background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--card-border)", transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = accentGlow}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--card-border)"}
                onClick={() => setActiveClubId(club.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-main)" }}>{club.name}</h3>
                  <div style={{ background: accentDim, color: accent, padding: "4px 8px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>
                    {club.members} Members
                  </div>
                </div>
                <p style={{ margin: "0 0 16px 0", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {club.description}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                  {club.tags.map(tag => (
                    <span key={tag} style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-subtle)", padding: "4px 10px", borderRadius: 6, fontSize: 11 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button style={{
                  width: "100%", padding: "10px", borderRadius: 10, border: "none",
                  background: accentDim, color: accent, fontWeight: 600, fontSize: 13, cursor: "pointer",
                  transition: "background 0.3s"
                }}>
                  View & Join Team
                </button>
              </div>
            ))}
          </motion.div>
        ) : (
          /* --- ACTIVE CLUB DASHBOARD --- */
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          >
            <button 
              onClick={() => setActiveClubId(null)}
              style={{
                background: "transparent", border: "none", color: "var(--text-subtle)", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: 0, marginBottom: 20
              }}
            >
              <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} /> Back to Teams
            </button>

            {/* Club Hero */}
            <div style={{
              background: `linear-gradient(135deg, ${accentDim}, transparent)`,
              border: `1px solid ${accentGlow}`, borderRadius: 16, padding: "24px", marginBottom: 24,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <h2 style={{ margin: "0 0 8px 0", fontSize: 24, color: "var(--text-main)" }}>{activeClub.name}</h2>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{activeClub.members} Active Members</span>
                  <span style={{ color: accent, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <Award size={14} /> Joined Officially
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {activeClub.tags.map(tag => (
                  <span key={tag} style={{ background: "rgba(0,0,0,0.3)", color: "var(--text-muted)", padding: "4px 10px", borderRadius: 6, fontSize: 11 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                
                {/* Active Projects */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "20px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: 16, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 8 }}>
                    <Activity size={16} color={accent} /> Ongoing Team Projects
                  </h3>
                  {activeClub.projects.length > 0 ? activeClub.projects.map(proj => (
                    <div key={proj.name} style={{ marginBottom: 16, padding: "16px", background: "var(--input-bg)", borderRadius: 12, border: "1px solid var(--input-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <strong style={{ color: "var(--text-main)", fontSize: 14 }}>{proj.name}</strong>
                        <span style={{ color: accent, fontSize: 12, fontWeight: 600 }}>{proj.status}</span>
                      </div>
                      <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${proj.progress}%`, height: "100%", background: accent, borderRadius: 3 }} />
                      </div>
                      <div style={{ textAlign: "right", marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>{proj.progress}% Complete</div>
                    </div>
                  )) : (
                    <p style={{ color: "var(--text-subtle)", fontSize: 13 }}>No active projects listed currently.</p>
                  )}
                </div>

                {/* Team Updates */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "20px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: 16, color: "var(--text-main)", display: "flex", alignItems: "center", gap: 8 }}>
                    <MessageSquare size={16} color={accent} /> Official Updates
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {activeClub.updates.length > 0 ? activeClub.updates.map((update, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, borderBottom: i !== activeClub.updates.length - 1 ? "1px solid var(--card-border)" : "none", paddingBottom: i !== activeClub.updates.length - 1 ? 12 : 0 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: accentDim, color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                          {update.author[0]}
                        </div>
                        <div>
                          <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 4 }}>
                            <span style={{ color: "var(--text-main)", fontSize: 13, fontWeight: 600 }}>{update.author}</span>
                            <span style={{ color: "var(--text-subtle)", fontSize: 11 }}>{update.time}</span>
                          </div>
                          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13 }}>{update.text}</p>
                        </div>
                      </div>
                    )) : (
                      <p style={{ color: "var(--text-subtle)", fontSize: 13 }}>No recent updates from the core team.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                
                {/* Learn Basics / Career Path */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "20px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: 16, color: "var(--text-main)" }}>Learn Basics & Growth</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                    Master these fundamentals to contribute effectively to team projects and unlock career paths in {activeClub.tags[0]}.
                  </p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activeClub.basics.length > 0 ? activeClub.basics.map((b, i) => (
                      <div key={i} style={{ 
                        background: "var(--input-bg)", padding: "12px", borderRadius: 10, border: "1px solid var(--input-border)",
                        display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.3s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = accentGlow}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--input-border)"}
                      >
                        <div style={{ background: accentDim, color: accent, padding: 8, borderRadius: 8 }}>
                          {b.icon}
                        </div>
                        <div>
                          <div style={{ color: "var(--text-main)", fontSize: 13, fontWeight: 500 }}>{b.title}</div>
                          <div style={{ color: "var(--text-subtle)", fontSize: 11 }}>{b.type}</div>
                        </div>
                      </div>
                    )) : (
                      <p style={{ color: "var(--text-subtle)", fontSize: 13 }}>Learning paths are being updated.</p>
                    )}
                  </div>
                </div>

                {/* Contribution Tracker */}
                <div style={{ background: accentDim, border: `1px solid ${accentGlow}`, borderRadius: 16, padding: "20px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: 15, color: accent, display: "flex", alignItems: "center", gap: 8 }}>
                    <Star size={16} /> Your Impact
                  </h3>
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "var(--text-main)", marginBottom: 4 }}>Level 1</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Trainee / Member</div>
                  </div>
                  <button style={{
                    width: "100%", padding: "12px", background: accent, color: "#fff", border: "none", borderRadius: 10,
                    fontWeight: 600, fontSize: 13, marginTop: 10, cursor: "pointer", boxShadow: `0 4px 14px ${accentGlow}`
                  }}>
                    Log Contribution
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

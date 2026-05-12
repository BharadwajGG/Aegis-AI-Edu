import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Landmark, Briefcase, ChevronRight, Shield } from "lucide-react";

const ROLES = [
  {
    id: "student",
    title: "Student",
    description: "Personalized growth roadmaps, Socratic coaching, and performance tracking.",
    icon: GraduationCap,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)"
  },
  {
    id: "college",
    title: "College",
    description: "Manage student groups, track institutional growth, and host exclusive events.",
    icon: Landmark,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)"
  },
  {
    id: "recruiter",
    title: "Recruiter",
    description: "Identify top talent based on verified growth metrics and integrity scores.",
    icon: Briefcase,
    color: "#a855f7",
    bg: "rgba(168,85,247,0.1)"
  }
];

export function RoleSelection({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-md"
          >
            <Shield size={14} className="text-purple-500" />
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Identity Verification</p>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Choose Your Path</h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Select the role that best describes you to tailor your Aegis experience and secure your personalized workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLES.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelected(role.id)}
              className={`relative group cursor-pointer p-8 rounded-[32px] border transition-all duration-500 ${
                selected === role.id 
                  ? "border-white/20 bg-white/5 shadow-2xl scale-[1.02]" 
                  : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
              }`}
            >
              <div 
                className="size-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500"
                style={{ backgroundColor: role.bg, color: role.color }}
              >
                <role.icon size={32} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{role.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                {role.description}
              </p>

              <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                selected === role.id ? "text-white opacity-100" : "text-slate-600 opacity-0 group-hover:opacity-100"
              }`}>
                Select This Role <ChevronRight size={12} />
              </div>

              {selected === role.id && (
                <motion.div 
                  layoutId="selection-ring"
                  className="absolute inset-0 border-2 border-purple-500 rounded-[32px] pointer-events-none"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: selected ? 1 : 0 }}
          className="mt-12 flex justify-center"
        >
          <button
            onClick={() => onSelect(selected)}
            disabled={!selected}
            className="px-12 h-14 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 transition-all rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-purple-600/20 active:scale-[0.98] flex items-center gap-3"
          >
            Confirm & Continue <ChevronRight size={18} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

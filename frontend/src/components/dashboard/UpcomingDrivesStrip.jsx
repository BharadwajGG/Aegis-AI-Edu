import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Briefcase, ChevronRight, Bookmark, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export function UpcomingDrivesStrip({ accent, accentCardStyle, onDriveClick }) {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/drives/")
      .then(res => res.json())
      .then(data => {
        setDrives(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching drives:", err);
        setLoading(false);
      });
  }, []);

  const getDaysRemaining = (deadline) => {
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleSave = (e, drive) => {
    e.stopPropagation();
    toast.success(`Saved ${drive.company_name} for later!`);
  };

  if (loading) return (
    <div className="h-48 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase size={20} className="text-purple-400" />
          <h3 className="text-lg font-bold uppercase tracking-widest text-slate-200">Upcoming Drives</h3>
        </div>
        <button 
          onClick={() => onDriveClick(null)}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mask-fade-right">
        {drives.map((drive, idx) => (
          <motion.div
            key={drive.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onDriveClick(drive)}
            style={accentCardStyle}
            className="flex-shrink-0 w-[320px] p-5 cursor-pointer group hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/5 p-1.5 border border-white/10 flex items-center justify-center">
                  <img src={drive.logo} alt={drive.company_name} className="size-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 group-hover:text-purple-400 transition-colors">{drive.company_name}</h4>
                  <p className="text-xs text-slate-400 truncate w-40">{drive.role_offered}</p>
                </div>
              </div>
              <button 
                onClick={(e) => handleSave(e, drive)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-purple-400 transition-all"
              >
                <Bookmark size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar size={12} className="text-purple-500" />
                <span>{new Date(drive.drive_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin size={12} className="text-emerald-500" />
                <span>{drive.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={12} className="text-amber-500" />
                <span>{getDaysRemaining(drive.registration_deadline)} days left</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle size={12} className="text-blue-500" />
                <span>{drive.type}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-bold text-white/90">{drive.package_stipend}</span>
              <button className="text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 group-hover:bg-purple-600 group-hover:text-white transition-all">
                Quick Apply
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

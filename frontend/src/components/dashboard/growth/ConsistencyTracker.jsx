import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export function ConsistencyTracker({ t, accent, cardStyle }) {
  const daysData = useMemo(() => {
    const data = [];
    let totalContributions = 0;
    for (let i = 0; i < 365; i++) {
      const rand = Math.random();
      let level = 0;
      if (rand > 0.9) { level = 4; totalContributions += Math.floor(Math.random() * 5) + 5; }
      else if (rand > 0.75) { level = 3; totalContributions += Math.floor(Math.random() * 3) + 2; }
      else if (rand > 0.6) { level = 2; totalContributions += 2; }
      else if (rand > 0.4) { level = 1; totalContributions += 1; }
      
      if (i > 100 && i < 115) level = 0;
      if (i > 250 && i < 260) level = 0;

      data.push(level);
    }
    return { data, totalContributions };
  }, []);

  const getBackgroundColor = (level) => {
    switch (level) {
      case 1: return `${accent}33`; 
      case 2: return `${accent}66`; 
      case 3: return `${accent}99`; 
      case 4: return accent;        
      case 0:
      default:
        return "rgba(255, 255, 255, 0.05)";   
    }
  };

  const columns = [];
  for (let i = 0; i < 52; i++) {
    const week = daysData.data.slice(i * 7, (i + 1) * 7);
    columns.push(week);
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <motion.div className="bento-card md-col-span-12 p-6" style={cardStyle}>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Calendar size={18} />
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Consistency Tracker
          </div>
        </div>
        <div className="text-xs font-bold bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <span style={{ color: accent }}>{daysData.totalContributions}</span> contributions in the last year
        </div>
      </div>

      <div className="overflow-x-auto pb-6 -mx-2 px-2 custom-scrollbar">
        <div className="min-w-[700px]">
          <div className="flex gap-4">
            {/* Y-Axis Days */}
            <div className="flex flex-col justify-between py-1 text-[10px] text-slate-500 font-bold uppercase tracking-tighter h-32 mr-2">
              <div className="mt-4">Mon</div>
              <div>Wed</div>
              <div className="mb-2">Fri</div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {/* X-Axis Months */}
              <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">
                {months.map(m => <div key={m}>{m}</div>)}
              </div>

              {/* Grid */}
              <div className="flex gap-1.5">
                {columns.map((week, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1.5">
                    {week.map((level, rowIdx) => (
                      <div 
                        key={rowIdx} 
                        className="size-3.5 rounded-[4px] transition-all duration-300 hover:scale-125 hover:shadow-lg"
                        style={{
                          background: getBackgroundColor(level),
                          boxShadow: level > 0 ? `0 0 10px ${getBackgroundColor(level)}33` : 'none'
                        }}
                        title={`Activity Level: ${level}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Less</span>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4].map(level => (
                <div key={level} className="size-3 rounded-[3px]"
                  style={{ background: getBackgroundColor(level) }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

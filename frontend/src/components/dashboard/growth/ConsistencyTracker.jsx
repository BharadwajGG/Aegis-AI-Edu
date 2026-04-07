import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export function ConsistencyTracker({ t, accent, cardStyle }) {
  // Generate 365 days of deterministic mock data
  const daysData = useMemo(() => {
    const data = [];
    // Seeded random approach for a realistic spread mimicking GitHub
    let totalContributions = 0;
    for (let i = 0; i < 365; i++) {
      const rand = Math.random();
      let level = 0;
      // Weighting it so there are "empty" patches (0) and bursts of energy (4)
      if (rand > 0.9) { level = 4; totalContributions += Math.floor(Math.random() * 5) + 5; }
      else if (rand > 0.75) { level = 3; totalContributions += Math.floor(Math.random() * 3) + 2; }
      else if (rand > 0.6) { level = 2; totalContributions += 2; }
      else if (rand > 0.4) { level = 1; totalContributions += 1; }
      
      // Artificial gap simulation for holidays/burnout
      if (i > 100 && i < 115) level = 0;
      if (i > 250 && i < 260) level = 0;

      data.push(level);
    }
    return { data, totalContributions };
  }, []);

  const getBackgroundColor = (level) => {
    switch (level) {
      case 1: return `${accent}33`; // 20% opacity using hex notation
      case 2: return `${accent}66`; // 40%
      case 3: return `${accent}99`; // 60%
      case 4: return accent;        // 100%
      case 0:
      default:
        return "var(--input-bg)";   // Empty block
    }
  };

  // Organize by 52 columns of 7 weeks
  const columns = [];
  for (let i = 0; i < 52; i++) {
    const week = daysData.data.slice(i * 7, (i + 1) * 7);
    columns.push(week);
  }

  // Months label approximation
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <motion.div className="bento-card md-col-span-12" style={{ ...cardStyle, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Calendar size={14} color={accent} />
          <div style={{ fontSize: 11, color: "var(--text-subtle)", letterSpacing: 2, fontWeight: 600 }}>
            CONSISTENCY TRACKER
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-main)" }}>
          <span style={{ fontWeight: 700, color: accent }}>{daysData.totalContributions}</span> contributions in the last year
        </div>
      </div>

      <div style={{ overflowX: "auto", paddingBottom: 12, margin: "0 -4px" }}>
        <div style={{ minWidth: 650, padding: "0 4px" }}>
          
          <div style={{ display: "flex", gap: 4 }}>
            {/* Y-Axis Days of Week Labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "space-between", marginTop: 2, marginRight: 4, fontSize: 10, color: "var(--text-subtle)", height: 110 }}>
              <div style={{ marginTop: 14 }}>Mon</div>
              <div>Wed</div>
              <div style={{ marginBottom: 4 }}>Fri</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* X-Axis Months Labels (Approximate 4-week spans) */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-subtle)", paddingLeft: 4, marginBottom: 4 }}>
                {months.map(m => <div key={m}>{m}</div>)}
              </div>

              {/* Grid Canvas */}
              <div style={{ display: "flex", gap: 4 }}>
                {columns.map((week, colIdx) => (
                  <div key={colIdx} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {week.map((level, rowIdx) => (
                      <div 
                        key={rowIdx} 
                        style={{
                          width: 12, height: 12, borderRadius: 3,
                          background: getBackgroundColor(level),
                          border: `1px solid ${level > 0 ? 'rgba(255,255,255,0.05)' : 'var(--card-border)'}`,
                          transition: "all 0.2s ease"
                        }}
                        title={`Activity Level: ${level}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 16, fontSize: 10, color: "var(--text-subtle)" }}>
            <span>Less</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2, 3, 4].map(level => (
                <div key={level} style={{
                  width: 12, height: 12, borderRadius: 3,
                  background: getBackgroundColor(level),
                  border: `1px solid ${level > 0 ? 'rgba(255,255,255,0.05)' : 'var(--card-border)'}`
                }} />
              ))}
            </div>
            <span>More</span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Bell, AlertCircle } from 'lucide-react';

export function CalendarTicker({ t, accent, accentCardStyle, events, mode, className = "bento-card md-col-span-12" }) {
  // Sort by closest upcoming date
  const upcoming = [...events]
    .filter(e => new Date(e.date).getTime() > Date.now())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const TYPE_COLORS = {
    exam: '#ef4444',
    study: '#3b82f6',
    opportunity: '#10b981',
    life: '#a855f7'
  };

  return (
    <div className={className} style={{ ...accentCardStyle, padding: "24px", display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <div style={{ padding: 8, borderRadius: 10, background: `${accent}22` }}>
           <CalendarDays color={accent} size={18} />
        </div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>Priority Ticker</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {upcoming.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0', background: 'var(--input-bg)', borderRadius: 12, border: '1px border var(--input-border)' }}>
              No upcoming events! Time to relax or set new goals.
            </div>
          )}
          {upcoming.map((ev, i) => {
             const daysLeft = Math.ceil((new Date(ev.date) - Date.now()) / (1000 * 60 * 60 * 24));
             const c = TYPE_COLORS[ev.type];

             return (
               <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                 style={{ 
                   display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 14,
                   padding: '14px 16px', borderRadius: 12, 
                   background: 'linear-gradient(145deg, var(--input-bg), rgba(0,0,0,0.2))', 
                   border: '1px solid var(--input-border)',
                   boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                 }}>
                 
                 <div style={{ width: 4, height: '100%', background: c, borderRadius: 4 }} />
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                   <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                     {ev.title}
                     {ev.notifyEmail && <Bell size={12} color={accent} />}
                     {daysLeft <= 3 && <AlertCircle size={12} color="#ef4444" />}
                   </div>
                   <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                     {new Date(ev.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} • {new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                   </div>
                 </div>

                 <div style={{ 
                    fontSize: 11, fontWeight: 800, padding: '6px 10px', borderRadius: 8, 
                    background: `${c}22`, color: c, whiteSpace: 'nowrap'
                 }}>
                   {daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                 </div>
               </motion.div>
             )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

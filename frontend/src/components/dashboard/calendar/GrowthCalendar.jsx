import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Save, RefreshCw, Plus, X, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

export function GrowthCalendar({ t, accent, accentDim, accentGlow, cardStyle, events, addEvent, syncUniversityEvents, mode }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState('study');
  const [currentDate, setCurrentDate] = useState(new Date());

  const TYPE_COLORS = {
    exam: { color: '#ef4444', label: 'University Exam' },
    study: { color: '#3b82f6', label: 'Study / DSA' },
    opportunity: { color: '#10b981', label: 'Opportunity' },
    life: { color: '#a855f7', label: 'Life / Hobby' }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addEvent({
      title: fd.get('title'),
      type: selectedType,
      date: new Date(fd.get('date')).toISOString(),
      notifyEmail: fd.get('notify') === 'on'
    });
    setShowAddModal(false);
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const blanks = Array.from({ length: startDay }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];

  return (
    <div style={{ ...cardStyle, padding: "30px", minHeight: "550px", display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        
        {/* MONTH / YEAR NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--input-bg)', padding: '8px 16px', borderRadius: 12, border: '1px solid var(--input-border)' }}>
             <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
               <ChevronLeft size={18} />
             </button>
             <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, minWidth: 140, textAlign: 'center', letterSpacing: 1 }}>
               {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </h2>
             <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
               <ChevronRight size={18} />
             </button>
          </div>
        </div>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={syncUniversityEvents} style={{
             display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10,
             background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s'
          }}>
            <RefreshCw size={16} /> Sync SPPU
          </button>
          <button onClick={() => setShowAddModal(true)} style={{
             display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10,
             background: accentDim, color: accent, border: `1px solid ${accentGlow}`, cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s'
          }}>
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* DAYS OF WEEK HEADER */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginBottom: 10 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, flex: 1 }}>
        {totalSlots.map((dayNum, i) => {
          
          if (!dayNum) {
            return <div key={`blank-${i}`} style={{ background: 'transparent', borderRadius: 12, minHeight: 90 }} />;
          }

          const dayEvents = events.filter(e => {
            const ed = new Date(e.date);
            return ed.getDate() === dayNum && ed.getMonth() === month && ed.getFullYear() === year;
          });

          const isToday = dayNum === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

          return (
            <div key={i} style={{
              background: isToday ? 'rgba(255,255,255,0.05)' : 'var(--input-bg)', 
              border: isToday ? `1px solid ${accent}` : '1px solid var(--input-border)', 
              borderRadius: 12, padding: 10, minHeight: 90,
              boxShadow: isToday ? `0 0 15px ${accentGlow}` : 'none',
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 500, color: isToday ? accent : 'var(--text-muted)', marginBottom: 8, textAlign: 'right' }}>
                {dayNum}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {dayEvents.map(ev => (
                  <motion.div key={ev.id} layoutId={ev.id} title={ev.title} style={{
                    fontSize: 10, padding: '5px 8px', borderRadius: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    background: `${TYPE_COLORS[ev.type].color}25`,
                    color: TYPE_COLORS[ev.type].color,
                    borderLeft: `3px solid ${TYPE_COLORS[ev.type].color}`,
                    fontWeight: 600, boxShadow: `0 2px 5px rgba(0,0,0,0.2)`
                  }}>
                    {ev.title}
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ADD EVENT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <motion.form onSubmit={handleAdd} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: 30, borderRadius: 20, width: 440, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>Add New Task / Event</h3>
                <div style={{ padding: 6, background: 'var(--input-bg)', borderRadius: '50%', cursor: 'pointer', display: 'flex' }} onClick={() => setShowAddModal(false)}>
                   <X size={16} />
                </div>
              </div>
              
              <input name="title" placeholder="Event Title (e.g. Master React Hooks)" required style={{ width: '100%', padding: '12px 16px', marginBottom: 16, background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: '#fff', borderRadius: 10, fontSize: 14 }} />
              <input name="date" type="datetime-local" required style={{ width: '100%', padding: '12px 16px', marginBottom: 16, background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: '#fff', borderRadius: 10, fontSize: 14 }} />
              
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, marginTop: 4 }}>Category</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {Object.entries(TYPE_COLORS).map(([k, v]) => (
                  <button type="button" key={k} onClick={() => setSelectedType(k)} style={{
                    padding: '10px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600, border: `1px solid ${k === selectedType ? v.color : 'var(--input-border)'}`,
                    background: k === selectedType ? `${v.color}22` : 'var(--input-bg)', color: k === selectedType ? v.color : 'var(--text-subtle)', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    {v.label}
                  </button>
                ))}
              </div>

              <div style={{ padding: '14px 16px', background: 'var(--input-bg)', borderRadius: 12, marginBottom: 24, border: '1px solid var(--input-border)' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, cursor: 'pointer', color: 'var(--text-main)', fontWeight: 500 }}>
                   <input name="notify" type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: accent }} />
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Bell size={16} color={accent} /> Send me email reminders</div>
                 </label>
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 12, background: accent, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15, letterSpacing: 0.5, boxShadow: `0 4px 15px ${accentGlow}` }}>
                Save Objective
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

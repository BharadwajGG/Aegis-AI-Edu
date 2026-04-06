import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useCalendarEngine(mode, userEmail = "student@example.com") {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("aegis_calendar_events");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch(e) {}
      
    return [
      { id: "e1", title: "DSA: Trees & Graphs", type: "study", date: new Date(Date.now() + 3600000).toISOString(), notifyEmail: true },
      { id: "e2", title: "Hackathon Intro", type: "opportunity", date: new Date(Date.now() + 86400000).toISOString(), notifyEmail: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem("aegis_calendar_events", JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setEvents(prev => [...prev, { ...eventData, id: newId }]);
    
    // Explicit confirmation toast for the user so they see the system working instantly
    if (eventData.notifyEmail) {
       toast.success(`Email Notification Scheduled for "${eventData.title}"!`, {
          icon: '✅',
          style: { background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--card-border)' }
       });
    }
  };

  const syncUniversityEvents = () => {
    const d1 = new Date(); d1.setDate(d1.getDate() + 3);
    const d2 = new Date(); d2.setDate(d2.getDate() + 5);

    const sppuMock = [
      { id: "sppu1", title: "Sem 5: DBMS Exam", type: "exam", date: d1.toISOString(), notifyEmail: true },
      { id: "sppu2", title: "Sem 5: CN Exam", type: "exam", date: d2.toISOString(), notifyEmail: true }
    ];
    setEvents(prev => {
       const filtered = prev.filter(e => !e.id.startsWith("sppu"));
       return [...filtered, ...sppuMock];
    });
    toast.success("SPPU Exams Synced Successfully!");
  };

  // Mock Cron Job for Email Notifications
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      events.forEach(ev => {
        if (!ev.notifyEmail) return;
        const evDate = new Date(ev.date);
        const timeDiff = evDate.getTime() - now.getTime();
        
        // Notify if within 24h
        if (timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000) {
          const notifiedKey = `notified_${ev.id}`;
          if (!sessionStorage.getItem(notifiedKey)) {
            sessionStorage.setItem(notifiedKey, "true");
            
            let tip = "Keep up the good work!";
            if (ev.type === "exam") tip = "Stay calm, review your notes!";
            else if (ev.type === "study") tip = "Consistency is key.";

            const msg = mode === "competitive" 
               ? `Alert: ${ev.title} is coming up! Move up the ranks.`
               : `Nudge: ${ev.title} is within 24 hours. ${tip}`;
            
            toast(`📧 Sending Email to: ${userEmail}\n\n${msg}`, {
              icon: '👋',
              style: { textAlign: 'left', minWidth: '320px', background: 'rgba(20,20,30,0.9)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' },
              duration: 6000
            });
          }
        }
      });
    };

    const intervalId = setInterval(checkNotifications, 10000);
    checkNotifications(); 
    
    return () => clearInterval(intervalId);
  }, [events, mode]);

  return { events, addEvent, syncUniversityEvents };
}

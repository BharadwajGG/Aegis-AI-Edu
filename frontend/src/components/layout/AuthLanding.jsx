import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export function AuthLanding({ login }) {
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: '#fff' }}>
      <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 60% 40% at 50% -20%, rgba(16,185,129,0.15) 0%, transparent 70%)"
        }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
        style={{ padding: isMobile ? 24 : 40, width: "90%", maxWidth: 400, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, textAlign: 'center', zIndex: 1, backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
           <div style={{ padding: 16, background: 'rgba(16,185,129,0.1)', borderRadius: '50%', color: '#10b981' }}>
             <ShieldAlert size={40} />
           </div>
        </div>
        <h1 style={{ fontSize: 28, marginBottom: 8, letterSpacing: 1, fontWeight: 700 }}>Welcome to Aegis</h1>
        <p style={{ color: '#a1a1aa', marginBottom: 32, fontSize: 14, lineHeight: 1.5 }}>
          Please authorize with your Google account. We use this to secure your workspace and send real-time personalized email nudges.
        </p>
        <button onClick={handleLogin} disabled={loading} style={{ 
            width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none', 
            background: loading ? '#3f3f46' : '#10b981', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.3s'
        }}>
          {loading ? "Authenticating..." : "Sign In with Google"}
        </button>
        <p style={{ color: '#52525b', fontSize: 11, marginTop: 20 }}>
          If Firebase API keys are absent, this will securely fallback to a mock profile for demonstration.
        </p>
      </motion.div>
    </div>
  );
}

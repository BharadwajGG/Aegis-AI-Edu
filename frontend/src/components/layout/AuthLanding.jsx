import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export function AuthLanding({ login }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative overflow-hidden selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative z-10 p-8 md:p-12 w-full max-w-md bg-white/[0.02] border border-white/10 rounded-[32px] text-center backdrop-blur-2xl shadow-2xl"
      >
        <div className="flex justify-center mb-8">
           <div className="p-5 bg-purple-500/10 rounded-[24px] text-purple-500 ring-1 ring-purple-500/20">
             <Shield size={48} strokeWidth={1.5} />
           </div>
        </div>

        <h1 className="text-3xl font-bold mb-3 tracking-tight">Welcome to Aegis</h1>
        
        <p className="text-slate-400 mb-10 text-sm leading-relaxed">
          Please authorize with your Google account to secure your workspace and access your personalized growth engine.
        </p>

        <button 
          onClick={handleLogin} 
          disabled={loading} 
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
            loading 
              ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
              : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 active:scale-[0.98]"
          }`}
        >
          {loading ? "Authenticating..." : "Sign In with Google"}
        </button>

        <p className="text-slate-600 text-[10px] mt-8 uppercase tracking-widest font-medium">
          Secure • Personalized • intelligent
        </p>
      </motion.div>
    </div>
  );
}

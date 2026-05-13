import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, ChevronRight, ArrowLeft } from 'lucide-react';

export function AuthLanding({ login, loginRedirect, emailLogin, emailSignup, defaultRole = 'student' }) {

  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('landing'); // landing, login, signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showConfigError, setShowConfigError] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // NOTE: For Google login, useAuth handleUserResponse will default to student
      // Ideally we'd pass defaultRole here too, but our useAuth doesn't accept extraData for Google login easily without changing the signature.
      // For now, if defaultRole is recruiter, it might default to student if they use Google. We'll stick to email for specific roles.
      await login();
    } catch (e) {
      if (e.message === "FIREBASE_NOT_CONFIGURED") {
        setShowConfigError(true);
      } else {
        // Log the full error to help debug

        console.error("Auth Error Details:", e);
        setError(`Authentication Error: ${e.code || e.message}`);
      }
      setLoading(false);
    }
  };

  const handleGoogleRedirect = async () => {
    setLoading(true);
    setError('');
    try {
      await loginRedirect();
    } catch (e) {
      setError('Redirect failed. Please check your browser settings.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      window.localStorage.setItem("aegis_mock_login", "true");
      window.localStorage.setItem("aegis_mock_role", defaultRole);

      window.location.reload();
    }, 1000);
  };

  const handleEmailAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (view === 'login') {
        await emailLogin(email, password);
      } else {
        await emailSignup(email, password, { role: defaultRole });

      }
    } catch (e) {
      setError(e.message === "FIREBASE_NOT_CONFIGURED" ? "Email auth requires Firebase configuration." : (e.message || 'Authentication failed.'));
      if (e.message === "FIREBASE_NOT_CONFIGURED") setShowConfigError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative overflow-hidden selection:bg-purple-500/30 font-sans">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full" />

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative z-10 p-8 md:p-12 w-full max-w-md bg-white/[0.02] border border-white/10 rounded-[32px] text-center backdrop-blur-3xl shadow-2xl"
          >
            <div className="flex justify-center mb-8">
              <div className="p-5 bg-purple-500/10 rounded-[24px] text-purple-500 ring-1 ring-purple-500/20">
                <Shield size={48} strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-3xl font-black mb-3 tracking-tight">Protect Your Growth</h1>
            <p className="text-slate-400 mb-10 text-sm leading-relaxed">
              Securely access your personalized Aegis workspace to continue your journey of mastery.
            </p>

            <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-14 bg-white text-black hover:bg-slate-100 transition-all rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <img src="https://www.google.com/favicon.ico" className="size-5" alt="Google" />
                {loading ? "Connecting..." : "Continue with Google"}
              </button>
              
              <button 
                onClick={handleGoogleRedirect}
                className="text-[9px] text-slate-500 hover:text-purple-400 font-bold uppercase tracking-[0.2em] transition-all block mx-auto -mt-2 mb-4 hover:tracking-[0.3em]"
              >
                Having trouble? Try Redirect Mode
              </button>

              <div className="flex items-center gap-4 my-8">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">or</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <button 
                onClick={() => setView('login')}
                className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-2xl font-bold text-sm text-slate-200"
              >
                Sign In with Email
              </button>
              
              <button 
                onClick={handleDemoLogin}
                className="w-full text-[10px] text-slate-600 hover:text-slate-400 font-bold uppercase tracking-[0.2em] transition-colors mt-4"
              >
                Try Demo Mode (No Setup)
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative z-10 p-8 md:p-12 w-full max-w-md bg-white/[0.02] border border-white/10 rounded-[32px] backdrop-blur-3xl shadow-2xl"
          >
            <button 
              onClick={() => setView('landing')}
              className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <h2 className="text-2xl font-bold mb-2">
              {view === 'login' ? "Welcome Back" : "Start Your Journey"}
            </h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              {view === 'login' ? "Enter your credentials to access your dashboard." : "Create your account to unlock personalized roadmaps."}
            </p>

            <form onSubmit={handleEmailAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all" 
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all" 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-rose-500 text-xs font-medium px-1"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 transition-all rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-[0.98]"
              >
                {loading ? "Processing..." : view === 'login' ? "Sign In" : "Create Account"}
                <ChevronRight size={18} />
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-8">
              {view === 'login' ? "New here?" : "Already have an account?"} <button onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="text-purple-400 font-bold hover:underline">{view === 'login' ? "Join Aegis" : "Sign in instead"}</button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Error Overlay */}
      <AnimatePresence>
        {showConfigError && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-950/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-emerald-500" />
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 ring-1 ring-amber-500/20">
                   <Shield size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white">Firebase Keys Missing</h3>
                   <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Authentication Error</p>
                 </div>
              </div>

              <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
                <p>To enable <span className="text-white font-bold">Real-Time Google Authentication</span> and secure your data, you must provide your own Firebase credentials.</p>
                
                <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/5">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Steps:</p>
                  <ol className="list-decimal list-inside space-y-2 text-xs">
                    <li>Create a project at <a href="https://console.firebase.google.com" target="_blank" className="text-purple-400 underline">Firebase Console</a></li>
                    <li>Enable <span className="text-slate-200">Google Auth</span> & <span className="text-slate-200">Firestore</span></li>
                    <li>Copy <span className="text-slate-200">.env.example</span> to <span className="text-slate-200">.env</span> in the frontend folder</li>
                    <li>Paste your Firebase Web App configuration</li>
                  </ol>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowConfigError(false)}
                    className="flex-1 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    Close
                  </button>
                  <button 
                    onClick={handleDemoLogin}
                    className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-600/20 transition-all active:scale-95"
                  >
                    {loading ? "Launching..." : "Enter Demo Mode"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

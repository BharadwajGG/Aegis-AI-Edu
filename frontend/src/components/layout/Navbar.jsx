import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { navLinks } from "../../constants/navLinks";

export function Navbar({ activeView, setActiveView, theme, toggleTheme, user, userRole, logout, onProfileClick }) {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useEffect(() => {
    if (openMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openMobileMenu]);

  const handleNavClick = (view) => {
    // Robust mapping for view names (e.g., "Label-Mate Insight" -> "labelmateinsight")
    const viewId = view.toLowerCase().replace(/[\s-]/g, "");
    setActiveView(viewId);
    setOpenMobileMenu(false);
  };

  return (
    <nav className={`fixed z-50 top-8 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl px-8 py-4 rounded-[24px] border transition-all duration-500 flex items-center justify-between ${openMobileMenu ? 'bg-gray-950 border-slate-800' : 'backdrop-blur-2xl bg-gray-950/60 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}`}>
      <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveView('overview')}>
        <div className="size-11 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
          <Shield className="text-white" size={22} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white">AEGIS</span>
      </div>

      <div className="hidden md:flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5">
        {userRole === 'student' ? (
          navLinks.map((link) => {
            const viewId = link.name.toLowerCase().replace(/[\s-]/g, "");
            const isActive = activeView === viewId;
            return (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.name)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  isActive ? "bg-purple-600 text-white shadow-xl shadow-purple-600/30" : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </button>
            );
          })
        ) : (
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeView === 'overview' ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Overview
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <button 
            onClick={onProfileClick}
            className="flex items-center gap-2 p-1 pr-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
          >
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=7c3aed&color=fff`} 
              alt="Avatar" 
              className="size-8 rounded-xl border border-white/10 shadow-lg group-hover:scale-105 transition-transform"
            />
            <div className="hidden lg:block text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Profile</p>
              <p className="text-[11px] font-bold text-white leading-none">{user.displayName || 'Student'}</p>
            </div>
          </button>
        ) : (
          <button className="hidden md:flex h-10 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl items-center text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-600/20 transition-all">
            Get Started
          </button>
        )}

        <button onClick={() => setOpenMobileMenu(!openMobileMenu)} className="md:hidden size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white">
          {openMobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {openMobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 p-6 bg-gray-950 border border-slate-800 rounded-[32px] flex flex-col items-center gap-6 z-40 md:hidden shadow-2xl"
          >
            {userRole === 'student' ? (
              navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => handleNavClick(link.name)}
                  className="text-lg font-bold text-slate-200 hover:text-purple-500 transition uppercase tracking-widest"
                >
                  {link.name}
                </button>
              ))
            ) : (
              <button 
                onClick={() => handleNavClick('overview')}
                className="text-lg font-bold text-slate-200 hover:text-purple-500 transition uppercase tracking-widest"
              >
                Overview
              </button>
            )}
            {user && (
              <button onClick={logout} className="text-red-500 font-black uppercase tracking-widest text-sm">Logout</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

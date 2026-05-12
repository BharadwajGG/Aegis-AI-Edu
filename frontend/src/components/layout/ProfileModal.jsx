import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Calendar, LogOut, ExternalLink } from 'lucide-react';

export function ProfileModal({ user, userRole, isOpen, onClose, logout }) {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Header / Banner */}
            <div className="h-24 bg-gradient-to-r from-purple-600 to-emerald-600 opacity-20" />
            
            <div className="relative px-8 pb-8">
              {/* Avatar */}
              <div className="absolute -top-12 left-8">
                <div className="relative">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=7c3aed&color=fff`} 
                    alt="Profile"
                    className="size-24 rounded-[28px] border-4 border-gray-900 bg-gray-800 object-cover shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-full border-4 border-gray-900 shadow-sm" />
                </div>
              </div>

              <button 
                onClick={onClose}
                className="absolute top-4 right-4 size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mt-16 mb-8">
                <h2 className="text-2xl font-black text-white tracking-tight">{user.displayName || 'Student Explorer'}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-400">
                     {userRole || 'New User'}
                   </div>
                   <span className="text-slate-500 text-xs">• Verified Account</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</p>
                    <p className="text-sm font-medium text-slate-200">{user.email}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">User ID</p>
                    <p className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">{user.uid}</p>
                  </div>
                  <button className="ml-auto text-purple-400 hover:text-purple-300 transition-colors">
                    <ExternalLink size={14} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Member Since</p>
                    <p className="text-sm font-medium text-slate-200">May 2024</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button 
                  onClick={onClose}
                  className="h-12 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold text-xs uppercase tracking-widest text-slate-300"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => { logout(); onClose(); }}
                  className="h-12 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

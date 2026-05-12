import React from "react";
import { Shield } from "lucide-react";
import { navLinks } from "../../constants/navLinks";

export function Footer({ setActiveView, userRole }) {
  return (
    <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 mt-60 pb-20 w-full text-slate-500 border-t border-white/5 pt-32">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="flex flex-col md:flex-row justify-between w-full gap-20">
        <div className="md:max-w-xs">
          <div className="flex items-center gap-3 mb-8 cursor-pointer group" onClick={() => setActiveView('overview')}>
            <div className="size-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
              <Shield className="text-white" size={16} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">AEGIS</span>
          </div>
          <p className="text-sm leading-relaxed mb-8">
            The next-generation growth operating system for ambitious students and builders.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'GitHub', 'Discord'].map(social => (
              <a key={social} href="#" className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
                <span className="sr-only">{social}</span>
                <div className="size-4 bg-current rounded-sm opacity-50" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
          <div className="space-y-6">
            <h2 className="text-white font-bold uppercase tracking-widest text-[10px]">Platform</h2>
            <ul className="space-y-4 text-[13px] font-medium">
              {userRole === 'student' ? (
                navLinks.map((link) => (
                  <li key={link.name}>
                    <button onClick={() => setActiveView(link.name.toLowerCase().replace(" ", ""))} className="hover:text-purple-400 transition-colors">
                      {link.name}
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <button onClick={() => setActiveView('overview')} className="hover:text-purple-400 transition-colors">
                    Overview
                  </button>
                </li>
              )}
            </ul>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-white font-bold uppercase tracking-widest text-[10px]">Support</h2>
            <ul className="space-y-4 text-[13px] font-medium">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">API Status</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-white font-bold uppercase tracking-widest text-[10px]">Company</h2>
            <ul className="space-y-4 text-[13px] font-medium">
              <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
        <p>© 2025 Aegis Growth OS. All rights reserved.</p>
        <div className="flex gap-10">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

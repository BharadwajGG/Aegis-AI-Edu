import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Construction } from "lucide-react";

export function EmptyDashboard({ role, accent }) {
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="size-24 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 relative"
      >
        <Construction size={40} className="text-slate-600" />
        <div className="absolute -top-2 -right-2 p-2 rounded-lg bg-purple-500/10 text-purple-500 backdrop-blur-md">
          <Sparkles size={16} />
        </div>
      </motion.div>

      <h1 className="text-4xl font-bold tracking-tight mb-4">
        {roleName} Dashboard <span className="text-slate-500">Under Construction</span>
      </h1>
      
      <p className="text-slate-400 max-w-md leading-relaxed text-sm">
        We are crafting a premium, AI-powered experience tailored specifically for {role}s. 
        Soon you'll be able to access exclusive features designed for your needs.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 rounded-2xl bg-white/[0.01] border border-dashed border-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

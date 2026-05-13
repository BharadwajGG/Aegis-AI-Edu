import React from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export function CompanyDashboard({ user, logout }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <Briefcase size={48} className="text-purple-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Company Dashboard</h1>
        <p className="text-slate-400 mb-8">This module is under construction.</p>
        <button onClick={logout} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}

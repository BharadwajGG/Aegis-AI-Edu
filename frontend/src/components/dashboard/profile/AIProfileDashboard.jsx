import React from 'react';
import { motion } from 'framer-motion';
import { User, Target, Zap, Briefcase, GraduationCap, Trophy, ArrowRight, BrainCircuit } from 'lucide-react';
import { useResumeProfile } from '../../../contexts/ResumeContext';

export function AIProfileDashboard({ accent, cardStyle }) {
  const { resumeProfile, loadingProfile } = useResumeProfile();

  if (loadingProfile) {
    return <div className="h-64 flex items-center justify-center"><div className="animate-spin size-8 border-2 border-purple-500 border-t-transparent rounded-full" /></div>;
  }

  if (!resumeProfile) return null;

  const { academic, skills, projects, certifications, insights } = resumeProfile;

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Readiness Score */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="p-6 relative overflow-hidden" style={cardStyle}>
                <div className="absolute -right-10 -top-10 size-40 bg-purple-500/10 blur-[50px] rounded-full" />
                <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Target size={16} /> Placement Readiness
                </h4>
                <div className="flex items-end gap-2">
                    <span className="text-6xl font-black bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                        {insights?.placementReadinessScore || 0}
                    </span>
                    <span className="text-xl text-slate-500 mb-1">/100</span>
                </div>
                <div className="mt-6 space-y-2">
                    <p className="text-sm font-medium text-white">Top Strengths:</p>
                    <div className="flex flex-wrap gap-2">
                        {insights?.strengths?.slice(0,3).map((s,i) => (
                            <span key={i} className="px-2 py-1 text-[10px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s}</span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Career Interests */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="col-span-1 md:col-span-2 p-6" style={cardStyle}>
                <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Briefcase size={16} /> Target Roles & Industries
                </h4>
                <div className="flex flex-wrap gap-3">
                    {insights?.careerInterests?.map((interest, idx) => (
                        <div key={idx} className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center gap-2">
                            <div className="size-2 rounded-full bg-purple-500" />
                            <span className="text-white font-medium">{interest}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 border-t border-slate-800 pt-6">
                     <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Zap size={16} className="text-amber-400" /> Missing Industry Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {insights?.missingIndustrySkills?.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                                + {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Dynamic Skill Graph */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="p-6" style={cardStyle}>
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <BrainCircuit size={16} /> Verified Skill Graph
                </h4>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">ATS Extracted</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills?.map((skill, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-white font-medium">{skill.name}</span>
                            <span className="text-xs font-bold" style={{ color: skill.strength > 75 ? '#10b981' : skill.strength > 50 ? '#f59e0b' : '#64748b' }}>
                                {skill.strength}%
                            </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{width: 0}}
                                animate={{width: `${skill.strength}%`}}
                                transition={{duration: 1, delay: 0.3 + (idx * 0.1)}}
                                className="h-full rounded-full"
                                style={{ backgroundColor: skill.strength > 75 ? '#10b981' : skill.strength > 50 ? '#f59e0b' : '#64748b' }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{skill.category}</p>
                    </div>
                ))}
            </div>
        </motion.div>
        
        {/* Academic & Projects Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="p-6" style={cardStyle}>
                <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                    <GraduationCap size={16} /> Academic Profile
                </h4>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Degree</p>
                        <p className="text-white font-medium text-lg">{academic?.degree} in {academic?.branch}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">University</p>
                        <p className="text-slate-300">{academic?.university}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">CGPA</p>
                        <p className="text-emerald-400 font-bold text-xl">{academic?.cgpa}</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="p-6" style={cardStyle}>
                <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Trophy size={16} /> Top Projects
                </h4>
                <div className="space-y-4">
                    {projects?.slice(0,3).map((proj, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                            <div className="flex justify-between items-start mb-2">
                                <h5 className="text-white font-bold">{proj.name}</h5>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                                    {proj.complexityLevel}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-2 mb-3">{proj.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {proj.technologies?.map((tech, i) => (
                                    <span key={i} className="text-[10px] text-slate-300 px-1.5 py-0.5 bg-slate-800 rounded">{tech}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
  );
}

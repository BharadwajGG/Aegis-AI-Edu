import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Mail, Lock, ChevronRight, ArrowLeft, Building, FileText, Phone, Link as LinkIcon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CollegeAuth({ emailSignup, emailLogin }) {
  const [view, setView] = useState('register'); // 'register', 'login'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    collegeName: '',
    collegeId: '',
    university: '',
    cityState: '',
    naacGrade: 'Not Accredited',
    studentStrength: '',
    principalName: '',
    phone: '',
    websiteUrl: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (view === 'login') {
        if (emailLogin) {
          await emailLogin(formData.email, formData.password, { role: 'college' });
        } else {
          throw new Error("Login function not provided.");
        }
      } else {
        // Validation for edu.in or ac.in
        if (!formData.email.endsWith('.edu.in') && !formData.email.endsWith('.ac.in')) {
          throw new Error("Official College Email must end in .edu.in or .ac.in");
        }

        const extraData = {
          role: 'college',
          name: formData.collegeName,
          collegeId: formData.collegeId,
          university: formData.university,
          cityState: formData.cityState,
          naacGrade: formData.naacGrade,
          studentStrength: formData.studentStrength,
          principalName: formData.principalName,
          phone: formData.phone,
          websiteUrl: formData.websiteUrl
        };

        if (emailSignup) {
           await emailSignup(formData.email, formData.password, extraData);
        } else {
           throw new Error("Signup function not provided.");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative overflow-hidden font-sans py-12 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-blue-600/10 blur-[120px] rounded-full" />

      <AnimatePresence mode="wait">
        <motion.div 
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="relative z-10 p-8 md:p-12 w-full max-w-2xl bg-white/[0.02] border border-white/10 rounded-[32px] backdrop-blur-3xl shadow-2xl"
        >
          <button 
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Home
          </button>

          <div className="flex items-center gap-4 mb-6">
             <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 ring-1 ring-blue-500/20">
               <Landmark size={28} />
             </div>
             <div>
               <h2 className="text-2xl font-bold">
                 {view === 'login' ? "College Portal Login" : "Register Institution"}
               </h2>
               <p className="text-slate-400 text-sm">
                 {view === 'login' ? "Manage your institution and students." : "Join Aegis to elevate your institution's growth."}
               </p>
             </div>
          </div>

          <form onSubmit={handleAction} className="space-y-4">
            {view === 'register' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">College Full Name</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={16} />
                    <input required name="collegeName" onChange={handleInputChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="e.g. MIT Pune" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">College ID / Code</label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={16} />
                    <input required name="collegeId" onChange={handleInputChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="e.g. MIT-PUNE-001" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">University Affiliation</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={16} />
                    <input required name="university" onChange={handleInputChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="e.g. SPPU" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">City & State</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={16} />
                    <input required name="cityState" onChange={handleInputChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="Pune, Maharashtra" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">NAAC Grade</label>
                  <select name="naacGrade" onChange={handleInputChange} value={formData.naacGrade} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500/50 text-white appearance-none">
                    <option value="Not Accredited" className="bg-gray-900 text-white">Not Accredited</option>
                    <option value="A++" className="bg-gray-900 text-white">A++</option>
                    <option value="A+" className="bg-gray-900 text-white">A+</option>
                    <option value="A" className="bg-gray-900 text-white">A</option>
                    <option value="B++" className="bg-gray-900 text-white">B++</option>
                    <option value="B+" className="bg-gray-900 text-white">B+</option>
                    <option value="B" className="bg-gray-900 text-white">B</option>
                    <option value="C" className="bg-gray-900 text-white">C</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Total Student Strength</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={16} />
                    <input type="number" required name="studentStrength" onChange={handleInputChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="e.g. 5000" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Principal / HOD Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={16} />
                    <input required name="principalName" onChange={handleInputChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="Dr. John Doe" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={16} />
                    <input required name="phone" onChange={handleInputChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="+91..." />
                  </div>
                </div>
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Website URL (Optional)</label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={16} />
                    <input name="websiteUrl" onChange={handleInputChange} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50" placeholder="https://..." />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Official College Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={18} />
                <input 
                  type="email" 
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50" 
                  placeholder={view === 'register' ? "admin@college.edu.in" : "name@example.com"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={18} />
                <input 
                  type="password" 
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-xs font-medium px-1">
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 transition-all rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-6"
            >
              {loading ? "Processing..." : view === 'login' ? "Access Portal" : "Register Institution"}
              <ChevronRight size={18} />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-8">
            {view === 'login' ? "Not registered yet?" : "Already registered?"} <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-blue-400 font-bold hover:underline">{view === 'login' ? "Create an account" : "Sign in instead"}</button>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

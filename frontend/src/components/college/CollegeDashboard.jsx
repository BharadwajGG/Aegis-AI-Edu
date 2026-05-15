import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, FileText, ChevronDown } from 'lucide-react';
import { db } from '../../utils/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function CollegeDashboard({ user, logout }) {
  // Fix naming priority: use user.name which is where extraData.name is saved
  const collegeName = user?.name || user?.displayName || 'Maharashtra Institute of Technology';
  const collegeId = user?.collegeId || 'CLG-MIT-PUNE-001';
  const naacGrade = user?.naacGrade || 'A+';
  const totalStudentStrength = user?.studentStrength ? parseInt(user.studentStrength) : 5240;

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  
  // Student Tracking Data
  const [students, setStudents] = useState([
    { id: 1, name: 'Aryan Desai', dept: 'Computer Science', skillScore: 92, masteryLevel: 'Advanced', streak: '14 days' },
    { id: 2, name: 'Priya Sharma', dept: 'Information Tech', skillScore: 85, masteryLevel: 'Intermediate', streak: '5 days' },
    { id: 3, name: 'Neha Gupta', dept: 'Electronics', skillScore: 78, masteryLevel: 'Intermediate', streak: '8 days' },
    { id: 4, name: 'Rahul Verma', dept: 'Computer Science', skillScore: 64, masteryLevel: 'Beginner', streak: '1 day' },
  ]);

  // Departments for Distribution
  const [departments, setDepartments] = useState([
    { name: 'Computer Sci.', count: 1420 },
    { name: 'Info. Tech', count: 1180 },
    { name: 'Electronics', count: 980 },
    { name: 'Mechanical', count: 840 },
    { name: 'Civil', count: 520 },
    { name: 'EXTC', count: 300 },
  ]);
  const [deptForm, setDeptForm] = useState({ name: '', count: '' });

  // Forms state
  const [clubForm, setClubForm] = useState({ name: '', tags: '', description: '', memberCount: '' });
  const [eventForm, setEventForm] = useState({ name: '', date: '', type: 'seminar', description: '', targetAudience: '' });

  useEffect(() => {
    if (!user?.uid) return;
    const clubsRef = collection(db, `colleges/${user.uid}/clubs`);
    const eventsRef = collection(db, `colleges/${user.uid}/events`);
    const deptsRef = collection(db, `colleges/${user.uid}/departments`);

    const unsubClubs = onSnapshot(query(clubsRef, orderBy('createdAt', 'desc')), (snapshot) => {
      const clubsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClubs(clubsData);
    });

    const unsubEvents = onSnapshot(query(eventsRef, orderBy('date', 'asc')), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    });

    const unsubDepts = onSnapshot(query(deptsRef, orderBy('createdAt', 'asc')), (snapshot) => {
      if (!snapshot.empty) {
        setDepartments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });

    // Mock students fetch if possible
    fetch(`${API_URL}/api/college/students`).then(r => r.json()).then(d => { if(d.students?.length) setStudents(d.students); }).catch(() => {});

    return () => {
      unsubClubs();
      unsubEvents();
      unsubDepts();
    };
  }, [user]);

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, `colleges/${user.uid}/clubs`), {
        ...clubForm, tags: clubForm.tags.split(',').map(t => t.trim()), createdAt: serverTimestamp(), collegeId: user.uid
      });
      setClubForm({ name: '', tags: '', description: '', memberCount: '' });
      toast.success("Club registered!");
    } catch(err) { console.error(err); toast.error("Failed to save club."); }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, `colleges/${user.uid}/events`), {
        ...eventForm, createdAt: serverTimestamp(), collegeId: user.uid
      });
      setEventForm({ name: '', date: '', type: 'seminar', description: '', targetAudience: '' });
      toast.success("Event posted!");
    } catch(err) { console.error(err); toast.error("Failed to save event."); }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.count) return;
    
    const countNum = parseInt(deptForm.count);
    const totalAllocated = departments.reduce((acc, d) => acc + d.count, 0);
    
    if (totalAllocated + countNum > totalStudentStrength) {
      toast.error(`Cannot allocate more than total students. Remaining: ${totalStudentStrength - totalAllocated}`);
      return;
    }

    try {
      if (user?.uid) {
        await addDoc(collection(db, `colleges/${user.uid}/departments`), {
          name: deptForm.name,
          count: countNum,
          createdAt: serverTimestamp()
        });
      } else {
        setDepartments([...departments, { name: deptForm.name, count: countNum }]);
      }
      setDeptForm({ name: '', count: '' });
      toast.success("Department added!");
    } catch(err) {
      console.error(err);
      toast.error("Failed to add department.");
    }
  };

  const exportCSV = () => {
    const doc = new jsPDF();
    doc.text("College Report", 14, 22);
    doc.save(`College_Report.pdf`);
  };

  // Mock data for charts mapping to current departments
  const deptRatios = departments.map((d, i) => ({
    name: d.name,
    val: Math.floor(Math.random() * 30) + 60, // Random placement ratio for visual
    color: i % 2 === 0 ? '#3b82f6' : '#10b981'
  })).slice(0, 6);

  const toppers = [
    { name: 'Aditi Rao', dept: 'Computer Science', cgpa: '9.8' },
    { name: 'Karan Singh', dept: 'Information Tech', cgpa: '9.6' },
    { name: 'Pooja Patil', dept: 'Electronics', cgpa: '9.5' },
  ];

  const achievers = [
    { name: 'Vikram Joshi', achievement: 'Winner - Smart India Hackathon 2025' },
    { name: 'Sana Shaikh', achievement: 'Gold Medalist - National Tech Fest' },
  ];

  const totalAllocatedStudents = departments.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-300 font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-[#0a0d14] border-r border-[#1e2536] flex flex-col h-screen shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 bg-[#172A54] rounded flex items-center justify-center border border-blue-500/20">
              <span className="w-4 h-4 border border-blue-500 rounded-sm"></span>
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight tracking-wide">AEGIS</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">College Portal</p>
            </div>
          </div>

          <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-xs font-bold rounded">
                {collegeName.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <h2 className="font-bold text-white leading-snug mb-1 text-[15px]">{collegeName}</h2>
            <p className="text-[11px] text-slate-500 mb-4 tracking-wide">{collegeId}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-green-500 text-[10px] font-bold uppercase tracking-wider">NAAC {naacGrade}</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Affiliation</span><span className="font-medium text-slate-300">{user?.university || 'SPPU'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-medium text-slate-300">{user?.cityState || 'Pune, MH'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Principal</span><span className="font-medium text-slate-300">{user?.principalName || 'Dr. R. Kulkarni'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-blue-400">{user?.email || 'mit@ac.in'}</span></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide">
          {/* OVERVIEW */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Overview</p>
            <div className="space-y-1">
              {['Dashboard', 'Students'].map(item => (
                <button key={item} onClick={() => setActiveTab(item)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${activeTab === item ? 'bg-[#172A54]/50 border-l-2 border-blue-500 text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 border ${activeTab === item ? 'border-blue-500 bg-blue-500/20' : 'border-slate-600'} rounded-sm flex items-center justify-center`}></span>
                    {item}
                  </div>
                  {item === 'Students' && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-medium">{totalStudentStrength}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* MANAGE */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Manage</p>
            <div className="space-y-1">
              {['Student Distribution', 'Register Club', 'Post Event', 'Recruitment Drive'].map(item => (
                <button key={item} onClick={() => setActiveTab(item)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${activeTab === item ? 'bg-[#172A54]/50 border-l-2 border-blue-500 text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 border ${activeTab === item ? 'border-blue-500 bg-blue-500/20' : 'border-slate-600'} rounded-sm flex items-center justify-center`}></span>
                    {item}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SETTINGS */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Settings</p>
            <div className="space-y-1">
              {['College Profile', 'Notifications'].map(item => (
                <button key={item} onClick={() => setActiveTab(item)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${activeTab === item ? 'bg-[#172A54]/50 border-l-2 border-blue-500 text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 border ${activeTab === item ? 'border-blue-500 bg-blue-500/20' : 'border-slate-600'} rounded-sm flex items-center justify-center`}></span>
                    {item}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#1e2536]">
          <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#172A54] text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                {(collegeName?.[0] || 'A').toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">Admin User</p>
                <p className="text-[10px] text-slate-500">College Admin</p>
              </div>
            </div>
            <LogOut size={14} className="text-slate-500 group-hover:text-rose-400" onClick={logout} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-[1200px] mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{activeTab === 'Dashboard' ? 'Dashboard overview' : activeTab}</h1>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>AEGIS</span>
                <span>/</span>
                <span className="text-slate-400">College Portal</span>
                <span>/</span>
                <span className="text-blue-400">{activeTab}</span>
              </div>
            </div>
            {(activeTab === 'Dashboard' || activeTab === 'Students') && (
              <div className="flex items-center gap-3">
                 <button className="w-8 h-8 rounded-lg border border-[#1e2536] bg-[#111623] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                   <span className="w-3 h-3 border border-current rounded-sm"></span>
                 </button>
                 <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-[#172A54] hover:bg-blue-600/40 border border-blue-500/30 rounded-lg text-sm font-semibold text-blue-400 transition-all">
                   <FileText size={16} /> Export PDF report
                 </button>
              </div>
            )}
          </div>

          {activeTab === 'Dashboard' && (
            <>
              {/* Top Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Students</p>
                    <div className="p-1.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">
                      <span className="block w-3 h-3 border-2 border-current rounded-sm"></span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{totalStudentStrength.toLocaleString()}</h3>
                  <p className="text-xs text-slate-500 font-medium">{departments.length} departments</p>
                </div>
                
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Placement Rate</p>
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      <span className="block w-3 h-3 border-2 border-current rounded-sm"></span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">78%</h3>
                  <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 border border-current rounded-sm inline-block"></span> 4% <span className="text-slate-500">vs last batch</span>
                  </p>
                </div>

                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Registered Clubs</p>
                    <div className="p-1.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <span className="block w-3 h-3 border-2 border-current rounded-sm"></span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{clubs.length || 12}</h3>
                  <p className="text-xs text-slate-500 font-medium">3 pending</p>
                </div>

                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Avg Integrity</p>
                    <div className="p-1.5 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      <span className="block w-3 h-3 border-2 border-current rounded-sm"></span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">88%</h3>
                  <p className="text-xs text-slate-500 font-medium">NAAC reportable</p>
                </div>
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-2 gap-4">
                {/* Placement Ratio */}
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <span className="w-3 h-3 border border-slate-500 rounded-sm"></span> Placement ratio — by dept
                    </div>
                    <button className="text-xs text-slate-500 hover:text-slate-300">View all</button>
                  </div>
                  
                  <div className="space-y-5">
                    {deptRatios.map(dept => (
                      <div key={dept.name} className="flex items-center gap-4 text-sm font-medium">
                        <span className="w-28 text-slate-300">{dept.name}</span>
                        <div className="flex-1 flex items-center gap-3">
                          <div className="w-12 h-1.5 bg-[#1e2536] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${dept.val}%`, backgroundColor: dept.color }}></div>
                          </div>
                          <span className="text-xs font-bold" style={{ color: dept.color }}>{dept.val}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Students Dept Wise */}
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <span className="w-3 h-3 border border-slate-500 rounded-sm"></span> Students — dept wise
                    </div>
                    <button className="text-xs text-slate-500 hover:text-slate-300">Details</button>
                  </div>

                  <div className="space-y-4">
                    {departments.slice(0, 6).map((dept, idx) => (
                      <div key={dept.name} className="flex items-center justify-between text-sm py-1">
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-600 font-mono tracking-wider">0{idx + 1}</span>
                          <span className="text-slate-300 font-medium">{dept.name}</span>
                        </div>
                        <span className="font-bold text-white">{dept.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Student Distribution' && (
            <div className="space-y-6">
              <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 max-w-4xl flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold mb-1">Student Allocation</h3>
                  <p className="text-xs text-slate-400">Distribute your total student strength ({totalStudentStrength}) into departments.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Remaining</p>
                  <p className={`text-2xl font-bold ${totalStudentStrength - totalAllocatedStudents < 0 ? 'text-rose-500' : 'text-blue-400'}`}>
                    {totalStudentStrength - totalAllocatedStudents}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-4xl">
                {/* Form */}
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 border border-blue-500 rounded-sm"></span> Add Department
                  </h3>
                  <form onSubmit={handleAddDepartment} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Department Name</label>
                      <input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors" value={deptForm.name} onChange={e=>setDeptForm({...deptForm, name: e.target.value})} placeholder="e.g. Computer Science" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Student Count</label>
                      <input type="number" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors" value={deptForm.count} onChange={e=>setDeptForm({...deptForm, count: e.target.value})} placeholder="e.g. 120" />
                    </div>
                    <button type="submit" className="w-full mt-2 bg-[#172A54] hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 font-bold py-3 px-6 rounded-xl transition-all">
                      Add Department
                    </button>
                  </form>
                </div>

                {/* List */}
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 border border-green-500 rounded-sm"></span> Allocated Departments
                  </h3>
                  <div className="space-y-3 overflow-y-auto max-h-[300px] scrollbar-hide pr-2">
                    {departments.map((dept, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#0a0d14] rounded-lg border border-[#1e2536]">
                        <span className="text-sm text-slate-300 font-medium">{dept.name}</span>
                        <span className="text-sm font-bold text-white bg-white/5 px-2 py-1 rounded">{dept.count}</span>
                      </div>
                    ))}
                    {departments.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">No departments allocated yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Students' && (
            <div className="space-y-6">
              <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 relative overflow-hidden flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total College Students</p>
                  <h3 className="text-3xl font-bold text-white">{totalStudentStrength.toLocaleString()}</h3>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <span className="block w-6 h-6 border-2 border-current rounded-sm"></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 border border-amber-500 rounded-sm"></span> Department Toppers (CGPA)
                  </h3>
                  <div className="space-y-3">
                    {toppers.map(t => (
                      <div key={t.name} className="flex justify-between items-center p-3 bg-[#0a0d14] rounded-lg border border-[#1e2536]">
                        <div>
                          <p className="text-sm font-bold text-white">{t.name}</p>
                          <p className="text-xs text-slate-500">{t.dept}</p>
                        </div>
                        <span className="text-sm font-bold text-amber-500">{t.cgpa} CGPA</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 border border-purple-500 rounded-sm"></span> Extra-curricular Achievers
                  </h3>
                  <div className="space-y-3">
                    {achievers.map(a => (
                      <div key={a.name} className="flex flex-col p-3 bg-[#0a0d14] rounded-lg border border-[#1e2536]">
                        <p className="text-sm font-bold text-white">{a.name}</p>
                        <p className="text-xs text-purple-400 mt-1">{a.achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Register Club' && (
            <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Register a New Club</h2>
              <form onSubmit={handleClubSubmit} className="space-y-4">
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Club Name</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600" value={clubForm.name} onChange={e=>setClubForm({...clubForm, name: e.target.value})} placeholder="e.g. AI Enthu..." /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Domain / Tags</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600" value={clubForm.tags} onChange={e=>setClubForm({...clubForm, tags: e.target.value})} placeholder="e.g. AI, Tech" /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Description</label><textarea required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600" value={clubForm.description} onChange={e=>setClubForm({...clubForm, description: e.target.value})} placeholder="Brief description..." rows={3} /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Member Count</label><input type="number" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600" value={clubForm.memberCount} onChange={e=>setClubForm({...clubForm, memberCount: e.target.value})} placeholder="0" /></div>
                <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all w-full md:w-auto">Register Club</button>
              </form>
            </div>
          )}

          {activeTab === 'Post Event' && (
            <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Post an Event</h2>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Event Name</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-600" value={eventForm.name} onChange={e=>setEventForm({...eventForm, name: e.target.value})} placeholder="e.g. Hackathon 2026" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Date</label><input type="date" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 transition-colors" value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} /></div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Type</label>
                    <select className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 transition-colors appearance-none" value={eventForm.type} onChange={e=>setEventForm({...eventForm, type: e.target.value})}>
                      <option value="seminar">Seminar</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="workshop">Workshop</option>
                    </select>
                  </div>
                </div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Target Audience</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-600" value={eventForm.targetAudience} onChange={e=>setEventForm({...eventForm, targetAudience: e.target.value})} placeholder="e.g. All CS Students" /></div>
                <button type="submit" className="mt-4 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-all w-full md:w-auto">Publish Event</button>
              </form>
            </div>
          )}

          {activeTab === 'Recruitment Drive' && (
            <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Post Recruitment Drive</h2>
              <p className="text-sm text-slate-400 mb-4">Post details about company visits to notify students.</p>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Company Name</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600" placeholder="e.g. Google" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Role</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600" placeholder="e.g. SDE-1" /></div>
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">CTC</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600" placeholder="e.g. 15 LPA" /></div>
                </div>
                <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Visit Date</label><input type="date" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-colors" /></div>
                <button type="submit" className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all w-full md:w-auto">Post Drive</button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

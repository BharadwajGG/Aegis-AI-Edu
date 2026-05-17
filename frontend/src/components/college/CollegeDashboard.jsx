import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, FileText, ChevronDown } from 'lucide-react';
import { db } from '../../utils/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function CollegeDashboard({ user, logout }) {
  // Fix naming priority: use user.name which is where extraData.name is saved
  const collegeName = user?.name || user?.displayName || 'Unnamed College';
  const collegeId = user?.collegeId || 'N/A';
  const naacGrade = user?.naacGrade || 'N/A';
  const [totalStudentStrength, setTotalStudentStrength] = useState(() => {
    try { const saved = localStorage.getItem('aegis_total_students'); if(saved) return parseInt(saved); } catch(e){}
    return user?.studentStrength ? parseInt(String(user.studentStrength).replace(/,/g, '')) : 0;
  });
  const [isEditingTotal, setIsEditingTotal] = useState(false);

  useEffect(() => {
    localStorage.setItem('aegis_total_students', totalStudentStrength.toString());
  }, [totalStudentStrength]);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [clubs, setClubs] = useState(() => {
    try { const saved = localStorage.getItem('aegis_clubs'); if(saved) return JSON.parse(saved); } catch(e){} return [];
  });
  const [events, setEvents] = useState(() => {
    try { const saved = localStorage.getItem('aegis_events'); if(saved) return JSON.parse(saved); } catch(e){} return [];
  });
  const [companies, setCompanies] = useState(() => {
    try { const saved = localStorage.getItem('aegis_companies'); if(saved) return JSON.parse(saved); } catch(e){} return [];
  });
  const [drives, setDrives] = useState(() => {
    try { const saved = localStorage.getItem('aegis_drives'); if(saved) return JSON.parse(saved); } catch(e){} return [];
  });
  
  useEffect(() => { localStorage.setItem('aegis_clubs', JSON.stringify(clubs)); }, [clubs]);
  useEffect(() => { localStorage.setItem('aegis_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('aegis_companies', JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem('aegis_drives', JSON.stringify(drives)); }, [drives]);
  
  // Student Tracking Data
  const [students, setStudents] = useState([
    { id: 1, name: 'Aryan Desai', dept: 'Computer Science', skillScore: 92, masteryLevel: 'Advanced', streak: '14 days' },
    { id: 2, name: 'Priya Sharma', dept: 'Information Tech', skillScore: 85, masteryLevel: 'Intermediate', streak: '5 days' },
    { id: 3, name: 'Neha Gupta', dept: 'Electronics', skillScore: 78, masteryLevel: 'Intermediate', streak: '8 days' },
    { id: 4, name: 'Rahul Verma', dept: 'Computer Science', skillScore: 64, masteryLevel: 'Beginner', streak: '1 day' },
  ]);

  // Departments for Distribution
  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem('aegis_departments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('aegis_departments', JSON.stringify(departments));
  }, [departments]);

  const [deptForm, setDeptForm] = useState({ name: '', count: '', year1: '', year2: '', year3: '', year4: '' });
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [editDeptId, setEditDeptId] = useState(null);

  // Forms state
  const [editClubId, setEditClubId] = useState(null);
  const [clubForm, setClubForm] = useState({ name: '', tags: '', description: '', memberCount: '' });
  const [eventForm, setEventForm] = useState({ name: '', date: '', type: 'seminar', description: '', targetAudienceDept: 'All', targetAudienceYear: 'All' });
  const [companyForm, setCompanyForm] = useState({ name: '', industry: '', tieupDate: '' });
  const [driveForm, setDriveForm] = useState({ companyId: '', role: '', ctc: '', visitDate: '', targetAudienceDept: 'All', targetAudienceYear: 'All', openings: '' });

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
      setDepartments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const companiesRef = collection(db, `colleges/${user.uid}/companies`);
    const drivesRef = collection(db, `colleges/${user.uid}/drives`);

    const unsubCompanies = onSnapshot(query(companiesRef, orderBy('createdAt', 'desc')), (snapshot) => {
      setCompanies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubDrives = onSnapshot(query(drivesRef, orderBy('createdAt', 'desc')), (snapshot) => {
      setDrives(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Mock students fetch if possible
    fetch(`${API_URL}/api/college/students`).then(r => r.json()).then(d => { if(d.students?.length) setStudents(d.students); }).catch(() => {});

    return () => {
      unsubClubs();
      unsubEvents();
      unsubDepts();
      unsubCompanies();
      unsubDrives();
    };
  }, [user]);

  const handleClubSubmit = async (e) => {
    e.preventDefault();
    const newClub = { ...clubForm, tags: typeof clubForm.tags === 'string' ? clubForm.tags.split(',').map(t => t.trim()) : clubForm.tags };
    
    try {
      if (editClubId) {
        // Optimistic
        setClubs(clubs.map(c => (c.id || c.name) === editClubId ? { ...c, ...newClub } : c));
        setEditClubId(null);
        toast.success("Club updated!");
        
        if (user?.uid && clubs.find(c => (c.id || c.name) === editClubId)?.id) {
          await updateDoc(doc(db, `colleges/${user.uid}/clubs`, editClubId), newClub);
        }
      } else {
        const clubWithId = { id: Date.now().toString(), ...newClub };
        setClubs(prev => [...prev, clubWithId]);
        toast.success("Club registered!");
        
        if (user?.uid) {
          await addDoc(collection(db, `colleges/${user.uid}/clubs`), {
            ...newClub, createdAt: serverTimestamp(), collegeId: user.uid
          });
        }
      }
      setClubForm({ name: '', tags: '', description: '', memberCount: '' });
    } catch(err) { console.error("Firebase save failed, but locally updated:", err); }
  };

  const handleEditClub = (club) => {
    const id = club.id || club.name;
    setEditClubId(id);
    setClubForm({
      name: club.name,
      tags: Array.isArray(club.tags) ? club.tags.join(', ') : club.tags || '',
      description: club.description || '',
      memberCount: club.memberCount || ''
    });
  };

  const handleDeleteClub = async (club) => {
    const id = club.id || club.name;
    setClubs(prev => prev.filter(c => (c.id || c.name) !== id));
    try {
      if (user?.uid && club.id) {
        await deleteDoc(doc(db, `colleges/${user.uid}/clubs`, club.id));
      }
      if (editClubId === id) {
        setEditClubId(null);
        setClubForm({ name: '', tags: '', description: '', memberCount: '' });
      }
      toast.success("Club removed!");
    } catch (err) { console.error(err); toast.error("Failed to remove club."); }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    const companyWithId = { id: Date.now().toString(), ...companyForm };
    setCompanies(prev => [...prev, companyWithId]);
    setCompanyForm({ name: '', industry: '', tieupDate: '' });
    toast.success("Company added!");
    try {
      if (user?.uid) {
        await addDoc(collection(db, `colleges/${user.uid}/companies`), {
          ...companyForm, createdAt: serverTimestamp(), collegeId: user.uid
        });
      }
    } catch(err) { console.error("Firebase save failed:", err); }
  };

  const handleDeleteCompany = async (company) => {
    const id = company.id || company.name;
    setCompanies(prev => prev.filter(c => (c.id || c.name) !== id));
    try {
      if (user?.uid && company.id) {
        await deleteDoc(doc(db, `colleges/${user.uid}/companies`, company.id));
      }
      toast.success("Company removed!");
    } catch (err) { console.error(err); toast.error("Failed to remove company."); }
  };

  const handleDriveSubmit = async (e) => {
    e.preventDefault();
    const driveWithId = { id: Date.now().toString(), ...driveForm };
    setDrives(prev => [...prev, driveWithId]);
    setDriveForm({ companyId: '', role: '', ctc: '', visitDate: '', targetAudienceDept: 'All', targetAudienceYear: 'All', openings: '' });
    toast.success("Drive posted!");
    try {
      if (user?.uid) {
        await addDoc(collection(db, `colleges/${user.uid}/drives`), {
          ...driveForm, createdAt: serverTimestamp(), collegeId: user.uid
        });
      }
    } catch(err) { console.error("Firebase save failed:", err); }
  };

  const handleDeleteDrive = async (drive) => {
    const id = drive.id || drive.role;
    setDrives(prev => prev.filter(d => (d.id || d.role) !== id));
    try {
      if (user?.uid && drive.id) {
        await deleteDoc(doc(db, `colleges/${user.uid}/drives`, drive.id));
      }
      toast.success("Drive removed!");
    } catch (err) { console.error(err); toast.error("Failed to remove drive."); }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const eventWithId = { id: Date.now().toString(), ...eventForm };

    setEvents(prev => [...prev, eventWithId]);
    setEventForm({ name: '', date: '', type: 'seminar', description: '', targetAudienceDept: 'All', targetAudienceYear: 'All' });
    toast.success("Event posted!");

    try {
      if (user?.uid) {
        await addDoc(collection(db, `colleges/${user.uid}/events`), {
          ...eventForm, createdAt: serverTimestamp(), collegeId: user.uid
        });
      }
    } catch(err) { console.error("Firebase save failed, but locally updated:", err); }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.count) return;
    
    const countNum = parseInt(deptForm.count);
    const y1 = parseInt(deptForm.year1) || 0;
    const y2 = parseInt(deptForm.year2) || 0;
    const y3 = parseInt(deptForm.year3) || 0;
    const y4 = parseInt(deptForm.year4) || 0;

    const totalAllocated = departments.reduce((acc, d) => {
      const dId = d.id || d.name;
      if (editDeptId && dId === editDeptId) return acc;
      return acc + d.count;
    }, 0);
    
    if (totalAllocated + countNum > totalStudentStrength) {
      toast.error(`Cannot allocate more than total students. Remaining: ${totalStudentStrength - totalAllocated}`);
      return;
    }

    if (y1 + y2 + y3 + y4 !== countNum) {
      toast.error(`Year-wise sum (${y1 + y2 + y3 + y4}) must equal total department count (${countNum})`);
      return;
    }

    try {
      if (editDeptId) {
        if (user?.uid && departments.find(d => (d.id || d.name) === editDeptId)?.id) {
          await updateDoc(doc(db, `colleges/${user.uid}/departments`, editDeptId), {
            name: deptForm.name,
            count: countNum,
            year1: y1,
            year2: y2,
            year3: y3,
            year4: y4,
          });
        } else {
          setDepartments(departments.map(d => (d.id || d.name) === editDeptId ? { ...d, name: deptForm.name, count: countNum, year1: y1, year2: y2, year3: y3, year4: y4 } : d));
        }
        setEditDeptId(null);
        toast.success("Department updated!");
      } else {
        if (user?.uid) {
          await addDoc(collection(db, `colleges/${user.uid}/departments`), {
            name: deptForm.name,
            count: countNum,
            year1: y1,
            year2: y2,
            year3: y3,
            year4: y4,
            createdAt: serverTimestamp()
          });
        } else {
          setDepartments([...departments, { id: Date.now().toString(), name: deptForm.name, count: countNum, year1: y1, year2: y2, year3: y3, year4: y4 }]);
        }
        toast.success("Department added!");
      }
      setDeptForm({ name: '', count: '', year1: '', year2: '', year3: '', year4: '' });
    } catch(err) {
      console.error(err);
      toast.error(editDeptId ? "Failed to update department." : "Failed to add department.");
    }
  };

  const handleEditDepartment = (dept) => {
    const id = dept.id || dept.name; 
    setEditDeptId(id);
    setDeptForm({
      name: dept.name,
      count: dept.count || '',
      year1: dept.year1 || '',
      year2: dept.year2 || '',
      year3: dept.year3 || '',
      year4: dept.year4 || ''
    });
  };

  const handleDeleteDepartment = async (dept) => {
    const id = dept.id || dept.name;
    
    // Optimistic UI update to fix calculation logic instantly
    setDepartments(prev => prev.filter(d => (d.id || d.name) !== id));
    
    try {
      if (user?.uid && dept.id) {
        await deleteDoc(doc(db, `colleges/${user.uid}/departments`, dept.id));
      }
      if (editDeptId === id) {
        setEditDeptId(null);
        setDeptForm({ name: '', count: '', year1: '', year2: '', year3: '', year4: '' });
      }
      toast.success("Department removed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove department.");
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
              {['Dashboard', 'Students', 'Recruiters'].map(item => (
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
                  <h3 className="text-3xl font-bold text-white mb-2">{clubs.length}</h3>
                  <p className="text-xs text-slate-500 font-medium">0 pending</p>
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
              <div className="grid grid-cols-1 gap-4">
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
              </div>
            </>
          )}

          {activeTab === 'Student Distribution' && (
            <div className="space-y-6">
              <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 max-w-4xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold mb-1">Student Allocation</h3>
                  <p className="text-xs text-slate-400">Distribute your total student strength into departments.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right border-r border-[#1e2536] pr-6">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total</p>
                    {isEditingTotal ? (
                      <input 
                        type="number" 
                        autoFocus 
                        onBlur={() => setIsEditingTotal(false)} 
                        className="w-24 bg-[#0a0d14] border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none" 
                        value={totalStudentStrength} 
                        onChange={e => setTotalStudentStrength(parseInt(e.target.value) || 0)} 
                      />
                    ) : (
                      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTotal(true)}>
                        <p className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{totalStudentStrength}</p>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Remaining</p>
                    <p className={`text-xl font-bold ${totalStudentStrength - totalAllocatedStudents < 0 ? 'text-rose-500' : 'text-blue-400'}`}>
                      {totalStudentStrength - totalAllocatedStudents}
                    </p>
                  </div>
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Total Student Count</label>
                      <input type="number" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors" value={deptForm.count} onChange={e=>setDeptForm({...deptForm, count: e.target.value})} placeholder="e.g. 120" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">1st Year</label>
                        <input type="number" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors" value={deptForm.year1} onChange={e=>setDeptForm({...deptForm, year1: e.target.value})} placeholder="0" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">2nd Year</label>
                        <input type="number" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors" value={deptForm.year2} onChange={e=>setDeptForm({...deptForm, year2: e.target.value})} placeholder="0" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">3rd Year</label>
                        <input type="number" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors" value={deptForm.year3} onChange={e=>setDeptForm({...deptForm, year3: e.target.value})} placeholder="0" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">4th Year</label>
                        <input type="number" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors" value={deptForm.year4} onChange={e=>setDeptForm({...deptForm, year4: e.target.value})} placeholder="0" />
                      </div>
                    </div>
                    <button type="submit" className="w-full mt-2 bg-[#172A54] hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 font-bold py-3 px-6 rounded-xl transition-all">
                      {editDeptId ? "Update Department" : "Add Department"}
                    </button>
                  </form>
                </div>

                {/* List */}
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 border border-green-500 rounded-sm"></span> Allocated Departments
                  </h3>
                  <div className="space-y-3 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
                    {departments.map((dept, idx) => (
                      <div key={idx} className="flex flex-col p-3 bg-[#0a0d14] rounded-lg border border-[#1e2536]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-300 font-medium">{dept.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white bg-white/5 px-2 py-1 rounded">{dept.count} Total</span>
                            <button onClick={() => handleEditDepartment(dept)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                            <button onClick={() => handleDeleteDepartment(dept)} className="text-xs text-rose-400 hover:text-rose-300 transition-colors">Del</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs text-slate-500 bg-[#111623] p-2 rounded">
                          <div><p className="font-bold text-slate-400">{dept.year1 || 0}</p><p className="text-[9px] uppercase">1st Yr</p></div>
                          <div><p className="font-bold text-slate-400">{dept.year2 || 0}</p><p className="text-[9px] uppercase">2nd Yr</p></div>
                          <div><p className="font-bold text-slate-400">{dept.year3 || 0}</p><p className="text-[9px] uppercase">3rd Yr</p></div>
                          <div><p className="font-bold text-slate-400">{dept.year4 || 0}</p><p className="text-[9px] uppercase">4th Yr</p></div>
                        </div>
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

              <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-3 h-3 border border-blue-500 rounded-sm"></span> Department & Year-wise Distribution
                  </h3>
                  <select 
                    className="bg-[#0a0d14] border border-[#1e2536] text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50 transition-colors"
                    value={selectedDeptFilter}
                    onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    {departments.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.filter(d => selectedDeptFilter === 'All' || d.name === selectedDeptFilter).map((dept, idx) => (
                    <div key={idx} className="flex flex-col p-4 bg-[#0a0d14] rounded-lg border border-[#1e2536]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-white font-bold">{dept.name}</span>
                        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{dept.count} Total</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[#111623] p-2 rounded flex justify-between items-center"><span className="text-slate-500 text-xs">1st Yr</span><span className="text-slate-300 font-bold">{dept.year1 || 0}</span></div>
                        <div className="bg-[#111623] p-2 rounded flex justify-between items-center"><span className="text-slate-500 text-xs">2nd Yr</span><span className="text-slate-300 font-bold">{dept.year2 || 0}</span></div>
                        <div className="bg-[#111623] p-2 rounded flex justify-between items-center"><span className="text-slate-500 text-xs">3rd Yr</span><span className="text-slate-300 font-bold">{dept.year3 || 0}</span></div>
                        <div className="bg-[#111623] p-2 rounded flex justify-between items-center"><span className="text-slate-500 text-xs">4th Yr</span><span className="text-slate-300 font-bold">{dept.year4 || 0}</span></div>
                      </div>
                    </div>
                  ))}
                  {departments.length === 0 && (
                    <p className="text-sm text-slate-500 col-span-full py-4 text-center">No departments allocated yet.</p>
                  )}
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
            <div className="space-y-6">
              <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-6">{editClubId ? "Edit Club" : "Register a New Club"}</h2>
                <form onSubmit={handleClubSubmit} className="space-y-4">
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Club Name</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600" value={clubForm.name} onChange={e=>setClubForm({...clubForm, name: e.target.value})} placeholder="e.g. AI Enthu..." /></div>
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Domain / Tags</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600" value={clubForm.tags} onChange={e=>setClubForm({...clubForm, tags: e.target.value})} placeholder="e.g. AI, Tech" /></div>
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Description</label><textarea required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600" value={clubForm.description} onChange={e=>setClubForm({...clubForm, description: e.target.value})} placeholder="Brief description..." rows={3} /></div>
                  <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Member Count</label><input type="number" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600" value={clubForm.memberCount} onChange={e=>setClubForm({...clubForm, memberCount: e.target.value})} placeholder="0" /></div>
                  <div className="flex gap-3 mt-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all w-full md:w-auto">{editClubId ? "Update Club" : "Register Club"}</button>
                    {editClubId && <button type="button" onClick={() => { setEditClubId(null); setClubForm({ name: '', tags: '', description: '', memberCount: '' }); }} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all w-full md:w-auto">Cancel</button>}
                  </div>
                </form>
              </div>

              {clubs.length > 0 && (
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 max-w-2xl">
                  <h3 className="text-sm font-bold text-white mb-4">Registered Clubs</h3>
                  <div className="space-y-3">
                    {clubs.map(club => (
                      <div key={club.id || club.name} className="flex justify-between items-center p-4 bg-[#0a0d14] rounded-lg border border-[#1e2536]">
                        <div>
                          <p className="text-sm font-bold text-white">{club.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{Array.isArray(club.tags) ? club.tags.join(', ') : club.tags}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">{club.memberCount} Members</span>
                          <button onClick={() => handleEditClub(club)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded transition-colors">Edit</button>
                          <button onClick={() => handleDeleteClub(club)} className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold rounded transition-colors">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Target Department</label>
                    <select className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 transition-colors appearance-none" value={eventForm.targetAudienceDept} onChange={e=>setEventForm({...eventForm, targetAudienceDept: e.target.value})}>
                      <option value="All">All Departments</option>
                      {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Target Year</label>
                    <select className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 transition-colors appearance-none" value={eventForm.targetAudienceYear} onChange={e=>setEventForm({...eventForm, targetAudienceYear: e.target.value})}>
                      <option value="All">All Years</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="mt-4 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-all w-full md:w-auto">Publish Event</button>
              </form>
            </div>
          )}

          {activeTab === 'Recruitment Drive' && (
            <div className="space-y-6">
              {/* Tie-up Companies Section */}
              <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Tie-up Companies</h2>
                <form onSubmit={handleCompanySubmit} className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Company Name</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600" value={companyForm.name} onChange={e=>setCompanyForm({...companyForm, name: e.target.value})} placeholder="e.g. Google" /></div>
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Industry</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600" value={companyForm.industry} onChange={e=>setCompanyForm({...companyForm, industry: e.target.value})} placeholder="e.g. IT" /></div>
                  </div>
                  <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all">Add Company</button>
                </form>
                
                {companies.length > 0 && (
                  <div className="space-y-2">
                    {companies.map(comp => (
                      <div key={comp.id || comp.name} className="flex justify-between items-center p-3 bg-[#0a0d14] rounded-lg border border-[#1e2536]">
                        <div>
                          <p className="text-sm font-bold text-white">{comp.name}</p>
                          <p className="text-[10px] text-slate-500">{comp.industry}</p>
                        </div>
                        <button onClick={() => handleDeleteCompany(comp)} className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold rounded transition-colors">Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Drive Section */}
              <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6 max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Post Recruitment Drive</h2>
                <form onSubmit={handleDriveSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Company</label>
                      <select required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none" value={driveForm.companyId} onChange={e=>setDriveForm({...driveForm, companyId: e.target.value})}>
                        <option value="">Select Company</option>
                        {companies.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Role</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600" value={driveForm.role} onChange={e=>setDriveForm({...driveForm, role: e.target.value})} placeholder="e.g. SDE-1" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">CTC</label><input required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600" value={driveForm.ctc} onChange={e=>setDriveForm({...driveForm, ctc: e.target.value})} placeholder="e.g. 15 LPA" /></div>
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Visit Date</label><input type="date" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-colors" value={driveForm.visitDate} onChange={e=>setDriveForm({...driveForm, visitDate: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Target Dept</label>
                      <select className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-colors appearance-none" value={driveForm.targetAudienceDept} onChange={e=>setDriveForm({...driveForm, targetAudienceDept: e.target.value})}>
                        <option value="All">All Departments</option>
                        {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Target Year</label>
                      <select className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-colors appearance-none" value={driveForm.targetAudienceYear} onChange={e=>setDriveForm({...driveForm, targetAudienceYear: e.target.value})}>
                        <option value="All">All Years</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                    <div><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Openings</label><input type="number" required className="w-full bg-[#0a0d14] border border-[#1e2536] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-slate-600" value={driveForm.openings} onChange={e=>setDriveForm({...driveForm, openings: e.target.value})} placeholder="e.g. 10" /></div>
                  </div>
                  <button type="submit" className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all w-full md:w-auto">Post Drive</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'Recruiters' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Recruiters Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4">Posted Drives</h3>
                  <div className="space-y-3">
                    {drives.length === 0 ? <p className="text-xs text-slate-500">No drives posted yet.</p> : drives.map(d => (
                      <div key={d.id || d.role} className="flex justify-between items-center p-4 bg-[#0a0d14] rounded-lg border border-[#1e2536]">
                        <div>
                          <p className="text-sm font-bold text-white">{d.companyId}</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{d.role} • {d.ctc}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">{d.openings} Openings</span>
                          <span className="text-[10px] text-slate-500">{d.visitDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4">Placement Rate (Dept-wise)</h3>
                  <div className="space-y-4">
                    {deptRatios.map(d => (
                      <div key={d.name}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-slate-300">{d.name}</span>
                          <span className="font-bold" style={{ color: d.color }}>{d.val}%</span>
                        </div>
                        <div className="w-full bg-[#0a0d14] rounded-full h-2 overflow-hidden border border-[#1e2536]">
                          <div className="h-full rounded-full transition-all duration-1000 relative" style={{ width: `${d.val}%`, backgroundColor: d.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

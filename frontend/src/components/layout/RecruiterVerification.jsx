import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Building2, User, FileText, CheckSquare,
  ChevronRight, ChevronLeft, Upload, Mail, Loader2,
  CheckCircle2, Clock, XCircle, ChevronDown
} from "lucide-react";
import toast from "react-hot-toast";

const PERSONAL_DOMAINS = ["gmail.com","yahoo.com","hotmail.com","outlook.com","rediffmail.com","ymail.com"];
const INDUSTRIES = ["Technology","Finance & Banking","Healthcare","Education","Manufacturing","Retail & E-Commerce","Consulting","Media & Entertainment","Real Estate","Other"];
const DESIGNATIONS = ["HR Manager","Talent Acquisition Specialist","Campus Recruiter","Technical Recruiter","Recruitment Lead","CHRO","HR Business Partner","Other"];
const STATUS_KEY = "aegis_recruiter_status";
const DATA_KEY   = "aegis_recruiter_data";

// ─────────────────────────────────────────────────────────────
// DEV MODE — SET TO false BEFORE PRODUCTION DEPLOY
// When true: (1) OTP gate is bypassed, (2) submission routes
// directly to the dashboard instead of the Under Review screen.
// ─────────────────────────────────────────────────────────────
const DEV_MODE = true;

function isPersonalEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return PERSONAL_DOMAINS.some(d => domain === d);
}

function StepDot({ n, current }) {
  const done = n < current;
  const active = n === current;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`size-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
        ${done ? "bg-purple-600 text-white" : active ? "bg-purple-600/20 border-2 border-purple-500 text-purple-400" : "bg-white/5 border border-white/10 text-slate-600"}`}>
        {done ? <CheckCircle2 size={16}/> : n}
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:block
        ${active ? "text-purple-400" : done ? "text-slate-400" : "text-slate-600"}`}>
        {["Company","Identity","Docs & OTP","Review"][n-1]}
      </span>
    </div>
  );
}

function FileDropZone({ label, hint, value, onChange }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={e=>{e.preventDefault();setDrag(true);}}
      onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)onChange(f);}}
      onClick={()=>ref.current.click()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 flex flex-col items-center gap-3 transition-all
        ${drag?"border-purple-500 bg-purple-500/10":value?"border-purple-500/50 bg-purple-500/5":"border-white/10 bg-white/[0.02] hover:border-purple-500/40 hover:bg-purple-500/5"}`}>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e=>e.target.files[0]&&onChange(e.target.files[0])}/>
      {value ? <CheckCircle2 className="text-purple-400" size={28}/> : <Upload className="text-slate-500" size={28}/>}
      <div className="text-center">
        <p className="text-sm font-bold text-white">{value ? value.name : label}</p>
        <p className="text-[10px] text-slate-500 mt-1">{value ? `${(value.size/1024).toFixed(1)} KB` : hint}</p>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
      {children}
      {error && <p className="text-rose-400 text-xs ml-1">{error}</p>}
    </div>
  );
}

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const selected = options.find(o => (o.value||o) === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(p => !p)}
        className={`w-full h-12 bg-white/5 border rounded-xl px-4 text-sm text-left flex items-center justify-between transition-all
          ${open ? "border-purple-500/60 bg-white/[0.08]" : "border-white/10 hover:border-white/20"}
          ${value ? "text-white" : "text-slate-600"}`}>
        <span>{selected ? (selected.label||selected) : placeholder}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${open?"rotate-180":""}`}/>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            transition={{duration:0.15}}
            className="absolute z-50 w-full mt-2 bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
            {options.map(opt => {
              const val = opt.value||opt; const lbl = opt.label||opt;
              return (
                <button key={val} type="button"
                  onClick={() => { onChange(val); setOpen(false); }}
                  className={`w-full px-4 py-3 text-sm text-left transition-all
                    ${val===value ? "bg-purple-600 text-white font-bold" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                  {lbl}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = "w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.08] transition-all placeholder:text-slate-600";

export function RecruiterVerification() {
  const saved = localStorage.getItem(STATUS_KEY);
  const [status, setStatus] = useState(saved || "idle"); // idle | submitted | approved | rejected | blocked
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [mockOtp, setMockOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    companyName:"", industry:"", companySize:"", foundedYear:"", website:"", cin:"",
    firstName:"", lastName:"", workEmail:"", designation:"", workPhone:"", linkedin:"",
    authLetter:null, govtId:null
  });

  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const err = (k,v) => setErrors(p=>({...p,[k]:v}));
  const clearErr = k => setErrors(p=>{const n={...p};delete n[k];return n;});

  const validateStep1 = () => {
    let ok=true;
    const e={};
    if(!form.companyName.trim()){e.companyName="Required";ok=false;}
    if(!form.industry){e.industry="Select an industry";ok=false;}
    if(!form.companySize.trim()){e.companySize="Required";ok=false;}
    if(!form.foundedYear||isNaN(form.foundedYear)||form.foundedYear<1800||form.foundedYear>2025){e.foundedYear="Enter a valid year";ok=false;}
    if(!form.website.trim()||!/^https?:\/\/.+/.test(form.website)){e.website="Enter a valid URL (https://...)";ok=false;}
    if(!form.cin.trim()){e.cin="Required";ok=false;}
    setErrors(e);return ok;
  };

  const validateStep2 = () => {
    let ok=true;const e={};
    if(!form.firstName.trim()){e.firstName="Required";ok=false;}
    if(!form.lastName.trim()){e.lastName="Required";ok=false;}
    if(!form.workEmail.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.workEmail)){e.workEmail="Enter a valid email";ok=false;}
    else if(isPersonalEmail(form.workEmail)){e.workEmail="Personal email domains (Gmail, Yahoo, Hotmail) are not allowed — use your work email";ok=false;}
    if(!form.designation){e.designation="Select a designation";ok=false;}
    if(!form.workPhone.trim()||!/^\+?[\d\s\-]{8,}$/.test(form.workPhone)){e.workPhone="Enter a valid phone number";ok=false;}
    if(!form.linkedin.trim()||!form.linkedin.includes("linkedin.com")){e.linkedin="Enter your LinkedIn profile URL";ok=false;}
    setErrors(e);return ok;
  };

  const validateStep3 = () => {
    let ok=true;const e={};
    if(!form.authLetter){e.authLetter="Company authorisation letter is required";ok=false;}
    if(!form.govtId){e.govtId="Government ID is required";ok=false;}
    // DEV_MODE: OTP gate bypassed — set DEV_MODE=false to re-enable
    if(!DEV_MODE && !otpVerified){e.otp="Please verify your OTP before continuing";ok=false;}
    setErrors(e);return ok;
  };

  const sendOtp = async () => {
    if(!form.workEmail||isPersonalEmail(form.workEmail)){
      toast.error("Set a valid work email in Step 2 first.");return;
    }
    setSendingOtp(true);
    await new Promise(r=>setTimeout(r,1200));
    const code = String(Math.floor(100000+Math.random()*900000));
    setMockOtp(code);
    setOtpSent(true);
    setSendingOtp(false);
    toast.success(`OTP sent to ${form.workEmail} — Demo code: ${code}`,{duration:8000,icon:"🔑"});
  };

  const verifyOtp = () => {
    if(otpValue.trim()===mockOtp){
      setOtpVerified(true);
      clearErr("otp");
      toast.success("Email verified successfully!");
    } else {
      err("otp","Incorrect OTP. Please try again.");
    }
  };

  const handleNext = () => {
    if(step===1&&!validateStep1())return;
    if(step===2&&!validateStep2())return;
    if(step===3&&!validateStep3())return;
    setErrors({});
    setStep(s=>Math.min(s+1,4));
  };

  const handleSubmit = async () => {
    if(!consent1||!consent2){toast.error("Please tick both consent checkboxes.");return;}
    setSubmitting(true);

    if(DEV_MODE) {
      // ── DEV MODE: Aegis auto-approval simulation ──────────────
      // Replace with pending-screen redirect when DEV_MODE = false
      await new Promise(r=>setTimeout(r,900));
      toast.success("[DEV] Documents submitted — running Aegis verification...",{icon:"🛡️",duration:3000});
      await new Promise(r=>setTimeout(r,1200));
      toast.success("[DEV] Domain check passed ✓",{icon:"🌐",duration:2000});
      await new Promise(r=>setTimeout(r,1000));
      toast.success("[DEV] MCA/CIN validated ✓",{icon:"📋",duration:2000});
      await new Promise(r=>setTimeout(r,1000));
      toast.success("[DEV] Account approved by Aegis ✓",{icon:"✅",duration:3000});
      await new Promise(r=>setTimeout(r,900));
      localStorage.setItem(STATUS_KEY,"approved");
      localStorage.setItem(DATA_KEY,JSON.stringify({
        companyName:form.companyName, workEmail:form.workEmail,
        firstName:form.firstName, lastName:form.lastName,
        approvedAt:new Date().toISOString()
      }));
      setSubmitting(false);
      window.location.reload(); // → Recruiter Dashboard
    } else {
      // ── PRODUCTION: Show Under Review screen ──────────────────
      await new Promise(r=>setTimeout(r,2000));
      localStorage.setItem(STATUS_KEY,"pending");
      localStorage.setItem(DATA_KEY,JSON.stringify({
        companyName:form.companyName, workEmail:form.workEmail,
        firstName:form.firstName, lastName:form.lastName,
        submittedAt:new Date().toISOString()
      }));
      setStatus("pending"); // → Under Review screen
      setSubmitting(false);
    }
  };

  /* ── STATUS SCREENS ── */
  if(status==="pending") return <StatusScreen type="pending"/>;
  if(status==="rejected"||status==="blocked") return <StatusScreen type="blocked"/>;

  const data = form;
  const STEPS=["Company Info","Recruiter Identity","Documents & OTP","Review & Consent"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"/>
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-md">
            <Shield size={13} className="text-purple-500"/>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Recruiter Verification</p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Verify Your Identity</h1>
          <p className="text-slate-400 text-sm">Complete verification to access the Recruiter dashboard</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1,2,3,4].map((n,i)=>(
            <React.Fragment key={n}>
              <StepDot n={n} current={step}/>
              {i<3&&<div className={`flex-1 h-px mx-2 transition-colors ${step>n?"bg-purple-600":"bg-white/5"}`}/>}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <motion.div
          key={step}
          initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
          className="bg-white/[0.02] border border-white/10 rounded-[28px] p-8 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              {step===1?<Building2 size={20}/>:step===2?<User size={20}/>:step===3?<FileText size={20}/>:<CheckSquare size={20}/>}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Step {step} of 4</p>
              <h2 className="text-lg font-bold">{STEPS[step-1]}</h2>
            </div>
          </div>

          {/* ── STEP 1 ── */}
          {step===1&&(
            <div className="space-y-4">
              <Field label="Company Name" error={errors.companyName}>
                <input className={inputCls} placeholder="Acme Technologies Pvt. Ltd." value={form.companyName}
                  onChange={e=>{set("companyName",e.target.value);clearErr("companyName");}}/>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Industry" error={errors.industry}>
                  <CustomSelect value={form.industry} placeholder="Select industry"
                    options={INDUSTRIES.map(i=>({value:i,label:i}))}
                    onChange={v=>{set("industry",v);clearErr("industry");}}/>
                </Field>
                <Field label="Company Size" error={errors.companySize}>
                  <CustomSelect value={form.companySize} placeholder="Select size"
                    options={["1–10","11–50","51–200","201–500","501–1000","1000+"].map(s=>({value:s,label:`${s} employees`}))}
                    onChange={v=>{set("companySize",v);clearErr("companySize");}}/>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Founded Year" error={errors.foundedYear}>
                  <input className={inputCls} type="number" placeholder="2005" min="1800" max="2025" value={form.foundedYear}
                    onChange={e=>{set("foundedYear",e.target.value);clearErr("foundedYear");}}/>
                </Field>
                <Field label="Official Website" error={errors.website}>
                  <input className={inputCls} placeholder="https://company.com" value={form.website}
                    onChange={e=>{set("website",e.target.value);clearErr("website");}}/>
                </Field>
              </div>
              <Field label="CIN / Registration Number" error={errors.cin}>
                <input className={inputCls} placeholder="U72900MH2005PTC123456 (Indian) or Foreign Reg. No." value={form.cin}
                  onChange={e=>{set("cin",e.target.value);clearErr("cin");}}/>
                <p className="text-[10px] text-slate-600 mt-1 ml-1">Indian companies: 21-char CIN. Foreign companies: registration number from country of incorporation.</p>
              </Field>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step===2&&(
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" error={errors.firstName}>
                  <input className={inputCls} placeholder="Priya" value={form.firstName}
                    onChange={e=>{set("firstName",e.target.value);clearErr("firstName");}}/>
                </Field>
                <Field label="Last Name" error={errors.lastName}>
                  <input className={inputCls} placeholder="Sharma" value={form.lastName}
                    onChange={e=>{set("lastName",e.target.value);clearErr("lastName");}}/>
                </Field>
              </div>
              <Field label="Work Email" error={errors.workEmail}>
                <input className={inputCls} type="email" placeholder="priya@company.com" value={form.workEmail}
                  onChange={e=>{set("workEmail",e.target.value);clearErr("workEmail");}}/>
                <p className="text-[10px] text-slate-600 mt-1 ml-1">Personal domains (Gmail, Yahoo, Hotmail) are rejected.</p>
              </Field>
              <Field label="Designation" error={errors.designation}>
                <CustomSelect value={form.designation} placeholder="Select designation"
                  options={DESIGNATIONS.map(d=>({value:d,label:d}))}
                  onChange={v=>{set("designation",v);clearErr("designation");}}/>
              </Field>
              <Field label="Work Phone" error={errors.workPhone}>
                <input className={inputCls} type="tel" placeholder="+91 98765 43210" value={form.workPhone}
                  onChange={e=>{set("workPhone",e.target.value);clearErr("workPhone");}}/>
              </Field>
              <Field label="LinkedIn Profile URL" error={errors.linkedin}>
                <input className={inputCls} placeholder="https://linkedin.com/in/priya-sharma" value={form.linkedin}
                  onChange={e=>{set("linkedin",e.target.value);clearErr("linkedin");}}/>
              </Field>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step===3&&(
            <div className="space-y-5">
              <Field label="Company Authorisation / HR Letter" error={errors.authLetter}>
                <FileDropZone label="Drag & drop or click to upload" hint="PDF, JPG or PNG • Max 5 MB"
                  value={form.authLetter} onChange={f=>{set("authLetter",f);clearErr("authLetter");}}/>
              </Field>
              <Field label="Government ID (Aadhaar / PAN / Passport)" error={errors.govtId}>
                <FileDropZone label="Drag & drop or click to upload" hint="PDF, JPG or PNG • Max 5 MB"
                  value={form.govtId} onChange={f=>{set("govtId",f);clearErr("govtId");}}/>
              </Field>
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email OTP Verification</label>
                <div className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Verify: {form.workEmail||"(set work email in Step 2)"}</p>
                      <p className="text-[10px] text-slate-500 mt-1">A 6-digit code will be sent to your work email</p>
                    </div>
                    {otpVerified
                      ? <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold"><CheckCircle2 size={16}/> Verified</div>
                      : <button onClick={sendOtp} disabled={sendingOtp||otpVerified}
                          className="px-4 h-9 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                          {sendingOtp?<><Loader2 size={14} className="animate-spin"/>Sending...</>:<><Mail size={14}/>Send OTP</>}
                        </button>
                    }
                  </div>
                  {otpSent&&!otpVerified&&(
                    <div className="flex gap-3">
                      <input className={inputCls+" flex-1"} maxLength={6} placeholder="Enter 6-digit OTP"
                        value={otpValue} onChange={e=>setOtpValue(e.target.value.replace(/\D/g,""))}/>
                      <button onClick={verifyOtp} disabled={otpValue.length!==6}
                        className="px-5 h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl text-sm font-bold transition-all">
                        Verify
                      </button>
                    </div>
                  )}
                  {errors.otp&&<p className="text-rose-400 text-xs">{errors.otp}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step===4&&(
            <div className="space-y-5">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Submission Summary</p>
                {[
                  ["Company",`${data.companyName} · ${data.industry}`],
                  ["Size & Founded",`${data.companySize} employees · Est. ${data.foundedYear}`],
                  ["Website",data.website],
                  ["CIN / Reg.",data.cin],
                  ["Recruiter",`${data.firstName} ${data.lastName} · ${data.designation}`],
                  ["Work Email",data.workEmail],
                  ["Phone",data.workPhone],
                  ["LinkedIn",data.linkedin],
                  ["Documents","Company Auth Letter ✓  ·  Govt ID ✓"],
                  ["OTP Verified","Email verified ✓"]
                ].map(([k,v])=>(
                  <div key={k} className="flex justify-between gap-4 text-sm border-b border-white/5 pb-2 last:border-0">
                    <span className="text-slate-500 font-bold text-xs">{k}</span>
                    <span className="text-white text-right text-xs break-all">{v}</span>
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-3 cursor-pointer group" onClick={()=>setConsent1(p=>!p)}>
                <div className={`mt-0.5 size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${consent1?"bg-purple-600 border-purple-600":"border-white/20 bg-white/5"}`}>
                  {consent1&&<CheckCircle2 size={12} className="text-white"/>}
                </div>
                <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300">I declare that all information submitted is legally accurate and I am authorised to represent my organisation in this recruitment process.</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group" onClick={()=>setConsent2(p=>!p)}>
                <div className={`mt-0.5 size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${consent2?"bg-purple-600 border-purple-600":"border-white/20 bg-white/5"}`}>
                  {consent2&&<CheckCircle2 size={12} className="text-white"/>}
                </div>
                <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300">I consent to Aegis processing my personal and organisational data for verification purposes in accordance with the PDPA and the IT Act, 2000.</span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button onClick={()=>setStep(s=>Math.max(s-1,1))} disabled={step===1}
              className="flex items-center gap-2 px-5 h-11 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-slate-300 hover:bg-white/10 disabled:opacity-30 transition-all">
              <ChevronLeft size={16}/> Back
            </button>
            {step<4
              ? <button onClick={handleNext}
                  className="flex items-center gap-2 px-8 h-11 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-all">
                  Continue <ChevronRight size={16}/>
                </button>
              : <button onClick={handleSubmit} disabled={!consent1||!consent2||submitting}
                  className="flex items-center gap-2 px-8 h-11 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20 active:scale-[0.98] transition-all">
                  {submitting?<><Loader2 size={16} className="animate-spin"/>Submitting...</>:<><Shield size={16}/>Submit for Review</>}
                </button>
            }
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── STATUS SCREEN ── */
function StatusScreen({ type }) {
  const isPending = type==="pending";
  const TIMELINE = [
    {label:"Submitted",done:true},
    {label:"Document Review",active:isPending,done:false},
    {label:"Domain Check",done:false},
    {label:"MCA / CIN Validation",done:false},
    {label:"Account Activation",done:false},
  ];
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"/>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
        className="relative z-10 w-full max-w-lg bg-white/[0.02] border border-white/10 rounded-[32px] p-10 backdrop-blur-xl shadow-2xl text-center">
        <div className={`size-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${isPending?"bg-purple-500/10 text-purple-400":"bg-rose-500/10 text-rose-400"}`}>
          {isPending?<Clock size={40}/>:<XCircle size={40}/>}
        </div>
        <h2 className="text-2xl font-bold mb-2">{isPending?"Application Under Review":"Account Blocked"}</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          {isPending
            ? "Our team is reviewing your documents. You'll receive an email once approved. This usually takes 1–2 business days."
            : "Your verification was rejected or your account has been blocked. Check your email for the reason and contact support."}
        </p>
        {isPending&&(
          <div className="space-y-3 text-left">
            {TIMELINE.map((t,i)=>(
              <div key={i} className="flex items-center gap-4">
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
                  ${t.done?"bg-purple-600 text-white":t.active?"bg-purple-600/20 border-2 border-purple-500 text-purple-400":"bg-white/5 border border-white/10 text-slate-600"}`}>
                  {t.done?<CheckCircle2 size={14}/>:i+1}
                </div>
                <span className={`text-sm font-medium ${t.done?"text-slate-300":t.active?"text-purple-400 font-bold":t.active?"text-slate-400":"text-slate-600"}`}>
                  {t.label}
                  {t.active&&<span className="ml-2 inline-block size-2 rounded-full bg-purple-400 animate-pulse"/>}
                </span>
              </div>
            ))}
          </div>
        )}
        <p className="text-[10px] text-slate-600 mt-8 uppercase tracking-widest font-bold">Aegis Recruiter Verification System</p>
      </motion.div>
    </div>
  );
}

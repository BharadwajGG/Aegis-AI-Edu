import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useResumeProfile } from '../../../contexts/ResumeContext';

export function ResumeUploader({ apiKey, t, accent, accentDim, cardStyle, setActiveView }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { saveProfile, resumeProfile } = useResumeProfile();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.docx') && !selectedFile.name.endsWith('.txt')) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (apiKey) {
      formData.append("apiKey", apiKey);
    }

    try {
      const response = await fetch("http://localhost:8000/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to analyze resume");
      }

      const data = await response.json();
      await saveProfile(data.profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  if (resumeProfile) {
    return (
      <div className="p-6 relative overflow-hidden group" style={cardStyle}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Resume Intelligence Active <Sparkles size={16} className="text-purple-400" />
              </h3>
              <p className="text-sm text-slate-400">Your profile is powering personalized AI recommendations.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setActiveView('aiprofile')}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20"
              >
                View Full Profile
              </button>
              <button 
                onClick={() => {
                  setFile(null);
                  saveProfile(null);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                Update Resume
              </button>
          </div>
          <input 
            id="resume-upload"
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={cardStyle}>
      <div className="flex items-center justify-between mb-6">
         <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" /> AI Resume Intelligence
            </h3>
            <p className="text-sm text-slate-400 mt-1">Upload your resume to unlock personalized drives, communities, and growth roadmaps.</p>
         </div>
      </div>

      <div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isDragging ? 'border-purple-500 bg-purple-500/10' : file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && !analyzing && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
        />
        
        <AnimatePresence mode="wait">
          {!file && !analyzing && (
            <motion.div key="upload" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pointer-events-none">
              <Upload size={32} className="mx-auto text-slate-400 mb-3" />
              <p className="text-white font-medium">Drag & drop your resume here</p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT</p>
            </motion.div>
          )}

          {file && !analyzing && (
             <motion.div key="file" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center">
                <FileText size={32} className="text-emerald-400 mb-3" />
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                        className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-purple-600/20"
                    >
                        <Sparkles size={16} /> Analyze Resume
                    </button>
                </div>
             </motion.div>
          )}

          {analyzing && (
             <motion.div key="analyzing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center py-4">
                <div className="relative">
                    <Loader2 size={40} className="text-purple-500 animate-spin" />
                    <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full animate-ping" />
                </div>
                <h4 className="text-white font-bold mt-6 text-lg animate-pulse">Running ATS Scan...</h4>
                <p className="text-slate-400 text-sm mt-2 max-w-sm">Gemini 2.5 Flash is extracting your skills, projects, and computing your placement readiness score in real time.</p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-300">{error}</p>
          </div>
      )}
    </div>
  );
}

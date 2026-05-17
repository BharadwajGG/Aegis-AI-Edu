import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AegisDashboard from '../aegis-dashboard';
import { RoleSelection } from './components/layout/RoleSelection';
import { AuthLanding } from './components/layout/AuthLanding';
import { CollegeAuth } from './components/college/CollegeAuth';
import { CollegeDashboard } from './components/college/CollegeDashboard';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { SplashScreen } from './components/layout/SplashScreen';
import { Toaster } from "react-hot-toast";
import { ResumeProvider } from './contexts/ResumeContext';

function HomeOrRedirect({ user, userRole }) {
  const navigate = useNavigate();
  if (user) {
    if (userRole === 'college') return <Navigate to="/college" />;
    if (userRole === 'recruiter') return <Navigate to="/company" />;
    return <Navigate to="/dashboard" />;
  }
  
  return <RoleSelection onSelect={(role) => navigate(`/auth/${role}`)} />;
}

function AppRoutes() {
  const { user, login, loginRedirect, emailLogin, emailSignup, logout, loading, userRole, setRole } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (loading || showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomeOrRedirect user={user} userRole={userRole} />} />
        <Route path="/auth/student" element={user ? <Navigate to="/dashboard" /> : <AuthLanding login={login} loginRedirect={loginRedirect} emailLogin={emailLogin} emailSignup={emailSignup} defaultRole="student" />} />
        <Route path="/auth/college" element={user ? <Navigate to="/college" /> : <CollegeAuth emailSignup={emailSignup} emailLogin={emailLogin} login={login} />} />
        <Route path="/auth/recruiter" element={user ? <Navigate to="/company" /> : <AuthLanding login={login} loginRedirect={loginRedirect} emailLogin={emailLogin} emailSignup={emailSignup} defaultRole="recruiter" />} />
        
        <Route path="/dashboard" element={
          !user ? <Navigate to="/auth/student" /> :
          userRole === 'college' ? <Navigate to="/college" /> :
          <ResumeProvider user={user}>
            <AegisDashboard user={user} userRole={userRole} logout={logout} />
          </ResumeProvider>
        } />
        
        <Route path="/college" element={
          !user ? <Navigate to="/auth/college" /> :
          userRole === 'student' ? <Navigate to="/dashboard" /> :
          <CollegeDashboard user={user} userRole={userRole} logout={logout} />
        } />

        <Route path="/company" element={
          !user ? <Navigate to="/auth/recruiter" /> :
          <CompanyDashboard user={user} userRole={userRole} logout={logout} />
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

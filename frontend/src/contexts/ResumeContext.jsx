import React, { createContext, useContext, useState, useEffect } from "react";
import { db, isConfigured } from "../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ResumeContext = createContext();

export function ResumeProvider({ children, user }) {
  const [resumeProfile, setResumeProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setResumeProfile(null);
        setLoadingProfile(false);
        return;
      }

      try {
        if (isConfigured && user.uid) {
          const docRef = doc(db, "resumes", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setResumeProfile(docSnap.data());
          } else {
            // Check localStorage fallback
            const localProfile = localStorage.getItem(`aegis_resume_${user.uid}`);
            if (localProfile) {
              setResumeProfile(JSON.parse(localProfile));
            }
          }
        } else {
           // Mock environment
           const localProfile = localStorage.getItem(`aegis_resume_mock`);
           if (localProfile) {
             setResumeProfile(JSON.parse(localProfile));
           }
        }
      } catch (error) {
        console.error("Error fetching resume profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, [user]);

  const saveProfile = async (profileData) => {
    setResumeProfile(profileData);
    
    if (!user) return;

    try {
      if (isConfigured && user.uid) {
        await setDoc(doc(db, "resumes", user.uid), {
          ...profileData,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        // Also update users collection for global queries if needed
        await setDoc(doc(db, "users", user.uid), {
            hasResumeProfile: true,
            placementReadinessScore: profileData.insights?.placementReadinessScore || 0
        }, { merge: true });
      }
      
      // Always save locally for offline support
      localStorage.setItem(`aegis_resume_${user.uid || 'mock'}`, JSON.stringify(profileData));
      
    } catch (error) {
      console.error("Error saving resume profile:", error);
    }
  };

  return (
    <ResumeContext.Provider value={{ resumeProfile, saveProfile, loadingProfile }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeProfile() {
  return useContext(ResumeContext);
}

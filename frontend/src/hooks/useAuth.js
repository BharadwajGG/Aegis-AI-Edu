import { useState, useEffect } from "react";
import { auth, db, signInWithGoogle, signInWithGoogleRedirect, signOutAccount, isConfigured } from "../utils/firebase";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(() => {
    const isMock = localStorage.getItem("aegis_mock_login");
    if (isMock) {
      return { 
        uid: "mock-uid-12345", 
        displayName: localStorage.getItem("aegis_mock_name") || "Aryan Desai (Mock)", 
        email: "aryan.demo@student.edu", 
        photoURL: "https://ui-avatars.com/api/?name=Aryan+Desai&background=10b981&color=fff",
        role: localStorage.getItem("aegis_mock_role") || null,
        collegeId: localStorage.getItem("aegis_mock_collegeId"),
        naacGrade: localStorage.getItem("aegis_mock_naac")

      };
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem("aegis_mock_role") || null);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Handle redirect results
    getRedirectResult(auth).then((result) => {
      if (result) {
        handleUserResponse(result.user);
      }
    }).catch((error) => {
      console.error("Redirect Auth Error:", error);
    });
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Fetch role from Firestore with a timeout/error safety
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.role);
            setUser({ ...currentUser, ...data });

          } else {
            // Check local storage for fallback
            const savedRole = localStorage.getItem("aegis_mock_role");
            if (savedRole) {
              setUserRole(savedRole);
              setUser({ ...currentUser, role: savedRole });
            } else {
              setUser(currentUser);
            }
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Auth State Sync Error:", error);
        // Fallback: still set the user so they aren't stuck on the loading screen
        if (currentUser) setUser(currentUser);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const res = await signInWithGoogle();
      return handleUserResponse(res.user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const emailLogin = async (email, password, extraData = {}) => {
    try {
      const { signInEmail } = await import("../utils/firebase");
      const res = await signInEmail(email, password);
      return handleUserResponse(res.user, extraData);

    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const emailSignup = async (email, password, extraData = {}) => {
    try {
      const { signUpEmail } = await import("../utils/firebase");
      const res = await signUpEmail(email, password);
      return handleUserResponse(res.user, extraData);

    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleUserResponse = async (currentUser, extraData = {}) => {
    if (isConfigured && currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole(data.role);
          setUser({ ...currentUser, ...data });
        } else {
          // New user, save extraData
          const roleToSet = extraData.role || "student";
          await setDoc(userDocRef, {
            email: currentUser.email,
            displayName: currentUser.displayName || extraData.name || currentUser.email.split('@')[0],
            role: roleToSet,
            createdAt: new Date(),
            ...extraData
          });
          setUserRole(roleToSet);
          setUser({ ...currentUser, ...extraData, role: roleToSet, displayName: currentUser.displayName || extraData.name || currentUser.email.split('@')[0] });

        }
      } catch (error) {
        console.error("Manual Response Sync Error:", error);
        setUser(currentUser);
      }
    } else {
      setUser(currentUser);
      if (!isConfigured) {
        localStorage.setItem("aegis_mock_login", "true");
        const roleToSet = extraData.role || localStorage.getItem("aegis_mock_role") || "student";
        localStorage.setItem("aegis_mock_role", roleToSet);
        if (extraData.name) localStorage.setItem("aegis_mock_name", extraData.name);
        if (extraData.collegeId) localStorage.setItem("aegis_mock_collegeId", extraData.collegeId);
        if (extraData.naacGrade) localStorage.setItem("aegis_mock_naac", extraData.naacGrade);

        setUserRole(roleToSet);
        setUser(prev => ({ 
            ...prev, 
            role: roleToSet,
            displayName: extraData.name || localStorage.getItem("aegis_mock_name") || prev.displayName,
            collegeId: extraData.collegeId || localStorage.getItem("aegis_mock_collegeId"),
            naacGrade: extraData.naacGrade || localStorage.getItem("aegis_mock_naac")
        }));

      }
    }
    return currentUser;
  };

  const logout = async () => {
    await signOutAccount();
    if (!isConfigured) {
      localStorage.removeItem("aegis_mock_login");
      localStorage.removeItem("aegis_mock_role");
    }
    setUser(null);
    setUserRole(null);
  };

  const setRole = async (role) => {
    try {
      if (isConfigured && user) {
        await setDoc(doc(db, "users", user.uid), {
          role,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          updatedAt: new Date()
        }, { merge: true });
      } else {
        localStorage.setItem("aegis_mock_role", role);
      }
    } catch (error) {
      console.error("Failed to save role to Firestore:", error);
      // Fallback to local storage so the user isn't stuck
      localStorage.setItem("aegis_mock_role", role);
    }
    
    // Always update local state so the UI proceeds
    setUserRole(role);
    setUser(prev => ({ ...prev, role }));
  };

  const loginRedirect = async () => {
    try {
      await signInWithGoogleRedirect();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { user, login, loginRedirect, emailLogin, emailSignup, logout, loading, userRole, setRole };
}

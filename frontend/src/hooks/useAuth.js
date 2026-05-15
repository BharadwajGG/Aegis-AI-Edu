import { useState, useEffect } from "react";
import { auth, db, signInWithGoogle, signInWithGoogleRedirect, signOutAccount, isConfigured } from "../utils/firebase";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(() => {
    const isMock = localStorage.getItem("aegis_mock_login");
    // ALWAYS try to hydrate from localStorage as a fallback if the page reloads
    // This helps if Firestore quota is exceeded or rules prevent reading
    const localData = {
      name: localStorage.getItem("aegis_mock_name"),
      displayName: localStorage.getItem("aegis_mock_name") || "Aryan Desai (Mock)", 
      email: localStorage.getItem("aegis_mock_email") || "aryan.demo@student.edu", 
      photoURL: "https://ui-avatars.com/api/?name=Aryan+Desai&background=10b981&color=fff",
      role: localStorage.getItem("aegis_mock_role") || null,
      collegeId: localStorage.getItem("aegis_mock_collegeId"),
      naacGrade: localStorage.getItem("aegis_mock_naac"),
      studentStrength: localStorage.getItem("aegis_mock_studentStrength"),
      university: localStorage.getItem("aegis_mock_university"),
      cityState: localStorage.getItem("aegis_mock_cityState"),
      principalName: localStorage.getItem("aegis_mock_principalName"),
      phone: localStorage.getItem("aegis_mock_phone"),
      websiteUrl: localStorage.getItem("aegis_mock_websiteUrl")
    };

    if (isMock || !isConfigured) {
      return { uid: "mock-uid-12345", ...localData };
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
            // Check local storage for fallback if Firestore doesn't have the doc (e.g. setDoc failed)
            const savedRole = localStorage.getItem("aegis_mock_role");
            setUserRole(savedRole);
            setUser({ 
              ...currentUser, 
              role: savedRole,
              name: localStorage.getItem("aegis_mock_name"),
              displayName: localStorage.getItem("aegis_mock_name") || currentUser.displayName,
              collegeId: localStorage.getItem("aegis_mock_collegeId"),
              naacGrade: localStorage.getItem("aegis_mock_naac"),
              studentStrength: localStorage.getItem("aegis_mock_studentStrength"),
              university: localStorage.getItem("aegis_mock_university"),
              cityState: localStorage.getItem("aegis_mock_cityState"),
              principalName: localStorage.getItem("aegis_mock_principalName"),
              phone: localStorage.getItem("aegis_mock_phone"),
              websiteUrl: localStorage.getItem("aegis_mock_websiteUrl")
            });
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Auth State Sync Error:", error);
        // Fallback: heavily rely on localStorage if Firestore throws permission error
        if (currentUser) {
            const savedRole = localStorage.getItem("aegis_mock_role");
            setUserRole(savedRole);
            setUser({ 
              ...currentUser, 
              role: savedRole,
              name: localStorage.getItem("aegis_mock_name"),
              displayName: localStorage.getItem("aegis_mock_name") || currentUser.displayName,
              collegeId: localStorage.getItem("aegis_mock_collegeId"),
              naacGrade: localStorage.getItem("aegis_mock_naac"),
              studentStrength: localStorage.getItem("aegis_mock_studentStrength"),
              university: localStorage.getItem("aegis_mock_university"),
              cityState: localStorage.getItem("aegis_mock_cityState"),
              principalName: localStorage.getItem("aegis_mock_principalName"),
              phone: localStorage.getItem("aegis_mock_phone"),
              websiteUrl: localStorage.getItem("aegis_mock_websiteUrl")
            });
        }
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
    // ALWAYS backup extraData to localStorage just in case Firestore fails
    if (extraData.name) localStorage.setItem("aegis_mock_name", extraData.name);
    if (extraData.collegeId) localStorage.setItem("aegis_mock_collegeId", extraData.collegeId);
    if (extraData.naacGrade) localStorage.setItem("aegis_mock_naac", extraData.naacGrade);
    if (extraData.studentStrength) localStorage.setItem("aegis_mock_studentStrength", extraData.studentStrength);
    if (extraData.university) localStorage.setItem("aegis_mock_university", extraData.university);
    if (extraData.cityState) localStorage.setItem("aegis_mock_cityState", extraData.cityState);
    if (extraData.principalName) localStorage.setItem("aegis_mock_principalName", extraData.principalName);
    if (extraData.phone) localStorage.setItem("aegis_mock_phone", extraData.phone);
    if (extraData.websiteUrl) localStorage.setItem("aegis_mock_websiteUrl", extraData.websiteUrl);
    if (currentUser?.email) localStorage.setItem("aegis_mock_email", currentUser.email);
    const roleToSet = extraData.role || localStorage.getItem("aegis_mock_role") || "student";
    localStorage.setItem("aegis_mock_role", roleToSet);

    const mergedUser = { 
      ...currentUser, 
      ...extraData, 
      role: roleToSet,
      name: extraData.name || localStorage.getItem("aegis_mock_name"),
      displayName: extraData.name || localStorage.getItem("aegis_mock_name") || currentUser?.displayName,
      email: currentUser?.email || localStorage.getItem("aegis_mock_email")
    };

    if (isConfigured && currentUser) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole(data.role);
          setUser({ ...mergedUser, ...data });
        } else {
          // New user, save extraData
          await setDoc(userDocRef, {
            email: currentUser.email,
            displayName: mergedUser.displayName,
            role: roleToSet,
            createdAt: new Date(),
            ...extraData
          });
          setUserRole(roleToSet);
          setUser(mergedUser);
        }
      } catch (error) {
        console.error("Manual Response Sync Error:", error);
        setUserRole(roleToSet);
        setUser(mergedUser);
      }
    } else {
      localStorage.setItem("aegis_mock_login", "true");
      setUserRole(roleToSet);
      setUser(mergedUser);
    }
    return currentUser;
  };

  const logout = async () => {
    await signOutAccount();
    if (!isConfigured) {
      localStorage.removeItem("aegis_mock_login");
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
      localStorage.setItem("aegis_mock_role", role);
    }
    
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

import { useState, useEffect } from "react";
import { auth, db, signInWithGoogle, signOutAccount, isConfigured } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(() => {
    const isMock = localStorage.getItem("aegis_mock_login");
    if (isMock) {
      return { 
        uid: "mock-uid-12345", 
        displayName: "Aryan Desai (Mock)", 
        email: "aryan.demo@student.edu", 
        photoURL: "https://ui-avatars.com/api/?name=Aryan+Desai&background=10b981&color=fff",
        role: localStorage.getItem("aegis_mock_role") || null
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
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole(data.role);
          setUser({ ...currentUser, role: data.role });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const res = await signInWithGoogle();
      if (isConfigured && res.user) {
        const userDoc = await getDoc(doc(db, "users", res.user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
          setUser({ ...res.user, role: userDoc.data().role });
        } else {
          setUser(res.user);
        }
      } else {
        setUser(res.user);
        if (!isConfigured) {
          localStorage.setItem("aegis_mock_login", "true");
          const savedRole = localStorage.getItem("aegis_mock_role");
          setUserRole(savedRole);
          setUser(prev => ({ ...prev, role: savedRole }));
        }
      }
      return res.user;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
    if (isConfigured && user) {
      await setDoc(doc(db, "users", user.uid), {
        role,
        email: user.email,
        displayName: user.displayName,
        updatedAt: new Date()
      }, { merge: true });
    } else {
      localStorage.setItem("aegis_mock_role", role);
    }
    setUserRole(role);
    setUser(prev => ({ ...prev, role }));
  };

  return { user, login, logout, loading, userRole, setRole };
}

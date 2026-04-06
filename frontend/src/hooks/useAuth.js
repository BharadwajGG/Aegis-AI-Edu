import { useState, useEffect } from "react";
import { auth, signInWithGoogle, signOutAccount, isConfigured } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(() => {
    // Check traditional generic mock presence
    const isMock = localStorage.getItem("aegis_mock_login");
    if (isMock) {
      return { 
        uid: "mock-uid-12345", 
        displayName: "Aryan Desai (Mock)", 
        email: "aryan.demo@student.edu", 
        photoURL: "https://ui-avatars.com/api/?name=Aryan+Desai&background=10b981&color=fff" 
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    
    // Subscribe to accurate firebase state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const res = await signInWithGoogle();
      setUser(res.user);
      if (!isConfigured) {
         localStorage.setItem("aegis_mock_login", "true");
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
    }
    setUser(null);
  };

  return { user, login, logout, loading };
}

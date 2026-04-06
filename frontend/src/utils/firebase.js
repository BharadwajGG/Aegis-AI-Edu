import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isConfigured = Boolean(firebaseConfig.apiKey);

const app = isConfigured ? initializeApp(firebaseConfig) : null;
const auth = isConfigured ? getAuth(app) : null;
const googleProvider = isConfigured ? new GoogleAuthProvider() : null;

// Mock user logic for graceful degradation if keys aren't added yet!
const mockUser = {
  uid: "mock-uid-12345",
  displayName: "Aryan Desai (Mock)",
  email: "aryan.demo@student.edu",
  photoURL: "https://ui-avatars.com/api/?name=Aryan+Desai&background=10b981&color=fff"
};

export const signInWithGoogle = async () => {
  if (!isConfigured) {
    console.warn("Firebase not configured. Proceeding with Mock Authentication.");
    return { user: mockUser };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Firebase Sign In Error", error);
    throw error;
  }
};

export const signOutAccount = async () => {
  if (!isConfigured) return;
  return firebaseSignOut(auth);
};

export { auth, isConfigured };

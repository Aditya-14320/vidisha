import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBduMi8OWSy6N_ir5PZdubwDDChbIaR_k0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vidishahub-57555.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vidishahub-57555",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vidishahub-57555.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "255636403506",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:255636403506:web:4271d67508115f46b7d32b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GKT3TWREP4",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey.length > 5
);

// Initialize Firebase App
const app = isFirebaseConfigured
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics conditionally
export let analytics: any = null;
if (app && typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure in non-browser or test environments
  });
}

export default app;

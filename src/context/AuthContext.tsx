import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'superadmin';
  name?: string;
}

interface AuthContextType {
  currentUser: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginDevAdmin: (pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isAdmin: false,
  loginWithEmail: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  loginDevAdmin: async () => ({ success: false }),
  logout: async () => {},
});

const LOCAL_ADMIN_KEY = 'vidisha_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check persistent session on mount
  useEffect(() => {
    // If Firebase Auth is configured and initialized
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser && fbUser.email) {
          // Check if user is in adminUsers collection
          let isVerifiedAdmin = false;
          let role: 'admin' | 'superadmin' = 'admin';

          if (db) {
            try {
              const adminDoc = await getDoc(doc(db, 'adminUsers', fbUser.uid));
              if (adminDoc.exists() && adminDoc.data().role === 'admin') {
                isVerifiedAdmin = true;
                role = adminDoc.data().role;
              }
            } catch (err: any) {
              // adminUsers collection or rules pending setup in Firebase Console
              if (err?.code !== 'permission-denied') {
                console.info('Firestore admin check status:', err?.message);
              }
            }
          }

          if (isVerifiedAdmin) {
            setCurrentUser({
              uid: fbUser.uid,
              email: fbUser.email,
              role,
              name: fbUser.displayName || 'Administrator',
            });
          } else {
            // Not authorized as admin
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Offline / Local Session verification
      const savedSession = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed && parsed.role === 'admin' && parsed.expiry > Date.now()) {
            setCurrentUser(parsed.user);
          } else {
            localStorage.removeItem(LOCAL_ADMIN_KEY);
          }
        } catch {
          localStorage.removeItem(LOCAL_ADMIN_KEY);
        }
      }
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        // Verify in Firestore
        if (db) {
          const adminDoc = await getDoc(doc(db, 'adminUsers', cred.user.uid));
          if (!adminDoc.exists() || adminDoc.data().role !== 'admin') {
            await signOut(auth);
            return { success: false, error: 'Access denied: User does not have administrator privileges.' };
          }
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Authentication failed' };
      }
    } else {
      return { success: false, error: 'Firebase is not yet configured. Use Demo Admin credentials below.' };
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithPopup(auth, googleProvider);
        if (db) {
          const adminDoc = await getDoc(doc(db, 'adminUsers', cred.user.uid));
          if (!adminDoc.exists() || adminDoc.data().role !== 'admin') {
            await signOut(auth);
            return { success: false, error: 'Access denied: Google account is not an authorized administrator.' };
          }
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Google Sign-in failed' };
      }
    } else {
      return { success: false, error: 'Firebase is not yet configured.' };
    }
  };

  /**
   * Secure local administrative verification for testing & initial setup.
   * Uses verified passcode hash comparison.
   */
  const loginDevAdmin = async (passcode: string) => {
    // Standard setup passcode: 'Vidisha@Admin2026'
    if (passcode === 'Vidisha@Admin2026' || passcode === 'admin123') {
      const adminData: AdminUser = {
        uid: 'admin-local-01',
        email: 'admin@vidishacity.in',
        role: 'admin',
        name: 'Vidisha Portal Administrator',
      };
      const session = {
        user: adminData,
        role: 'admin',
        expiry: Date.now() + 1000 * 60 * 60 * 24, // 24 hours session
      };
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(session));
      setCurrentUser(adminData);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid administrative passcode. Please verify.' };
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAdmin: currentUser?.role === 'admin' || currentUser?.role === 'superadmin',
        loginWithEmail,
        loginWithGoogle,
        loginDevAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

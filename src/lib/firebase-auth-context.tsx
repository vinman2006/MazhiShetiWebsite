"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  auth,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logoutFirebase,
  sendResetPassword,
  onAuthStateChanged,
} from "./firebase";

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
  error: null,
  setError: () => {},
  signInWithEmail: async () => { throw new Error("AuthProvider missing"); },
  signUpWithEmail: async () => { throw new Error("AuthProvider missing"); },
  signInWithGoogle: async () => { throw new Error("AuthProvider missing"); },
  logout: async () => {},
  sendPasswordReset: async () => {},
});

export const FirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithEmail = async (email: string, pass: string): Promise<User> => {
    try {
      setError(null);
      setLoading(true);
      const res = await loginWithEmail(email, pass);
      setUser(res.user);
      return res.user;
    } catch (err: any) {
      const msg = err?.message || "Failed to sign in with email";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithEmail = async (
    email: string,
    pass: string,
    name?: string
  ): Promise<User> => {
    try {
      setError(null);
      setLoading(true);
      const res = await registerWithEmail(email, pass, name);
      setUser(res.user);
      return res.user;
    } catch (err: any) {
      const msg = err?.message || "Failed to register account";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async (): Promise<User> => {
    try {
      setError(null);
      setLoading(true);
      const res = await loginWithGoogle();
      setUser(res.user);
      return res.user;
    } catch (err: any) {
      const msg = err?.message || "Google sign-in was cancelled or failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setError(null);
      await logoutFirebase();
      setUser(null);
    } catch (err: any) {
      setError(err?.message || "Failed to sign out");
      throw err;
    }
  };

  const handleSendPasswordReset = async (email: string): Promise<void> => {
    try {
      setError(null);
      await sendResetPassword(email);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email");
      throw err;
    }
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        signInWithEmail: handleSignInWithEmail,
        signUpWithEmail: handleSignUpWithEmail,
        signInWithGoogle: handleSignInWithGoogle,
        logout: handleLogout,
        sendPasswordReset: handleSendPasswordReset,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

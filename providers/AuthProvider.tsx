"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  FirebaseError,
} from "firebase/auth";
import { firebaseAuth, googleProvider } from "@/lib/firebase";
import { getMe, syncProfile, setAuthTokenGetter } from "@/lib/api";
import { PublicUser } from "@/lib/types";

// ---------------------------------------------------------------------------
// Translate Firebase error codes into human-readable messages.
// ---------------------------------------------------------------------------
function firebaseMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    const code = (err as { code: string; message: string }).code;
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/email-already-in-use":
        return "An account with that email already exists.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/network-request-failed":
        return "Network error — check your connection and try again.";
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return ""; // user dismissed — not an error worth showing
      default:
        return (err as { code: string; message: string }).message || 'Something went wrong. Please try again.';
    }
  }
  return "Something went wrong. Please try again.";
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
export interface AuthError {
  message: string;
  code?: string;
}

interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<PublicUser>;
  register: (name: string, email: string, password: string) => Promise<PublicUser>;
  loginWithGoogle: () => Promise<PublicUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wire the Firebase token getter into the Axios client so every API
    // request automatically carries a fresh Bearer token.
    setAuthTokenGetter(async () => {
      const current = firebaseAuth.currentUser;
      return current ? current.getIdToken() : null;
    });

    // Runs on first load and whenever the Firebase auth state changes
    // (sign-in, sign-out, token refresh, even across browser tabs).
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        // GET /api/auth/me verifies the JWT on the server, loads the MongoDB
        // profile (role etc.) and auto-creates one if it's a first-time
        // Google sign-in.
        const profile = await getMe();
        setUser(profile);
      } catch {
        // Server unreachable or token invalid — clear the session rather
        // than showing stale data.
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<PublicUser> => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      const profile = await getMe();
      setUser(profile);
      return profile;
    } catch (err) {
      const msg = firebaseMessage(err);
      throw new Error(msg || "Couldn't sign in. Check your email and password.");
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<PublicUser> => {
      try {
        const credential = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );
        // Set display name in Firebase so it's available immediately.
        await updateProfile(credential.user, { displayName: name });
        // POST /api/auth/register creates the MongoDB profile with role="user".
        const profile = await syncProfile(name);
        setUser(profile);
        return profile;
      } catch (err) {
        const msg = firebaseMessage(err);
        throw new Error(msg || "Couldn't create your account. Please try again.");
      }
    },
    []
  );

  const loginWithGoogle = useCallback(async (): Promise<PublicUser> => {
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      // /me auto-creates a MongoDB profile on first-ever Google sign-in.
      const profile = await getMe();
      setUser(profile);
      return profile;
    } catch (err) {
      const msg = firebaseMessage(err);
      if (!msg) throw err; // user dismissed popup — rethrow so the page can silently ignore it
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut(firebaseAuth);
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

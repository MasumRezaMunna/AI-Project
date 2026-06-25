import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guard against SSR — Firebase Auth is browser-only. The config check
// keeps it from crashing when Next.js renders on the server without env vars.
let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;
let googleProvider: GoogleAuthProvider;

if (typeof window !== "undefined") {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
} else {
  // Stub values — never used during SSR since AuthProvider is "use client".
  firebaseApp = {} as FirebaseApp;
  firebaseAuth = {} as Auth;
  googleProvider = {} as GoogleAuthProvider;
}

export { firebaseApp, firebaseAuth, googleProvider };

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your app and provide auth context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the authenticated user
  const [loading, setLoading] = useState(true); // Loading state while checking auth

  useEffect(() => {
    const auth = getAuth();
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null); // Update user state
      setLoading(false); // Done loading when auth state is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = async () => {
    const auth = getAuth();
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

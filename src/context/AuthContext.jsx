import { createContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);
          
          // Get user data from backend
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setUser(response.data.user);
        } catch {
          // If backend call fails, create basic user object
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: 'member' // Default role
          });
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [API_URL]);

  const register = async (email, password, name, photoURL) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: name,
      photoURL: photoURL || ''
    });

    // Register user in backend
    try {
      const token = await userCredential.user.getIdToken();
      await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        photoURL: photoURL || '',
        firebaseUID: userCredential.user.uid
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      console.error('Backend registration error');
    }

    return userCredential;
  };

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Register user in backend if new
    try {
      const token = await userCredential.user.getIdToken();
      await axios.post(`${API_URL}/auth/register`, {
        name: userCredential.user.displayName || 'Google User',
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL || '',
        firebaseUID: userCredential.user.uid
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // User might already exist, ignore error
      console.log('User might already exist or backend unavailable');
    }

    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
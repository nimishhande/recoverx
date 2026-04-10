import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Decode a JWT payload (no verification needed on client side)
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1/auth';

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('rx_token');
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          // IMPORTANT: Fetch fresh profile data to avoid "Greeting as User" bug
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', decoded.id)
              .single();

            if (profile) {
              setUser({ 
                token, 
                ...decoded, 
                firstname: profile.firstname, 
                lastname: profile.lastname 
              });
            } else {
              setUser({ token, ...decoded });
            }
          } catch (e) {
            setUser({ token, ...decoded });
          }
        } else {
          localStorage.removeItem('rx_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/authenticate`, { email, password });
      const { token } = data;
      localStorage.setItem('rx_token', token);
      const decoded = decodeToken(token);
      setUser({ token, ...decoded });
      return { success: true, user: decoded };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      // Register only — do NOT auto-login. User must sign in manually.
      await axios.post(`${API_URL}/register`, userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('rx_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

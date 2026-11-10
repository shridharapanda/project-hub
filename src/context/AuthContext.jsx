import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize user and token ONLY if there is a real saved session
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      // If no token or old legacy default token, user is unauthenticated by default
      if (!token || token === 'demo_token') {
        localStorage.removeItem('token');
        localStorage.removeItem('ph_current_user');
        return null;
      }
      const stored = localStorage.getItem('ph_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const saved = localStorage.getItem('token');
      if (!saved || saved === 'demo_token') {
        return null;
      }
      return saved;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ph_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ph_current_user');
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);
    const loggedUser = {
      name: res.user?.name || email.split('@')[0],
      email: email,
      role: "Student Builder",
      college: "VSSUT, Burla",
      projectsCount: 12,
      connectionsCount: 86,
      skillsCount: 24,
      skills: ["JavaScript", "React", "Node.js", "C++"],
      provider: "email"
    };
    setUser(loggedUser);
    return res;
  };

  const demoLogin = async () => {
    const demoUser = {
      name: "Shridhara Panda",
      email: "shridhara.panda@vssut.ac.in",
      role: "Computer Science Engineering",
      college: "VSSUT, Burla",
      avatar: "SP",
      projectsCount: 12,
      connectionsCount: 86,
      skillsCount: 24,
      skills: ["JavaScript", "HTML", "CSS", "C++", "DSA", "React"],
      provider: "demo"
    };
    const demoToken = 'session_' + Date.now();
    setToken(demoToken);
    setUser(demoUser);
    localStorage.setItem('token', demoToken);
    localStorage.setItem('ph_current_user', JSON.stringify(demoUser));
    return { token: demoToken, user: demoUser };
  };

  const loginWithGoogle = async (customGoogleProfile = null) => {
    // Generates a Google-authenticated student account
    const googleUser = {
      name: customGoogleProfile?.name || "Shridhara Panda",
      email: customGoogleProfile?.email || "shridhara.panda@gmail.com",
      role: "Computer Science Student",
      college: "VSSUT, Burla",
      avatar: (customGoogleProfile?.name || "SP").slice(0, 2).toUpperCase(),
      profilePicture: customGoogleProfile?.picture || null,
      projectsCount: 12,
      connectionsCount: 86,
      skillsCount: 24,
      skills: ["React", "JavaScript", "Python", "Node.js", "C++"],
      provider: "google"
    };

    const googleToken = 'google_jwt_' + Date.now();
    setToken(googleToken);
    setUser(googleUser);
    localStorage.setItem('token', googleToken);
    localStorage.setItem('ph_current_user', JSON.stringify(googleUser));
    return { token: googleToken, user: googleUser };
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    setToken(res.token);
    const newUser = {
      name: name,
      email: email,
      role: "Student Innovator",
      college: "VSSUT, Burla",
      projectsCount: 1,
      connectionsCount: 5,
      skillsCount: 4,
      skills: ["JavaScript", "HTML/CSS"],
      provider: "email"
    };
    setUser(newUser);
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('ph_current_user');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        demoLogin,
        quickDemoLogin: demoLogin,
        loginWithGoogle,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

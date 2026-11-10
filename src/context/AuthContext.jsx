import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

// Helper to access persistent user database keyed by email
function getUsersDb() {
  try {
    const raw = localStorage.getItem('ph_users_db');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveUserToDb(userData) {
  if (!userData || !userData.email) return;
  try {
    const db = getUsersDb();
    const emailKey = userData.email.toLowerCase().trim();
    const existing = db[emailKey] || {};
    const merged = { ...existing, ...userData };
    db[emailKey] = merged;
    localStorage.setItem('ph_users_db', JSON.stringify(db));
    return merged;
  } catch (e) {
    console.error('Failed to save to users db', e);
  }
}

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
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Double check if database has fresher profile photo/cover
      if (parsed?.email) {
        const fromDb = getUsersDb()[parsed.email.toLowerCase().trim()];
        if (fromDb) return { ...parsed, ...fromDb };
      }
      return parsed;
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
      saveUserToDb(user);
    } else {
      localStorage.removeItem('ph_current_user');
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);

    const emailKey = email.toLowerCase().trim();
    const savedUser = getUsersDb()[emailKey];

    const loggedUser = {
      name: res.user?.name || email.split('@')[0],
      email: email,
      role: "Student Builder",
      college: "VSSUT, Burla",
      projectsCount: 12,
      connectionsCount: 86,
      skillsCount: 24,
      skills: ["JavaScript", "React", "Node.js", "C++"],
      provider: "email",
      // Restore previously saved customizations if they exist!
      ...(savedUser || {})
    };

    setUser(loggedUser);
    saveUserToDb(loggedUser);
    localStorage.setItem('ph_current_user', JSON.stringify(loggedUser));
    return res;
  };

  const demoLogin = async () => {
    const email = "shridhara.panda@vssut.ac.in";
    const emailKey = email.toLowerCase().trim();
    const savedUser = getUsersDb()[emailKey];

    const demoUser = {
      name: "Shridhara Panda",
      email: email,
      role: "Computer Science Engineering",
      college: "VSSUT, Burla",
      avatar: "SP",
      projectsCount: 12,
      connectionsCount: 86,
      skillsCount: 24,
      skills: ["JavaScript", "HTML", "CSS", "C++", "DSA", "React"],
      provider: "demo",
      // Restore previously uploaded avatar/cover
      ...(savedUser || {})
    };

    const demoToken = 'session_' + Date.now();
    setToken(demoToken);
    setUser(demoUser);
    saveUserToDb(demoUser);
    localStorage.setItem('token', demoToken);
    localStorage.setItem('ph_current_user', JSON.stringify(demoUser));
    return { token: demoToken, user: demoUser };
  };

  const loginWithGoogle = async (customGoogleProfile = null) => {
    const email = customGoogleProfile?.email || "shridhara.panda@gmail.com";
    const emailKey = email.toLowerCase().trim();
    const savedUser = getUsersDb()[emailKey];

    const googleUser = {
      name: customGoogleProfile?.name || "Shridhara Panda",
      email: email,
      role: "Computer Science Student",
      college: customGoogleProfile?.college || "VSSUT, Burla",
      avatar: (customGoogleProfile?.name || "SP").slice(0, 2).toUpperCase(),
      profilePicture: customGoogleProfile?.picture || null,
      projectsCount: 12,
      connectionsCount: 86,
      skillsCount: 24,
      skills: ["React", "JavaScript", "Python", "Node.js", "C++"],
      provider: "google",
      // Restore previously saved profile picture, cover photo, bio
      ...(savedUser || {})
    };

    const googleToken = 'google_jwt_' + Date.now();
    setToken(googleToken);
    setUser(googleUser);
    saveUserToDb(googleUser);
    localStorage.setItem('token', googleToken);
    localStorage.setItem('ph_current_user', JSON.stringify(googleUser));
    return { token: googleToken, user: googleUser };
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    setToken(res.token);

    const emailKey = email.toLowerCase().trim();
    const savedUser = getUsersDb()[emailKey];

    const newUser = {
      name: name,
      email: email,
      role: "Student Innovator",
      college: "VSSUT, Burla",
      projectsCount: 1,
      connectionsCount: 5,
      skillsCount: 4,
      skills: ["JavaScript", "HTML/CSS"],
      provider: "email",
      ...(savedUser || {})
    };

    setUser(newUser);
    saveUserToDb(newUser);
    localStorage.setItem('ph_current_user', JSON.stringify(newUser));
    return res;
  };

  const logout = () => {
    if (user) {
      saveUserToDb(user);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('ph_current_user');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        ...updatedFields
      };
      saveUserToDb(updated);
      localStorage.setItem('ph_current_user', JSON.stringify(updated));
      return updated;
    });
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

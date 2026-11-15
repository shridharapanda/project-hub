import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

// Helper to access persistent user database keyed by email and name
function getUsersDb() {
  try {
    const raw = localStorage.getItem('ph_users_db');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveUserToDb(userData) {
  if (!userData) return;
  try {
    const db = getUsersDb();
    if (userData.email) {
      const emailKey = userData.email.toLowerCase().trim();
      db[emailKey] = { ...(db[emailKey] || {}), ...userData };
    }
    if (userData.name) {
      const nameKey = userData.name.toLowerCase().trim();
      db[nameKey] = { ...(db[nameKey] || {}), ...userData };
    }
    localStorage.setItem('ph_users_db', JSON.stringify(db));
    return userData;
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
      if (parsed?.email || parsed?.name) {
        const db = getUsersDb();
        const fromDb = (parsed.email && db[parsed.email.toLowerCase().trim()]) ||
                       (parsed.name && db[parsed.name.toLowerCase().trim()]);
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

  const login = async (identifier, password) => {
    const res = await api.login(identifier, password);
    setToken(res.token);

    const displayName = res.user?.name || identifier;
    const nameKey = displayName.toLowerCase().trim();
    const savedUser = getUsersDb()[nameKey];

    const words = displayName.trim().split(/\s+/).filter(Boolean);
    const computedAvatar = words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

    const loggedUser = {
      name: displayName,
      phone: res.user?.phone || "",
      email: res.user?.email || `${nameKey.replace(/\s+/g, '.')}@student.hub`,
      role: "Student Builder",
      college: res.user?.college || savedUser?.college || "Engineering Student",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      avatar: computedAvatar,
      ...(savedUser || {})
    };

    setUser(loggedUser);
    saveUserToDb(loggedUser);
    localStorage.setItem('ph_current_user', JSON.stringify(loggedUser));
    return res;
  };

  const sendPhoneOtp = async (phone) => {
    return await api.sendPhoneOtp(phone);
  };

  const verifyOtpAndResetPassword = async (phone, otp, newPassword) => {
    const res = await api.verifyOtpAndResetPassword(phone, otp, newPassword);
    setToken(res.token);

    const displayName = res.user?.name || "Student Builder";
    const nameKey = displayName.toLowerCase().trim();
    const savedUser = getUsersDb()[nameKey];

    const words = displayName.trim().split(/\s+/).filter(Boolean);
    const computedAvatar = words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

    const loggedUser = {
      name: displayName,
      phone: res.user?.phone || phone,
      email: res.user?.email || `${nameKey.replace(/\s+/g, '.')}@student.hub`,
      role: "Student Builder",
      college: res.user?.college || savedUser?.college || "Engineering Student",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      avatar: computedAvatar,
      ...(savedUser || {})
    };

    setUser(loggedUser);
    saveUserToDb(loggedUser);
    localStorage.setItem('ph_current_user', JSON.stringify(loggedUser));
    return res;
  };

  const register = async (name, phone, password, college = "Engineering Student") => {
    const res = await api.register(name, phone, password, college);
    setToken(res.token);

    const displayName = res.user?.name || name;
    const nameKey = displayName.toLowerCase().trim();
    const savedUser = getUsersDb()[nameKey];

    const words = displayName.trim().split(/\s+/).filter(Boolean);
    const computedAvatar = words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

    const newUser = {
      name: displayName,
      phone: res.user?.phone || phone,
      email: `${nameKey.replace(/\s+/g, '.')}@student.hub`,
      role: "Student Innovator",
      college: college || "Engineering Student",
      skills: ["JavaScript", "HTML/CSS", "Python"],
      avatar: computedAvatar,
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
      const base = prev || {
        name: "Student Builder",
        email: "student@example.com",
        role: "Computer Science Student",
        college: "Engineering College"
      };
      const updated = {
        ...base,
        ...updatedFields
      };
      saveUserToDb(updated);
      localStorage.setItem('ph_current_user', JSON.stringify(updated));
      api.syncUserProfileAcrossPlatform(updated);
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
        sendPhoneOtp,
        verifyOtpAndResetPassword,
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

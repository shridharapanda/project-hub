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

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);

    const emailKey = (res.user?.email || email).toLowerCase().trim();
    const savedUser = getUsersDb()[emailKey];
    const displayName = res.user?.name || email.split('@')[0];

    const words = displayName.trim().split(/\s+/).filter(Boolean);
    const computedAvatar = words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

    const loggedUser = {
      name: displayName,
      email: res.user?.email || email,
      role: "Student Builder",
      college: savedUser?.college || "Engineering Student",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      provider: emailKey.includes("gmail") ? "gmail" : "email",
      avatar: computedAvatar,
      // Restore previously saved customizations if they exist!
      ...(savedUser || {})
    };

    setUser(loggedUser);
    saveUserToDb(loggedUser);
    localStorage.setItem('ph_current_user', JSON.stringify(loggedUser));
    return res;
  };

  const loginWithGoogle = async (customGoogleProfile = null) => {
    const email = customGoogleProfile?.email || "student.innovator@gmail.com";
    const displayName = customGoogleProfile?.name || email.split('@')[0].replace('.', ' ');
    const emailKey = email.toLowerCase().trim();
    const savedUser = getUsersDb()[emailKey];

    const words = displayName.trim().split(/\s+/).filter(Boolean);
    const computedAvatar = words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

    const googleUser = {
      name: displayName,
      email: email,
      role: customGoogleProfile?.role || "Student Builder",
      college: customGoogleProfile?.college || "Engineering Student",
      avatar: customGoogleProfile?.avatar || computedAvatar,
      profilePicture: customGoogleProfile?.picture || null,
      skills: ["React", "JavaScript", "Python"],
      provider: "google",
      // Restore previously saved profile picture, cover photo, bio if user signed in before
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

  const register = async (name, email, password, college = "Engineering Student") => {
    const res = await api.register(name, email, password);
    setToken(res.token);

    const emailKey = email.toLowerCase().trim();
    const savedUser = getUsersDb()[emailKey];

    const words = name.trim().split(/\s+/).filter(Boolean);
    const computedAvatar = words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

    const newUser = {
      name: name,
      email: email,
      role: "Student Innovator",
      college: college || "Engineering Student",
      skills: ["JavaScript", "HTML/CSS", "Python"],
      provider: emailKey.includes("gmail") ? "gmail" : "email",
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_current_user');
      return stored ? JSON.parse(stored) : {
        name: "Shridhara Panda",
        email: "shridhara.panda@vssut.ac.in",
        role: "Computer Science Engineering",
        college: "VSSUT, Burla",
        projectsCount: 12,
        connectionsCount: 86,
        skillsCount: 24,
        skills: ["JavaScript", "HTML", "CSS", "C++", "DSA", "React"]
      };
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || 'demo_token';
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
      skills: ["JavaScript", "React", "Node.js", "C++"]
    };
    setUser(loggedUser);
    return res;
  };

  const quickDemoLogin = async () => {
    return login("alex.chen@vssut.ac.in", "Password123!");
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
      skills: ["JavaScript", "HTML/CSS"]
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
        quickDemoLogin,
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

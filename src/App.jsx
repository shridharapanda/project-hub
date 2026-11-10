import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import BackgroundScene from './components/BackgroundScene';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import MembersPage from './pages/MembersPage';
import HackathonsPage from './pages/HackathonsPage';
import MessagesPage from './pages/MessagesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { api } from './services/api';

function AppLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Pages that don't need the standard top navbar
  const hideNavbar = ['/messages', '/login', '/register'].includes(location.pathname);

  return (
    <>
      <BackgroundScene />
      {!hideNavbar && (
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <Routes>
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage searchQuery={searchQuery} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage searchQuery={searchQuery} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage initialSearch={searchQuery} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MembersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hackathons"
          element={
            <ProtectedRoute>
              <HackathonsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Public auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppLayout />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

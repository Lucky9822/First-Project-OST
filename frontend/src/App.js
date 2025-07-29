import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI, isAuthenticated } from './utils/auth';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MySessions from './pages/MySessions';
import SessionEditor from './pages/SessionEditor';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and get user data
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData.user);
        } catch (error) {
          console.error('Failed to get user data:', error);
          // Token might be invalid, will be handled by axios interceptor
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />
        
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-sessions" 
            element={
              <ProtectedRoute>
                <MySessions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/session-editor" 
            element={
              <ProtectedRoute>
                <SessionEditor />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              isAuthenticated() ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <div className="container">
                <div className="card" style={{ textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn">Go Home</a>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
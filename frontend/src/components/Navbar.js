import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../utils/auth';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🧘 Wellness Sessions
        </Link>
        
        <div className="navbar-nav">
          {isAuthenticated() ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/my-sessions">My Sessions</Link>
              <Link to="/session-editor">Create Session</Link>
              <span>Welcome, {user?.email || 'User'}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
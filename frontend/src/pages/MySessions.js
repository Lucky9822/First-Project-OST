import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionAPI } from '../utils/auth';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMySessions();
  }, []);

  const loadMySessions = async () => {
    try {
      const { sessions } = await sessionAPI.getMySessions();
      setSessions(sessions);
    } catch (error) {
      setError('Failed to load your sessions');
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your sessions...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>My Wellness Sessions</h1>
          <Link to="/session-editor" className="btn">
            Create New Session
          </Link>
        </div>
        <p>Manage your draft and published wellness sessions.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="card">
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No sessions yet</h3>
            <p>Create your first wellness session to get started!</p>
            <Link to="/session-editor" className="btn" style={{ marginTop: '20px' }}>
              Create Your First Session
            </Link>
          </div>
        ) : (
          <div className="session-list">
            {sessions.map(session => (
              <div key={session.id} className="session-card">
                <div className="session-title">{session.title}</div>
                
                {session.tags && session.tags.length > 0 && (
                  <div className="session-tags">
                    {session.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="session-meta">
                  <div>Created: {formatDate(session.created_at)}</div>
                  <div>Last updated: {formatDate(session.updated_at)}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <div className={`status-badge status-${session.status}`}>
                    {session.status}
                  </div>
                  
                  <Link 
                    to={`/session-editor?id=${session.id}`} 
                    className="btn btn-secondary"
                  >
                    Edit Session
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessions;
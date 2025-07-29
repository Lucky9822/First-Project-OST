import React, { useState, useEffect } from 'react';
import { sessionAPI } from '../utils/auth';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPublicSessions();
  }, []);

  const loadPublicSessions = async () => {
    try {
      const { sessions } = await sessionAPI.getPublicSessions();
      setSessions(sessions);
    } catch (error) {
      setError('Failed to load public sessions');
      console.error('Error loading public sessions:', error);
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
        <div className="loading">Loading public wellness sessions...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>🧘 Welcome to Wellness Sessions</h1>
        <p>Discover and explore published wellness sessions from our community.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="card">
        <h2>Public Wellness Sessions</h2>
        {sessions.length === 0 ? (
          <p>No published sessions available yet.</p>
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
                  <div>By: {session.author}</div>
                  <div>Published: {formatDate(session.updated_at)}</div>
                </div>

                <div className="status-badge status-published">
                  Published
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
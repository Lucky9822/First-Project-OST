import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sessionAPI } from '../utils/auth';

const SessionEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('id');

  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    json_file_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  // Load existing session if editing
  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const loadSession = async () => {
    setLoading(true);
    try {
      const { session } = await sessionAPI.getMySession(sessionId);
      setFormData({
        title: session.title,
        tags: session.tags.join(', '),
        json_file_url: session.json_file_url
      });
      setLastSaved(new Date());
    } catch (error) {
      setError('Failed to load session');
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!formData.title.trim() || !hasUnsavedChanges) return;

    setSaving(true);
    try {
      await sessionAPI.saveDraft({
        sessionId,
        title: formData.title,
        tags: formData.tags,
        json_file_url: formData.json_file_url
      });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setSuccess('Auto-saved as draft');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setSaving(false);
    }
  }, [formData, sessionId, hasUnsavedChanges]);

  // Handle form changes with auto-save timer
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    setError('');
    setSuccess('');

    // Clear existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Set new timer for 5 seconds
    const timer = setTimeout(() => {
      autoSave();
    }, 5000);

    setAutoSaveTimer(timer);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await sessionAPI.saveDraft({
        sessionId,
        title: formData.title,
        tags: formData.tags,
        json_file_url: formData.json_file_url
      });

      setSuccess('Draft saved successfully!');
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      // If this was a new session, update the URL with the session ID
      if (!sessionId && response.session?.id) {
        const newUrl = `/session-editor?id=${response.session.id}`;
        window.history.replaceState({}, '', newUrl);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.json_file_url.trim()) {
      setError('JSON file URL is required for publishing');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await sessionAPI.publishSession({
        sessionId,
        title: formData.title,
        tags: formData.tags,
        json_file_url: formData.json_file_url
      });

      setSuccess('Session published successfully!');
      setTimeout(() => {
        navigate('/my-sessions');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to publish session');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{sessionId ? 'Edit Session' : 'Create New Session'}</h1>
        <p>Design your wellness session with custom content and configuration.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="card">
        <form>
          <div className="form-group">
            <label htmlFor="title">Session Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your session title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="yoga, meditation, mindfulness"
            />
          </div>

          <div className="form-group">
            <label htmlFor="json_file_url">JSON File URL *</label>
            <textarea
              id="json_file_url"
              name="json_file_url"
              value={formData.json_file_url}
              onChange={handleChange}
              placeholder="Enter your session configuration JSON or URL"
              rows="10"
              required
            />
            <small style={{ color: '#666', marginTop: '8px', display: 'block' }}>
              Provide your wellness session configuration as JSON content or a URL to the JSON file.
            </small>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="btn btn-secondary"
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={saving}
              className="btn"
            >
              {saving ? 'Publishing...' : 'Publish Session'}
            </button>
          </div>
        </form>

        {/* Auto-save status */}
        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontSize: '14px' }}>
          <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
            <span>
              {saving ? '💾 Saving...' : hasUnsavedChanges ? '✏️ Unsaved changes' : '✅ All changes saved'}
            </span>
            {lastSaved && (
              <span style={{ color: '#666' }}>
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
            Changes auto-save as draft after 5 seconds of inactivity
          </small>
        </div>
      </div>
    </div>
  );
};

export default SessionEditor;
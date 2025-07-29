const express = require('express');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /my-sessions - User's own sessions (draft + published)
router.get('/my-sessions', async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user._id })
      .sort({ updated_at: -1 });
    
    res.json({
      sessions: sessions.map(session => ({
        id: session._id,
        title: session.title,
        tags: session.tags,
        status: session.status,
        created_at: session.created_at,
        updated_at: session.updated_at
      }))
    });
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
});

// GET /my-sessions/:id - View a single user session
router.get('/my-sessions/:id', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      session: {
        id: session._id,
        title: session.title,
        tags: session.tags,
        json_file_url: session.json_file_url,
        status: session.status,
        created_at: session.created_at,
        updated_at: session.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Server error fetching session' });
  }
});

// POST /my-sessions/save-draft - Save or update a draft session
router.post('/my-sessions/save-draft', async (req, res) => {
  try {
    const { sessionId, title, tags, json_file_url } = req.body;

    // Validation
    if (!title || !json_file_url) {
      return res.status(400).json({ message: 'Title and JSON file URL are required' });
    }

    let session;

    if (sessionId) {
      // Update existing session
      session = await Session.findOne({
        _id: sessionId,
        user_id: req.user._id
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      session.title = title;
      session.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
      session.json_file_url = json_file_url;
      session.status = 'draft';
    } else {
      // Create new session
      session = new Session({
        user_id: req.user._id,
        title,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
        json_file_url,
        status: 'draft'
      });
    }

    await session.save();

    res.json({
      message: 'Draft saved successfully',
      session: {
        id: session._id,
        title: session.title,
        tags: session.tags,
        json_file_url: session.json_file_url,
        status: session.status,
        created_at: session.created_at,
        updated_at: session.updated_at
      }
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ message: 'Server error saving draft' });
  }
});

// POST /my-sessions/publish - Publish a session
router.post('/my-sessions/publish', async (req, res) => {
  try {
    const { sessionId, title, tags, json_file_url } = req.body;

    // Validation
    if (!title || !json_file_url) {
      return res.status(400).json({ message: 'Title and JSON file URL are required' });
    }

    let session;

    if (sessionId) {
      // Update existing session and publish
      session = await Session.findOne({
        _id: sessionId,
        user_id: req.user._id
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      session.title = title;
      session.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
      session.json_file_url = json_file_url;
      session.status = 'published';
    } else {
      // Create new session and publish
      session = new Session({
        user_id: req.user._id,
        title,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
        json_file_url,
        status: 'published'
      });
    }

    await session.save();

    res.json({
      message: 'Session published successfully',
      session: {
        id: session._id,
        title: session.title,
        tags: session.tags,
        json_file_url: session.json_file_url,
        status: session.status,
        created_at: session.created_at,
        updated_at: session.updated_at
      }
    });
  } catch (error) {
    console.error('Error publishing session:', error);
    res.status(500).json({ message: 'Server error publishing session' });
  }
});

// GET /sessions - Public wellness sessions (published only)
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'email')
      .sort({ updated_at: -1 });

    res.json({
      sessions: sessions.map(session => ({
        id: session._id,
        title: session.title,
        tags: session.tags,
        author: session.user_id.email,
        created_at: session.created_at,
        updated_at: session.updated_at
      }))
    });
  } catch (error) {
    console.error('Error fetching public sessions:', error);
    res.status(500).json({ message: 'Server error fetching public sessions' });
  }
});

module.exports = router;
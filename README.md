# 🧘 Wellness Session Platform

A secure, full-stack web application for creating, managing, and sharing wellness sessions with authentication, drafts, and auto-save functionality.

## 🚀 Features

### ✅ Core Features
- **User Authentication**: Secure JWT-based registration and login
- **Session Management**: Create, edit, and publish wellness sessions
- **Draft System**: Auto-save drafts every 5 seconds of inactivity
- **Public Dashboard**: Browse published wellness sessions from the community
- **Session Editor**: Rich form interface for creating wellness content
- **Responsive Design**: Modern, beautiful UI that works on all devices

### 🔐 Security Features
- Password hashing with bcrypt (salt rounds: 12)
- JWT token authentication with 24-hour expiration
- Protected API routes with middleware
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation and sanitization

### 🎨 UI/UX Features
- Modern gradient design with glassmorphism effects
- Smooth animations and hover effects
- Auto-save status indicators
- Loading states and error handling
- Mobile-responsive layout

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

### Frontend
- **React 18** - Frontend framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Modern CSS** - Custom styling with gradients and animations

## 📁 Project Structure

```
wellness-session-platform/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Session.js       # Session schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── sessions.js      # Session management routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js     # Navigation component
    │   │   └── ProtectedRoute.js # Route protection
    │   ├── pages/
    │   │   ├── Login.js      # Login page
    │   │   ├── Register.js   # Registration page
    │   │   ├── Dashboard.js  # Public sessions dashboard
    │   │   ├── MySessions.js # User's sessions
    │   │   └── SessionEditor.js # Session creation/editing
    │   ├── utils/
    │   │   └── auth.js       # API utilities and auth helpers
    │   ├── App.js            # Main React component
    │   ├── index.js          # React entry point
    │   └── index.css         # Global styles
    ├── public/
    │   └── index.html        # HTML template
    └── package.json          # Frontend dependencies
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd wellness-session-platform
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Create and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

#### Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wellness-platform
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install
```

### 4. Database Setup
Make sure MongoDB is running:
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### 5. Start the Application

#### Development Mode
```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start frontend development server
cd frontend
npm start
```

#### Production Mode
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔌 API Endpoints

### Authentication Routes
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user (protected)
```

### Session Routes (All Protected)
```
GET  /api/sessions                    # Public wellness sessions
GET  /api/my-sessions                 # User's own sessions
GET  /api/my-sessions/:id             # Get specific user session
POST /api/my-sessions/save-draft      # Save/update draft session
POST /api/my-sessions/publish         # Publish session
```

### API Request/Response Examples

#### Register User
```javascript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

#### Save Draft Session
```javascript
POST /api/my-sessions/save-draft
{
  "sessionId": "optional-for-updates",
  "title": "Morning Meditation",
  "tags": "meditation, mindfulness, morning",
  "json_file_url": "https://example.com/session.json"
}

Response:
{
  "message": "Draft saved successfully",
  "session": {
    "id": "session-id",
    "title": "Morning Meditation",
    "tags": ["meditation", "mindfulness", "morning"],
    "status": "draft",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```

## 📱 Usage Guide

### 1. User Registration/Login
- Visit the application at http://localhost:3000
- Create a new account or login with existing credentials
- Passwords must be at least 6 characters long

### 2. Dashboard
- View all published wellness sessions from the community
- Browse sessions by tags and publication date
- See session authors and creation dates

### 3. My Sessions
- View all your personal sessions (drafts and published)
- Edit existing sessions by clicking "Edit Session"
- Create new sessions with "Create New Session"

### 4. Session Editor
- **Title**: Required field for session name
- **Tags**: Comma-separated tags for categorization
- **JSON File URL**: Session configuration (JSON content or URL)
- **Auto-save**: Changes automatically save as drafts after 5 seconds
- **Save as Draft**: Manually save without publishing
- **Publish**: Make session public (requires title and JSON URL)

### 5. Auto-save Feature
- Changes are automatically saved as drafts after 5 seconds of inactivity
- Visual indicators show save status and last save time
- Prevents data loss during session creation/editing

## 🛡️ Security Considerations

- Passwords are hashed with bcrypt (12 salt rounds)
- JWT tokens expire after 24 hours
- Protected routes require valid authentication
- Rate limiting prevents abuse
- Input validation on all endpoints
- CORS properly configured

## 🧪 Testing

### Backend Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Frontend Testing
- Open browser to http://localhost:3000
- Test registration and login flows
- Create and edit sessions
- Verify auto-save functionality

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production` in production environment
2. Use strong, unique JWT_SECRET
3. Configure production MongoDB URI
4. Build frontend: `npm run build`

### Deployment Options
- **Heroku**: Use provided Procfile
- **Docker**: Create Dockerfile for containerization
- **VPS**: Use PM2 for process management
- **Vercel/Netlify**: Frontend deployment with API proxy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add some feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

**Arvyax Full Stack Internship Assignment**

## 🆘 Support

For support and questions:
- Check the health endpoint: `/api/health`
- Review API documentation above
- Check browser console for frontend errors
- Verify MongoDB connection and environment variables

# Backend Setup Guide

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend` folder:

```env
MONGODB_URI=mongodb://localhost:27017/tradingDashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start manually:
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
mongod
```

### 4. Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### 5. Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

## 📁 Backend Structure

```
backend/
├── server.js              # Main server file
├── models/
│   └── User.js           # User model (MongoDB schema)
├── controllers/
│   └── authController.js # Authentication logic
├── routes/
│   └── authRoutes.js     # Auth routes
└── package.json          # Dependencies
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Health Check

- `GET /api/health` - Server health status

## 🔒 Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Token expiration (7 days by default)
- Input validation

## 🛠️ Troubleshooting

### MongoDB Connection Error

**Problem:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is installed and running
2. Check if MongoDB is running on port 27017
3. Verify the connection string in `.env`

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Change the PORT in `.env` file
2. Or stop the process using port 5000

### JWT Secret Warning

**Problem:** Using default JWT secret

**Solution:**
1. Generate a strong secret: `openssl rand -base64 32`
2. Update `JWT_SECRET` in `.env` file

## 📝 Next Steps

After backend is running:
1. Start the frontend: `npm run dev` (in root directory)
2. Open `http://localhost:5173`
3. Try registering a new user
4. Login and access the dashboard


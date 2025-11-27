# 🔐 Authentication Setup Guide

## ✅ What's Already Done

The authentication system is **fully integrated** into the trading dashboard! Here's what's included:

### Backend (Complete)
- ✅ Express.js server with MongoDB
- ✅ User model with password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ Register, Login, and Token Verification endpoints
- ✅ CORS enabled for frontend communication

### Frontend (Complete)
- ✅ Login page (`/login`)
- ✅ Register page (`/register`)
- ✅ Protected routes (dashboard requires login)
- ✅ AuthContext for state management
- ✅ Automatic token storage and verification

---

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd trading-dashboard/backend
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cd trading-dashboard/backend
cp .env.example .env
```

Then edit `.env` and update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A long, random secret key (change this!)
- `PORT` - Backend server port (default: 5000)

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if installed as service, it should auto-start)
# Or start manually:
mongod

# Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Step 4: Start Backend Server

```bash
cd trading-dashboard/backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server is running on http://localhost:5000
```

### Step 5: Update Frontend Environment

Create or update `.env` in the `trading-dashboard` root folder:

```env
VITE_AUTH_API_BASE_URL=http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 6: Start Frontend

```bash
cd trading-dashboard
npm run dev
```

---

## 📋 How It Works

### User Flow

1. **User visits dashboard** → Redirected to `/login` (if not authenticated)
2. **User registers** → Account created, JWT token stored
3. **User logs in** → JWT token stored in localStorage
4. **User accesses dashboard** → Token verified, dashboard loads
5. **User logs out** → Token removed, redirected to login

### API Endpoints

**Backend runs on:** `http://localhost:5000`

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Protected Routes

The dashboard (`/dashboard`) is protected. Users must:
1. Be logged in
2. Have a valid JWT token
3. Token must not be expired

---

## 🧪 Testing

### Test Registration

1. Go to `http://localhost:5173/register`
2. Enter username and password
3. Click "Sign Up"
4. Should redirect to dashboard

### Test Login

1. Go to `http://localhost:5173/login`
2. Enter credentials
3. Click "Sign In"
4. Should redirect to dashboard

### Test Protected Route

1. Log out (if logged in)
2. Try to access `http://localhost:5173/dashboard`
3. Should redirect to `/login`

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to MongoDB"
**Solution:**
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Default: `mongodb://localhost:27017/tradingDashboard`

### Problem: "Network Error" when logging in
**Solution:**
- Check backend server is running on port 5000
- Verify `VITE_AUTH_API_BASE_URL` in frontend `.env`
- Check CORS is enabled (already done in server.js)

### Problem: "Invalid token" errors
**Solution:**
- Clear localStorage: `localStorage.clear()` in browser console
- Log in again
- Check JWT_SECRET matches (if using multiple servers)

### Problem: Password not working
**Solution:**
- Passwords are hashed with bcrypt
- Cannot retrieve original password
- Use "Register" to create new account if needed

---

## 📁 File Structure

```
trading-dashboard/
├── backend/
│   ├── server.js              # Express server
│   ├── models/
│   │   └── User.js            # User schema with password hashing
│   ├── controllers/
│   │   └── authController.js # Register, login, verify logic
│   ├── routes/
│   │   └── authRoutes.js     # Auth endpoints
│   └── .env                   # Environment variables
│
└── src/
    ├── components/
    │   └── auth/
    │       ├── Login.jsx      # Login page
    │       ├── Register.jsx   # Register page
    │       └── ProtectedRoute.jsx # Route protection
    ├── contexts/
    │   └── AuthContext.jsx    # Auth state management
    └── services/
        └── api.js             # API calls (includes authAPI)
```

---

## 🔒 Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production! Use a long, random string.
2. **Password Hashing**: Passwords are automatically hashed with bcrypt (10 rounds)
3. **Token Expiry**: Tokens expire after 7 days (configurable in `.env`)
4. **HTTPS**: Use HTTPS in production for secure token transmission

---

## ✅ Next Steps

After authentication is working:

1. **Add Public Pages** (Phase 2)
   - Landing page
   - About Us
   - Contact Us

2. **Add User Profile** (Optional)
   - User settings
   - Profile editing
   - Password change

3. **Add Logout Button**
   - Add logout to dashboard header
   - Clear session on logout

---

**Everything is ready! Just start MongoDB and the backend server, and authentication will work!** 🎉


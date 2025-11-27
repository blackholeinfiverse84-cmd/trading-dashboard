# 🚀 Quick Start Guide

## Understanding the Error

If you see this error:
```
npm error path C:\Users\Mayur\OneDrive\Desktop\P\package.json
npm error enoent Could not read package.json
```

**This means:** You're in the wrong directory! The `package.json` file is inside the `trading-dashboard` folder, not in the `P` folder.

---

## ✅ Correct Way to Start the App

### Step 1: Open PowerShell/Terminal

### Step 2: Navigate to the trading-dashboard folder

**In PowerShell, type:**
```powershell
cd C:\Users\Mayur\OneDrive\Desktop\P\trading-dashboard
```

**Or if you're already in the P folder:**
```powershell
cd trading-dashboard
```

### Step 3: Verify you're in the right place

```powershell
ls package.json
```

You should see `package.json` listed. If you see an error, you're in the wrong folder.

### Step 4: Start the development server

```powershell
npm run dev
```

You should see:
```
VITE v7.2.4  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Step 5: Open your browser

Go to: **http://localhost:5173**

---

## 🔧 Starting Both Frontend and Backend

You need **TWO terminal windows**:

### Terminal 1: Backend Server

```powershell
cd C:\Users\Mayur\OneDrive\Desktop\P\trading-dashboard\backend
npm install
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server is running on http://localhost:5000
```

### Terminal 2: Frontend Server

```powershell
cd C:\Users\Mayur\OneDrive\Desktop\P\trading-dashboard
npm run dev
```

You should see:
```
VITE v7.2.4  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 📋 Common Issues & Solutions

### Issue 1: "Cannot find package.json"
**Solution:** Make sure you're in the `trading-dashboard` folder, not the `P` folder.

**Check your location:**
```powershell
Get-Location
```

**Should show:**
```
C:\Users\Mayur\OneDrive\Desktop\P\trading-dashboard
```

**If it shows:**
```
C:\Users\Mayur\OneDrive\Desktop\P
```

**Then navigate:**
```powershell
cd trading-dashboard
```

---

### Issue 2: "npm is not recognized"
**Solution:** Node.js is not installed or not in PATH.

1. Install Node.js from https://nodejs.org/
2. Restart your terminal
3. Verify: `node --version` and `npm --version`

---

### Issue 3: "Port 5173 already in use"
**Solution:** Another app is using that port.

**Option A:** Close the other app
**Option B:** Use a different port:
```powershell
npm run dev -- --port 3000
```

---

### Issue 4: "MongoDB connection error"
**Solution:** MongoDB is not running.

1. Start MongoDB service
2. Or install MongoDB if not installed
3. Or use MongoDB Atlas (cloud) and update connection string

---

## 🎯 Quick Commands Reference

```powershell
# Navigate to project
cd C:\Users\Mayur\OneDrive\Desktop\P\trading-dashboard

# Check if package.json exists
Test-Path package.json

# Install dependencies (if needed)
npm install

# Start frontend
npm run dev

# Start backend (in separate terminal)
cd backend
npm install
npm run dev

# Build for production
npm run build
```

---

## ✅ Verification Checklist

Before running `npm run dev`, make sure:

- [ ] You're in the `trading-dashboard` folder (not `P` folder)
- [ ] `package.json` exists (check with `ls package.json`)
- [ ] Dependencies are installed (`node_modules` folder exists)
- [ ] Node.js is installed (`node --version` works)

---

**Remember: Always navigate to `trading-dashboard` folder first!** 📁


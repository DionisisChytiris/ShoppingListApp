# Quick Start - Backend Authentication

## Backend Setup (5 minutes)

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   # Copy this content to backend/.env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/shoppinglistapp
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

4. **Start MongoDB:**
   - Local: Make sure MongoDB is running
   - Cloud: Use MongoDB Atlas connection string in `.env`

5. **Start backend:**
   ```bash
   npm run dev
   ```

## Frontend Configuration

1. **Update API URL in `src/lib/api.ts`:**
   - For iOS Simulator: `http://localhost:3000`
   - For Android Emulator: `http://10.0.2.2:3000`
   - For Physical Device: `http://YOUR_COMPUTER_IP:3000`

2. **Test the app:**
   - Open Settings screen
   - Tap "Login / Sign Up"
   - Create an account or login

## What's Included

✅ User authentication (signup/login)
✅ JWT token-based authentication
✅ Protected routes middleware
✅ Redux state management for auth
✅ Auth modal UI
✅ Settings screen integration
✅ Auto-check authentication on app start

## Next Steps

After authentication works, you can:
1. Create Shopping List models and routes
2. Create Item models and routes
3. Add photo upload functionality
4. Sync local data with server

See `BACKEND_SETUP.md` for detailed instructions.

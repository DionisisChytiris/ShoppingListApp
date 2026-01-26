# Backend Setup Guide

This guide will help you set up the Node.js/Express/MongoDB backend for your Shopping List App.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Step 1: Install Backend Dependencies

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and update the following:

### For Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/shoppinglistapp
```

### For MongoDB Atlas (Cloud):
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/shoppinglistapp?retryWrites=true&w=majority`)
4. Update `MONGODB_URI` in `.env`

### Generate JWT Secret:
For production, generate a secure random string:
```bash
# On Linux/Mac:
openssl rand -base64 32

# Or use any random string generator
```

Update `JWT_SECRET` in `.env` with the generated string.

## Step 3: Start MongoDB

### Local MongoDB:
```bash
# On Mac (if installed via Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
# MongoDB should start automatically as a service
```

### MongoDB Atlas:
No local installation needed - just use your connection string.

## Step 4: Start the Backend Server

```bash
# Development mode (with auto-reload):
npm run dev

# Production mode:
npm start
```

The server should start on `http://localhost:3000` (or the port you specified in `.env`).

## Step 5: Configure Frontend API URL

Update the API URL in `src/lib/api.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000' // For iOS Simulator
  // ? 'http://10.0.2.2:3000' // For Android Emulator
  // ? 'http://YOUR_COMPUTER_IP:3000' // For physical device
  : 'https://your-production-api.com';
```

### Finding Your Computer's IP Address:

**Windows:**
```bash
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig
# Look for inet address (e.g., 192.168.1.100)
```

**For Android Emulator:**
- Use `10.0.2.2` instead of `localhost` - this is the emulator's special alias for your host machine

**For iOS Simulator:**
- Use `localhost` or `127.0.0.1`

**For Physical Device:**
- Use your computer's local IP address (e.g., `192.168.1.100`)
- Make sure your phone and computer are on the same WiFi network
- Make sure your firewall allows connections on port 3000

## Step 6: Test the Backend

### Health Check:
```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```

### Test Signup:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Test Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Register a new user
  - Body: `{ email, password, name? }`
  - Returns: `{ _id, email, name, token }`

- **POST** `/api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ _id, email, name, token }`

- **GET** `/api/auth/me` - Get current user (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ _id, email, name, createdAt }`

## Troubleshooting

### MongoDB Connection Issues

1. **"MongoServerError: Authentication failed"**
   - Check your MongoDB username and password in the connection string
   - For Atlas: Make sure your IP is whitelisted in Network Access

2. **"MongooseServerSelectionError: connect ECONNREFUSED"**
   - Make sure MongoDB is running locally
   - Check if the port (27017) is correct
   - Check firewall settings

### CORS Issues

If you get CORS errors, the backend already has CORS enabled. If issues persist:
- Make sure the frontend URL matches what's allowed
- Check `backend/server.js` for CORS configuration

### Network Issues (Physical Device)

1. **Can't connect to backend**
   - Ensure phone and computer are on the same WiFi
   - Check firewall allows port 3000
   - Verify IP address is correct
   - Try disabling VPN if active

2. **Connection timeout**
   - Check if backend is running
   - Verify the IP address hasn't changed
   - Try restarting both backend and app

## Next Steps

After authentication is working:

1. Create models for Shopping Lists and Items
2. Create routes for CRUD operations
3. Add photo upload functionality
4. Implement sync between local and server data
5. Add real-time updates (optional, using WebSockets)

## Production Deployment

For production, consider:

1. **Hosting Backend:**
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2
   - Render

2. **Database:**
   - MongoDB Atlas (recommended)
   - Self-hosted MongoDB

3. **Environment Variables:**
   - Use secure secret management
   - Never commit `.env` files
   - Use environment variables in your hosting platform

4. **Security:**
   - Use HTTPS
   - Set up proper CORS
   - Rate limiting
   - Input validation (already implemented)
   - Password strength requirements

# College Complaint Management System

This project is ready for local testing and deployment preparation. The steps below are the ones you should do manually before deployment, because they require your MongoDB Atlas account, Render account, and Vercel account.

## Status

The app has already been checked locally:
- Backend health check passed: http://localhost:5000/health
- Frontend production build passed: `npm run build`
- Registration/login flow is working with the API

## Required manual setup before deployment

### 1. Create a MongoDB Atlas database

1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Create a database user with username and password
4. Add your current IP to Network Access
5. Copy the MongoDB connection string

Example format:
```env
mongodb+srv://username:password@cluster.mongodb.net/college-complaints?retryWrites=true&w=majority
```

### 2. Update backend environment file

Open the file: `backend/.env`

Set it like this:
```env
MONGODB_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/college-complaints?retryWrites=true&w=majority
JWT_SECRET=generate_a_long_random_secret_here
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Important:
- Use your real Atlas URI
- Use a strong secret for JWT
- Keep this file private and do not push it to Git

### 3. Update frontend environment file

Create or edit: `frontend/.env.local`

Use:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Install dependencies locally

Run these commands:
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 5. Start the backend locally

Run:
```bash
cd backend
npm run dev
```

Then verify:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK"}
```

### 6. Start the frontend locally

Open a new terminal and run:
```bash
cd frontend
npm run dev
```

Then open:
- http://localhost:3000

### 7. Test account creation manually

1. Open the register page
2. Create a new user account
3. Login with that account
4. Check dashboard access
5. Create a complaint

### 8. Deploy the backend to Render

Manual steps:
1. Push the project to GitHub
2. Go to https://render.com
3. Create a new Web Service
4. Set root directory to `backend`
5. Use build command:
```bash
npm install
```
6. Use start command:
```bash
node server.js
```
7. Add environment variables in Render:
```env
MONGODB_URI=your_atlas_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
PORT=10000
FRONTEND_URL=https://your-vercel-frontend-url
```

### 9. Deploy the frontend to Vercel

Manual steps:
1. Go to https://vercel.com
2. Import the GitHub repository
3. Set project root as `frontend`
4. Add environment variable:
```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url/api
```
5. Deploy

### 10. Final production check

After deployment:
- frontend loads properly
- backend health endpoint works
- register page creates users
- login works
- complaint creation works
- dashboard shows correct user role data

## Common deployment checklist

Before you say the app is ready, confirm all of these:
- [ ] Atlas cluster is active
- [ ] Database user exists
- [ ] IP access is allowed
- [ ] backend/.env contains real values
- [ ] frontend/.env.local contains NEXT_PUBLIC_API_URL
- [ ] backend runs locally on port 5000
- [ ] frontend runs locally on port 3000
- [ ] user can register and login
- [ ] Render backend is live
- [ ] Vercel frontend is live
- [ ] frontend points to deployed backend URL

## Notes

This project uses:
- Next.js frontend
- Express backend
- MongoDB database
- JWT authentication
- role-based access control

Do not deploy until all manual environment values are set correctly.

## Deployment

### Backend → Render

1. Push the `backend/` folder to a GitHub repository.
2. Go to [https://render.com](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repo and set the root directory to `backend`.
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables in the Render dashboard (same as your `.env`).
7. Set `FRONTEND_URL` to your Vercel URL.

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repository.
2. Go to [https://vercel.com](https://vercel.com) and import the repository.
3. Set root directory to `frontend`.
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (e.g., `https://your-app.onrender.com/api`)
5. Deploy.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `Missing required environment variable: MONGODB_URI` | Fill in `backend/.env` with a real MongoDB URI |
| `MongoDB connection error` | Check your Atlas IP whitelist and credentials |
| `CORS error` in browser | Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly |
| Port 5000 already in use | Change `PORT=5001` in `backend/.env` |
| `npm: command not found` | Install Node.js from https://nodejs.org |

---

*Built with ❤️ using Next.js, Express, and MongoDB*

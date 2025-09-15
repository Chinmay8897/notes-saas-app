# Multi-Tenant Notes Application

## Important: Separate Frontend and Backend Deployment

This application has **frontend** and **backend** components that must be deployed separately.

### Frontend Deployment (Netlify)

1. **Environment Variables in Netlify Dashboard:**
   ```
   VITE_API_URL=https://your-backend-api.herokuapp.com/api
   ```

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20

3. **Files for Netlify:**
   - `netlify.toml` - Build configuration and redirects
   - `public/_redirects` - SPA routing support

### Backend Deployment (Heroku/Railway/Vercel)

Deploy **only** these backend files:
- `server.js`
- `api/` folder
- `lib/` folder
- `package.json`
- `.env.server` (rename to `.env` on server)

**Backend Environment Variables:**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
FRONTEND_URL=https://your-netlify-app.netlify.app
PORT=3000
```

### Security Note

- ❌ **Never** include `MONGODB_URI` or `JWT_SECRET` in frontend environment files
- ✅ **Only** use `VITE_` prefixed variables in frontend
- ✅ Keep backend secrets in separate deployment

### Local Development

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev
```

This runs:
- Frontend: http://localhost:3000 (Vite)
- Backend: http://localhost:3002 (Express)

### File Structure

```
Frontend files (deploy to Netlify):
- src/
- public/
- index.html
- package.json
- vite.config.js
- netlify.toml

Backend files (deploy to Heroku/Railway):
- server.js
- api/
- lib/
- .env.server (rename to .env)
```
# Multi-Tenant Notes Application

## Deployment Instructions

### Frontend Deployment (Netlify)

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

2. **Environment Variables in Netlify:**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

3. **Files Added for Netlify:**
   - `netlify.toml` - Build configuration and redirects
   - `public/_redirects` - SPA routing support
   - `.env.production` - Production environment template

### Backend Deployment

Deploy your backend (server.js and API routes) to:
- Heroku
- Railway
- Vercel
- Digital Ocean
- AWS

Make sure to set these environment variables on your backend hosting platform:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### Important Notes

1. The frontend and backend are separate deployments
2. Update `VITE_API_URL` in Netlify to point to your deployed backend
3. Update CORS settings in your backend to allow your Netlify domain
4. Make sure your backend accepts requests from your frontend domain

## Local Development

```bash
npm install
npm run dev
```

This runs both frontend (port 3000) and backend (port 3002) concurrently.
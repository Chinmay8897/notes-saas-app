import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './lib/database.js';

const app = express();
const PORT = process.env.PORT || 3002; // Changed to 3002

console.log('Starting server setup...');

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB().catch(console.error);

// Simple health check route
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('Health route registered');

// Import and setup login route
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', { body: req.body, headers: req.headers });
    const { default: loginHandler } = await import('./api/auth/login.js');
    await loginHandler(req, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Import and setup notes routes
app.get('/api/notes', async (req, res) => {
  try {
    const { default: notesHandler } = await import('./api/notes/index.js');
    await notesHandler(req, res);
  } catch (error) {
    console.error('Notes index error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    console.log('Create note request (POST /api/notes):', req.body);
    const { default: createHandler } = await import('./api/notes/create.js');
    await createHandler(req, res);
  } catch (error) {
    console.error('Notes create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/notes/create', async (req, res) => {
  try {
    console.log('Create note request (POST /api/notes/create):', req.body);
    const { default: createHandler } = await import('./api/notes/create.js');
    await createHandler(req, res);
  } catch (error) {
    console.error('Notes create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Notes with ID routes
app.put('/api/notes/:id', async (req, res) => {
  try {
    req.query = { ...req.query, id: req.params.id };
    const { default: notesIdHandler } = await import('./api/notes/[id].js');
    await notesIdHandler(req, res);
  } catch (error) {
    console.error('Notes update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    req.query = { ...req.query, id: req.params.id };
    const { default: notesIdHandler } = await import('./api/notes/[id].js');
    await notesIdHandler(req, res);
  } catch (error) {
    console.error('Notes delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Invitation routes
app.post('/api/invitations', async (req, res) => {
  try {
    console.log('Create invitation request:', req.body);
    const { default: createInvitationHandler } = await import('./api/invitations/create.js');
    await createInvitationHandler(req, res);
  } catch (error) {
    console.error('Create invitation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/invitations', async (req, res) => {
  try {
    const { default: getInvitationsHandler } = await import('./api/invitations/index.js');
    await getInvitationsHandler(req, res);
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/invitations/accept', async (req, res) => {
  try {
    console.log('Accept invitation request');
    const { default: acceptInvitationHandler } = await import('./api/invitations/accept.js');
    await acceptInvitationHandler(req, res);
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/invitations/details', async (req, res) => {
  try {
    const { default: getInvitationDetailsHandler } = await import('./api/invitations/details.js');
    await getInvitationDetailsHandler(req, res);
  } catch (error) {
    console.error('Get invitation details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔍 Server address:`, server.address());
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS origin: ${process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000'}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.on('listening', () => {
  console.log('✅ Server is listening for connections');
});

export default app;
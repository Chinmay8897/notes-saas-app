import { connectDB } from '../../lib/database.js';
import { Note } from '../../lib/models/Note.js';
import { authenticate } from '../middleware/auth.js';
import { corsHandler } from '../middleware/cors.js';

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    await authenticate(req, res, async () => {
      try {
        await connectDB();

        if (req.method === 'GET') {
          const notes = await Note.find({ tenantId: req.tenantId })
            .sort({ updatedAt: -1 })
            .populate('userId', 'email');

          res.status(200).json(notes);
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
      } catch (error) {
        console.error('Notes error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  });
}

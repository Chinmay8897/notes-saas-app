import { connectDB } from '../../lib/database.js';
import { Note } from '../../lib/models/Note.js';
import { authenticate } from '../middleware/auth.js';
import { corsHandler } from '../middleware/cors.js';

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    await authenticate(req, res, async () => {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      try {
        await connectDB();

        const { title, content } = req.body;

        if (!title || !content) {
          return res.status(400).json({ error: 'Title and content required' });
        }

        // Check note limit for free plan
        if (req.tenant.plan === 'free') {
          const noteCount = await Note.countDocuments({ tenantId: req.tenantId });
          if (noteCount >= req.tenant.noteLimit) {
            return res.status(403).json({
              error: 'Note limit reached. Upgrade to Pro for unlimited notes.',
              code: 'NOTE_LIMIT_REACHED'
            });
          }
        }

        const note = new Note({
          title,
          content,
          tenantId: req.tenantId,
          userId: req.user._id
        });

        await note.save();
        await note.populate('userId', 'email');

        res.status(201).json(note);
      } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  });
}

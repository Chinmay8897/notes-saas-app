import { connectDB } from '../../lib/database.js';
import { Note } from '../../lib/models/Note.js';
import { authenticate } from '../middleware/auth.js';
import { corsHandler } from '../middleware/cors.js';

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    await authenticate(req, res, async () => {
      try {
        await connectDB();

        const { id } = req.query;

        const note = await Note.findOne({
          _id: id,
          tenantId: req.tenantId
        }).populate('userId', 'email');

        if (!note) {
          return res.status(404).json({ error: 'Note not found' });
        }

        if (req.method === 'GET') {
          res.status(200).json(note);
        }
        else if (req.method === 'PUT') {
          const { title, content } = req.body;

          if (title) note.title = title;
          if (content) note.content = content;
          note.updatedAt = new Date();

          await note.save();
          res.status(200).json(note);
        }
        else if (req.method === 'DELETE') {
          await Note.deleteOne({ _id: id, tenantId: req.tenantId });
          res.status(200).json({ message: 'Note deleted successfully' });
        }
        else {
          res.status(405).json({ error: 'Method not allowed' });
        }
      } catch (error) {
        console.error('Note operation error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  });
}

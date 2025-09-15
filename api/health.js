import { corsHandler } from './middleware/cors.js';

export default function handler(req, res) {
  corsHandler(req, res, () => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
}

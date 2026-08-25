import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB } from './config/db.js';
import searchRoutes from './routes/searchRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin:process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit:'16kb' }));
app.get('/api/health', (_req,res) => res.json({ status:'ok' }));
app.use('/api/search', searchRoutes);
app.use('/api/services', serviceRoutes);

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*splat', (_req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

app.use((err,_req,res,_next) => { console.error(err); res.status(500).json({ message:'Something went wrong. Please try again.' }); });
const port = process.env.PORT || 5000;
await connectDB(process.env.MONGODB_URI);
if (process.env.NODE_ENV !== 'test') app.listen(port, () => console.log(`API running on http://localhost:${port}`));
export default app;

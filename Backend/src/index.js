import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 4000;
const configuredFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const localFrontendUrls = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
]);

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === configuredFrontendUrl || localFrontendUrls.has(origin)) {
      return callback(null, origin || configuredFrontendUrl);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'BhuNirnay Backend', time: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 BhuNirnay backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

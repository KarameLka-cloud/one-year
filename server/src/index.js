import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config.js';
import { closePool } from './db.js';
import { requireAuth } from './middleware/auth.js';
import authRouter from './routes/auth.js';
import rsvpRouter from './routes/rsvp.js';
import adminRouter from './routes/admin.js';

const app = express();

if (config.trustProxy) {
  app.set('trust proxy', config.trustProxy);
}

app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        frameSrc: ["'self'", 'https://yandex.ru'],
        upgradeInsecureRequests: null,
      },
    },
  }),
);

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  }),
);

app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 180,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Слишком много запросов, попробуйте позже.' },
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'one-year-invitation', time: new Date().toISOString() });
});

app.use('/api', apiLimiter);
app.use('/api/auth', authRouter);
app.use('/api/rsvp', rsvpRouter);
app.use('/api/admin', requireAuth, adminRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API: маршрут не найден' });
});

// В продакшене Express отдаёт собранный React-клиент (client/dist).
const indexHtml = path.join(config.clientDist, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(
    express.static(config.clientDist, {
      index: false,
      maxAge: config.isProd ? '30d' : 0,
    }),
  );

  app.get('*', (req, res, next) => {
    if (!req.accepts('html')) return next();
    return res.sendFile(indexHtml);
  });
}

app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в запросе' });
  }

  console.error('[api]', error);
  return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const server = app.listen(config.port, () => {
  const mode = config.isProd ? 'production' : 'development';
  console.log(`\n  ✦ Приглашение API запущено: http://localhost:${config.port}`);
  console.log(`  ✦ Режим: ${mode}\n`);
});

async function shutdown(signal) {
  console.log(`\n${signal}: останавливаем сервер…`);
  server.close(async () => {
    try {
      await closePool();
    } finally {
      process.exit(0);
    }
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;

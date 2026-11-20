import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '../..');

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value, fallback = false) => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: toNumber(process.env.PORT, 4000),
  trustProxy: process.env.TRUST_PROXY ? toNumber(process.env.TRUST_PROXY, 0) : 0,

  dbPath: process.env.DB_PATH || path.join(projectRoot, 'data', 'invite.db'),

  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  sessionHours: toNumber(process.env.SESSION_HOURS, 12),
  cookieName: 'invite_admin',
  cookieSecure: toBool(process.env.COOKIE_SECURE, false),

  adminLogin: process.env.ADMIN_LOGIN || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin12345',

  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  clientDist: process.env.CLIENT_DIST || path.join(projectRoot, 'client', 'dist'),
  seedDemo: toBool(process.env.SEED_DEMO, false),
};

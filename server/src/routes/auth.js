import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'express-rate-limit';
import { query } from '../db.js';
import { config } from '../config.js';
import {
  requireAuth,
  sessionCookieOptions,
  signAdminToken,
} from '../middleware/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Слишком много попыток входа. Попробуйте через 15 минут.' },
});

// Хеш-заглушка: сравнение выполняется даже для несуществующего логина,
// чтобы время ответа не выдавало наличие пользователя.
const DUMMY_HASH = bcrypt.hashSync('placeholder-password-never-matches', 10);

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const login = String(req.body?.login || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!login || !password) {
      return res.status(400).json({ error: 'Введите логин и пароль' });
    }

    const rows = await query(
      'SELECT id, login, password_hash FROM admins WHERE login = ? LIMIT 1',
      [login],
    );
    const admin = rows[0];
    const passwordOk = await bcrypt.compare(password, admin?.password_hash || DUMMY_HASH);

    if (!admin || !passwordOk) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const token = signAdminToken(admin);
    res.cookie(config.cookieName, token, sessionCookieOptions);

    return res.json({
      admin: { id: admin.id, login: admin.login },
      token,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ admin: req.admin });
});

router.post('/logout', (req, res) => {
  res.clearCookie(config.cookieName, { ...sessionCookieOptions, maxAge: undefined });
  res.json({ ok: true });
});

export default router;

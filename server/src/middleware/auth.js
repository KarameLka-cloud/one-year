import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const bearer = header.replace(/^Bearer\s+/i, '').trim();
  const token = req.cookies?.[config.cookieName] || bearer;

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.admin = { id: payload.sub, login: payload.login };
    return next();
  } catch {
    return res.status(401).json({ error: 'Сессия истекла, войдите снова' });
  }
}

export function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin.id, login: admin.login },
    config.jwtSecret,
    { expiresIn: `${config.sessionHours}h` },
  );
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.cookieSecure,
  maxAge: config.sessionHours * 60 * 60 * 1000,
  path: '/',
};

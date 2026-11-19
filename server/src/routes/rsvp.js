import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { query } from '../db.js';

const router = Router();

const rsvpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Слишком много отправок. Попробуйте немного позже.' },
});

const ATTENDANCE = new Set(['yes', 'no', 'maybe']);

function clean(value, maxLength) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, maxLength);
}

router.post('/', rsvpLimiter, async (req, res, next) => {
  try {
    // Honeypot: скрытое поле должно оставаться пустым.
    if (clean(req.body?.company, 80)) {
      return res.status(201).json({ ok: true, id: null });
    }

    const name = clean(req.body?.name, 120).replace(/\s+/g, ' ');
    const contact = clean(req.body?.contact, 160).replace(/\s+/g, ' ');
    const attendance = ATTENDANCE.has(req.body?.attendance) ? req.body.attendance : 'yes';
    const rawGuests = Number.parseInt(req.body?.guests, 10);
    const guests =
      attendance === 'no'
        ? 0
        : Number.isFinite(rawGuests)
          ? Math.min(Math.max(rawGuests, 1), 10)
          : 1;
    const message = clean(req.body?.message, 1000);

    const fields = {};
    if (name.length < 2) fields.name = 'Укажите имя (минимум 2 символа)';
    if (contact.length < 5) fields.contact = 'Укажите телефон или мессенджер для связи';

    if (Object.keys(fields).length > 0) {
      return res.status(422).json({ error: 'Проверьте заполнение формы', fields });
    }

    const result = await query(
      `INSERT INTO rsvps (name, contact, attendance, guests, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, contact, attendance, guests, message || null],
    );

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    return next(error);
  }
});

export default router;

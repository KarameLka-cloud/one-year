import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

const STATUSES = new Set(['new', 'processed']);
const ATTENDANCE_LABELS = { yes: 'Придёт', no: 'Не придёт', maybe: 'Пока не уверен(а)' };

function toRecord(row) {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact,
    attendance: row.attendance,
    guests: Number(row.guests),
    message: row.message || '',
    status: row.status,
    createdAt: row.created_at_unix
      ? new Date(Number(row.created_at_unix) * 1000).toISOString()
      : null,
  };
}

async function getStats() {
  const rows = await query(
    `SELECT
       COUNT(*) AS total,
       COALESCE(SUM(attendance = 'yes'), 0) AS coming,
       COALESCE(SUM(attendance = 'no'), 0) AS notComing,
       COALESCE(SUM(attendance = 'maybe'), 0) AS maybe,
       COALESCE(SUM(CASE WHEN attendance IN ('yes', 'maybe') THEN guests ELSE 0 END), 0) AS guests,
       COALESCE(SUM(status = 'new'), 0) AS unread
     FROM rsvps`,
  );
  const row = rows[0] || {};
  return {
    total: Number(row.total || 0),
    coming: Number(row.coming || 0),
    notComing: Number(row.notComing || 0),
    maybe: Number(row.maybe || 0),
    guests: Number(row.guests || 0),
    unread: Number(row.unread || 0),
  };
}

function buildFilters({ status, q }) {
  const where = [];
  const params = [];

  if (STATUSES.has(status)) {
    where.push('status = ?');
    params.push(status);
  }
  if (q) {
    where.push('(name LIKE ? OR contact LIKE ? OR message LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  return {
    clause: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params,
  };
}

router.get('/rsvps', async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const q = String(req.query.q || '').trim().slice(0, 120);
    const status = String(req.query.status || '').trim();

    const { clause, params } = buildFilters({ status, q });

    const [rows, countRows, stats] = await Promise.all([
      query(
        `SELECT id, name, contact, attendance, guests, message, status,
                UNIX_TIMESTAMP(created_at) AS created_at_unix
         FROM rsvps
         ${clause}
         ORDER BY created_at DESC, id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      ),
      query(`SELECT COUNT(*) AS total FROM rsvps ${clause}`, params),
      getStats(),
    ]);

    res.json({
      items: rows.map(toRecord),
      total: Number(countRows[0]?.total || 0),
      page,
      limit,
      stats,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/rsvps/export', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim().slice(0, 120);
    const status = String(req.query.status || '').trim();
    const { clause, params } = buildFilters({ status, q });

    const rows = await query(
      `SELECT id, name, contact, attendance, guests, message, status,
              UNIX_TIMESTAMP(created_at) AS created_at_unix
       FROM rsvps
       ${clause}
       ORDER BY created_at DESC, id DESC`,
      params,
    );

    const escapeCell = (value) => {
      let text = String(value ?? '');
      if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
      return `"${text.replace(/"/g, '""')}"`;
    };

    const header = ['ID', 'Дата', 'Имя', 'Контакт', 'Присутствие', 'Гостей', 'Пожелание', 'Статус'];
    const lines = rows.map((row) => {
      const date = row.created_at_unix
        ? new Date(Number(row.created_at_unix) * 1000).toLocaleString('ru-RU', {
            dateStyle: 'short',
            timeStyle: 'short',
          })
        : '';
      return [
        row.id,
        date,
        row.name,
        row.contact,
        ATTENDANCE_LABELS[row.attendance] || row.attendance,
        row.guests,
        row.message || '',
        row.status === 'new' ? 'Новая' : 'Обработана',
      ].map(escapeCell).join(';');
    });

    const csv = `\uFEFF${[header.map(escapeCell).join(';'), ...lines].join('\r\n')}`;
    const filename = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

router.patch('/rsvps/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const status = String(req.body?.status || '');

    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ error: 'Некорректный идентификатор' });
    }
    if (!STATUSES.has(status)) {
      return res.status(422).json({ error: 'Некорректный статус' });
    }

    const result = await query('UPDATE rsvps SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    return res.json({ ok: true, id, status });
  } catch (error) {
    return next(error);
  }
});

router.delete('/rsvps/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ error: 'Некорректный идентификатор' });
    }

    const result = await query('DELETE FROM rsvps WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

export default router;

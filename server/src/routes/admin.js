import { Router } from 'express';
import { db, query } from '../db.js';

const router = Router();

const ATTENDANCE_LABELS = { yes: 'Придёт', no: 'Не придёт' };

function toRecord(row) {
  return {
    id: row.id,
    name: row.name,
    pair: row.pair || '',
    attendance: row.attendance,
    children: Number(row.children),
    createdAt: row.created_at_unix
      ? new Date(Number(row.created_at_unix) * 1000).toISOString()
      : null,
  };
}

async function getStats() {
  const rows = await db.query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) + SUM(CASE WHEN pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END) AS totalAdults,
       COALESCE(SUM(children), 0) AS totalChildren,
       COUNT(*) + SUM(CASE WHEN pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END) + COALESCE(SUM(children), 0) AS totalPeople,
       COALESCE(SUM(CASE WHEN attendance = 'yes' THEN 1 ELSE 0 END), 0)
         + COALESCE(SUM(CASE WHEN attendance = 'yes' AND pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END), 0) AS comingAdults,
       COALESCE(SUM(CASE WHEN attendance = 'yes' THEN children ELSE 0 END), 0) AS comingChildren,
       COALESCE(SUM(CASE WHEN attendance = 'yes' THEN 1 ELSE 0 END), 0)
         + COALESCE(SUM(CASE WHEN attendance = 'yes' AND pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END), 0)
         + COALESCE(SUM(CASE WHEN attendance = 'yes' THEN children ELSE 0 END), 0) AS comingTotal,
       COALESCE(SUM(CASE WHEN attendance = 'no' THEN 1 ELSE 0 END), 0)
         + COALESCE(SUM(CASE WHEN attendance = 'no' AND pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END), 0)
         + COALESCE(SUM(CASE WHEN attendance = 'no' THEN children ELSE 0 END), 0) AS notComing
     FROM rsvps`,
  );
  const row = rows[0] || {};
  return {
    total: Number(row.total || 0),
    totalAdults: Number(row.totalAdults || 0),
    totalChildren: Number(row.totalChildren || 0),
    totalPeople: Number(row.totalPeople || 0),
    comingAdults: Number(row.comingAdults || 0),
    comingChildren: Number(row.comingChildren || 0),
    comingTotal: Number(row.comingTotal || 0),
    notComing: Number(row.notComing || 0),
  };
}

function buildFilters({ q }) {
  const where = [];
  const params = [];

  if (q) {
    where.push('(name LIKE ? OR pair LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like);
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

    const { clause, params } = buildFilters({ q });

    const [rows, countRows, stats] = await Promise.all([
      db.query(
        `SELECT id, name, pair, attendance, children,
                CAST(strftime('%s', created_at) AS INTEGER) AS created_at_unix
         FROM rsvps
         ${clause}
         ORDER BY created_at DESC, id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      ),
      db.query(`SELECT COUNT(*) AS total FROM rsvps ${clause}`, params),
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
    const { clause, params } = buildFilters({ q });

    const rows = await query(
      `SELECT id, name, pair, attendance, children,
              CAST(strftime('%s', created_at) AS INTEGER) AS created_at_unix
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

    const header = ['ID', 'Дата', 'Имя', 'Пара', 'Присутствие', 'Дети'];
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
        row.pair || '',
        ATTENDANCE_LABELS[row.attendance] || row.attendance,
        row.children,
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

router.delete('/rsvps/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ error: 'Некорректный идентификатор' });
    }

    const result = await db.run('DELETE FROM rsvps WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

export default router;

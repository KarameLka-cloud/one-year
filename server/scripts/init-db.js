import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { config } from '../src/config.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here, '../src/schema.sql');

if (!/^[a-zA-Z0-9_]+$/.test(config.db.database)) {
  console.error('DB_NAME может содержать только латиницу, цифры и подчёркивания.');
  process.exit(1);
}

const demoRecords = [
  ['Анна Петрова', '+7 (902) 111-22-33', 'yes', 2, 'Очень ждём праздника! Будем с дочкой.'],
  ['Сергей и Мария', 'max: @sergey_m', 'yes', 2, 'Подарок уже готов 🙂'],
  ['Ольга Иванова', '+7 (914) 555-66-77', 'maybe', 1, 'Постараюсь быть, уточню ближе к дате.'],
  ['Дмитрий', 'telegram: @dmitry', 'no', 0, 'К сожалению, не смогу приехать. Поздравляю малышку!'],
];

async function main() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    await connection.query(`USE \`${config.db.database}\``);

    const schema = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schema);
    console.log(`✓ База «${config.db.database}» и таблицы готовы`);

    const login = config.adminLogin.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(config.adminPassword, 12);
    await connection.query(
      `INSERT INTO admins (login, password_hash) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE password_hash = ?`,
      [login, passwordHash, passwordHash],
    );
    console.log(`✓ Администратор «${login}» создан / пароль обновлён`);

    if (config.seedDemo) {
      const [rows] = await connection.query('SELECT COUNT(*) AS total FROM rsvps');
      if (Number(rows[0]?.total || 0) === 0) {
        for (const record of demoRecords) {
          await connection.query(
            `INSERT INTO rsvps (name, contact, attendance, guests, message)
             VALUES (?, ?, ?, ?, ?)`,
            record,
          );
        }
        console.log(`✓ Добавлено демонстрационных записей: ${demoRecords.length}`);
      } else {
        console.log('· Демо-записи не добавлены: таблица уже содержит данные');
      }
    }

    console.log('\nГотово. Теперь можно запустить проект:\n  npm run dev\n');
    console.log(`Логин: ${login}`);
    console.log(`Пароль: ${config.adminPassword}\n`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('\nНе удалось инициализировать базу данных.');
  console.error(error.message);
  console.error('\nПроверьте параметры MySQL в server/.env\n');
  process.exit(1);
});

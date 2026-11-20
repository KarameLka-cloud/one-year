import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { config } from '../src/config.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here, '../src/schema.sql');

const demoRecords = [
  ['Анна Петрова', 'Сергей и Мария', 'yes', 1],
  ['Ольга Иванова', '', 'yes', 2],
  ['Дмитрий', '', 'no', 0],
];

async function main() {
  // Убеждаемся, что директория существует
  const dbDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Удаляем старую БД если есть (для чистого старта)
  if (fs.existsSync(config.dbPath)) {
    fs.unlinkSync(config.dbPath);
  }
  // Удаляем сопутствующие WAL и SHM файлы
  for (const ext of ['-wal', '-shm']) {
    const walPath = config.dbPath + ext;
    if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
  }

  const database = new Database(config.dbPath);
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');

  try {
    // Загружаем схему
    const schema = fs.readFileSync(schemaPath, 'utf8');
    database.exec(schema);
    console.log(`✓ База «${config.dbPath}» и таблицы готовы`);

    // Создаём администратора
    const login = config.adminLogin.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(config.adminPassword, 12);
    database.exec(
      `INSERT INTO admins (login, password_hash) VALUES ('${login.replace(/'/g, "''")}', '${passwordHash.replace(/'/g, "''")}')`,
    );
    console.log(`✓ Администратор «${login}» создан / пароль обновлён`);

    // Демо-записи
    if (config.seedDemo) {
      const row = database.prepare('SELECT COUNT(*) AS total FROM rsvps').get();
      if (Number(row.total) === 0) {
        const insert = database.prepare(
          'INSERT INTO rsvps (name, pair, attendance, children) VALUES (?, ?, ?, ?)',
        );
        const insertMany = database.transaction((records) => {
          for (const record of records) {
            insert.run(record);
          }
        });
        insertMany(demoRecords);
        console.log(`✓ Добавлено демонстрационных записей: ${demoRecords.length}`);
      } else {
        console.log('· Демо-записи не добавлены: таблица уже содержит данные');
      }
    }

    console.log('\nГотово. Теперь можно запустить проект:\n  npm run dev\n');
    console.log(`Логин: ${login}`);
    console.log(`Пароль: ${config.adminPassword}\n`);
  } finally {
    database.close();
  }
}

main().catch((error) => {
  console.error('\nНе удалось инициализировать базу данных.');
  console.error(error.message);
  console.error('\nПроверьте параметры в server/.env\n');
  process.exit(1);
});

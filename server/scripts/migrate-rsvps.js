import mysql from 'mysql2/promise';
import { config } from '../src/config.js';

async function main() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });

  try {
    await connection.query(`USE \`${config.db.database}\``);

    // Проверяем, есть ли уже новая схема
    const [cols] = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rsvps' AND COLUMN_NAME = 'pair'",
      [config.db.database],
    );

    if (cols.length > 0) {
      // Проверяем ENUM attendance
      const [attCols] = await connection.query(
        "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rsvps' AND COLUMN_NAME = 'attendance'",
        [config.db.database],
      );
      if (attCols[0]?.COLUMN_TYPE?.includes('maybe')) {
        await connection.query("UPDATE rsvps SET attendance = 'yes' WHERE attendance = 'maybe'");
        await connection.query("ALTER TABLE rsvps MODIFY COLUMN attendance ENUM('yes', 'no') NOT NULL DEFAULT 'yes'");
        console.log('✓ attendance обновлён: убран "maybe"');
      }
      console.log('· Схема rsvps уже обновлена');
      return;
    }

    // Удаляем старые колонки
    await connection.query('ALTER TABLE rsvps DROP COLUMN contact');
    await connection.query('ALTER TABLE rsvps DROP COLUMN guests');
    await connection.query('ALTER TABLE rsvps DROP COLUMN message');
    console.log('✓ Удалены старые колонки: contact, guests, message');

    // Добавляем новые
    await connection.query("ALTER TABLE rsvps ADD COLUMN pair VARCHAR(120) NULL AFTER name");
    await connection.query("ALTER TABLE rsvps ADD COLUMN children TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER attendance");
    console.log('✓ Добавлены новые колонки: pair, children');

    // Обновляем записи: 'maybe' → 'yes'
    const [affected] = await connection.query("UPDATE rsvps SET attendance = 'yes' WHERE attendance = 'maybe'");
    console.log(`✓ Записи с attendance='maybe' перенесены в 'yes': ${affected.affectedRows}`);

    // Обновляем ENUM attendance — убираем 'maybe'
    const [rows] = await connection.query(
      "SELECT DATA_TYPE, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rsvps' AND COLUMN_NAME = 'attendance'",
      [config.db.database],
    );
    if (rows.length > 0) {
      await connection.query("ALTER TABLE rsvps MODIFY COLUMN attendance ENUM('yes', 'no') NOT NULL DEFAULT 'yes'");
      console.log('✓ attendance обновлён: убран "maybe"');
    }

    console.log('\nМиграция завершена успешно.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Ошибка миграции:', error.message);
  process.exit(1);
});

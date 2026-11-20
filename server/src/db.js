import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here, 'schema.sql');

// Убеждаемся, что директория для БД существует
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const database = new Database(config.dbPath, {
  wal: true,
});

// Включаем WAL-режим для лучшей конкурентности
database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');
database.pragma('synchronous = NORMAL');

// Загружаем схему
const schema = fs.readFileSync(schemaPath, 'utf8');
database.exec(schema);

/**
 * Выполняет SQL-запрос и возвращает массив строк.
 */
function query(sql, params = []) {
  const stmt = database.prepare(sql);
  return stmt.all(...params);
}

/**
 * Выполняет запрос на вставку/обновление/удаление.
 * Возвращает { changes, lastInsertRowid }.
 */
function run(sql, params = []) {
  const stmt = database.prepare(sql);
  return stmt.run(...params);
}

/**
 * Выполняет запрос и возвращает одну строку.
 */
function get(sql, params = []) {
  const stmt = database.prepare(sql);
  return stmt.get(...params);
}

/**
 * Выполняет несколько запросов в транзакции.
 */
function transaction(fn) {
  return database.transaction(fn);
}

/**
 * Асинхронная обёртка поверх синхронного better-sqlite3.
 */
export async function asyncQuery(sql, params = []) {
  return query(sql, params);
}

export async function asyncRun(sql, params = []) {
  return run(sql, params);
}

export async function asyncGet(sql, params = []) {
  return get(sql, params);
}

export async function withTransaction(handler) {
  return transaction(handler)();
}

// Публичный API
export const db = {
  query: asyncQuery,
  run: asyncRun,
  get: asyncGet,
  transaction: withTransaction,
  raw: database,
  close() {
    database.close();
  },
};

// Для обратной совместимости
export const pool = db;
export { asyncQuery as query };

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pair TEXT,
  attendance TEXT NOT NULL DEFAULT 'yes' CHECK(attendance IN ('yes', 'no')),
  children INTEGER NOT NULL DEFAULT 0 CHECK(children >= 0),
  created_at DATETIME NOT NULL DEFAULT (datetime('now'))
);

# Номина — сайт-приглашение на первый день рождения

Адаптивный сайт-приглашение в стиле референса `web-influit.ru/milan_nomina`:
пастельные оттенки, крупная типографика, арка с монограммой, календарь, обратный
отсчёт, программа праздника, дресс-код и форма ответа гостя. Ответы сохраняются
в MySQL и доступны в админке с авторизацией.

**Стек:** React 18 + Vite, Express 4, MySQL 8/9, JWT + bcrypt.

---

## Что внутри

**Приглашение**

- первый экран с «включить музыку» (встроенная генеративная мелодия через Web Audio API);
- анимированное появление секций при скролле, лёгкие декоративные элементы;
- календарь декабря 2026 с отмеченным днём;
- живой обратный отсчёт до торжества;
- адрес ресторана и ссылка на карту;
- программа вечера, дресс-код с палитрой;
- адаптивная анкета гостя: имя, контакт, присутствие, число гостей, пожелания;
- honeypot-защита от ботов и ограничение частоты отправок;
- поддержка своего фото и своего музыкального файла (см. ниже).

**Админка** (`/admin/login`)

- вход по логину и паролю, пароль хранится в MySQL в виде bcrypt-хеша;
- сессия в httpOnly cookie, JWT на 12 часов (настраивается);
- статистика: всего ответов, придут, не смогут, под вопросом, число гостей;
- поиск по имени / контакту / пожеланию, фильтр по статусу;
- карточка гостя с полным сообщением;
- отметка «обработана», удаление с подтверждением;
- выгрузка отфильтрованных записей в CSV (Excel-совместимый, с BOM);
- адаптивная вёрстка: на телефоне таблица превращается в карточки.

---

## Структура

```
one-year/
├─ client/                 React + Vite
│  ├─ public/              фото, музыка, favicon
│  ├─ src/
│  │  ├─ components/       форма, календарь, музыка, декор, отсчёт
│  │  ├─ pages/            Invitation, Login, Admin
│  │  ├─ styles/           base, invitation, admin
│  │  ├─ content.js        ВСЕ ТЕКСТЫ И ДАТЫ ПРИГЛАШЕНИЯ
│  │  ├─ api.js
│  │  └─ App.jsx
│  └─ .env.example
├─ server/                 Express API
│  ├─ scripts/init-db.js   создание БД, таблиц и администратора
│  ├─ src/
│  │  ├─ routes/           auth, rsvp, admin
│  │  ├─ middleware/auth.js
│  │  ├─ schema.sql
│  │  ├─ config.js
│  │  └─ index.js
│  ├─ .env                 локальные настройки (не коммитится)
│  └─ .env.example
└─ package.json            общие команды
```

---

## Быстрый старт

Требования: **Node.js 20+**, запущенный **MySQL 8+**. Проверено на Node 26 и MySQL 9.

```bash
# 1. зависимости (корень + сервер + клиент)
npm run install:all

# 2. настройки сервера
#    скопируйте server/.env.example в server/.env и при необходимости
#    поправьте DB_USER / DB_PASSWORD / JWT_SECRET
#    (в репозитории уже есть готовый server/.env для локального MySQL с root без пароля)

# 3. база данных, таблицы и администратор
npm run db:init

# 4. запуск: API :4000 + Vite :5173
npm run dev
```

Откройте:

- приглашение — http://localhost:5173
- админка — http://localhost:5173/admin/login

**Доступ по умолчанию:** логин `admin`, пароль `admin12345`.

> Смените пароль в `server/.env` (`ADMIN_LOGIN`, `ADMIN_PASSWORD`) и повторно
> выполните `npm run db:init` — пароль администратора обновится. Для реального
> использования обязательно задайте длинный случайный `JWT_SECRET`.

### Демо-записи

При `SEED_DEMO=true` (по умолчанию) `db:init` добавляет 4 демонстрационных ответа,
только если таблица пуста. Очистить их:

```sql
USE one_year_invitation;
DELETE FROM rsvps;
```

Поставьте `SEED_DEMO=false` в `server/.env`, чтобы больше их не добавлять.

---

## Продакшен

```bash
npm run build          # собирает client/dist
# NODE_ENV=production в server/.env
npm start              # Express отдаёт API и собранный React на http://localhost:4000
```

Express раздаёт `client/dist` и SPA-маршруты, поэтому фронтенд и API находятся
на одном домене — cookie авторизации работает без дополнительных настроек.

Если сайт открывается по HTTPS, включите в `server/.env`:

```env
NODE_ENV=production
COOKIE_SECURE=true
```

Если Express стоит за reverse proxy (nginx, Caddy), укажите `TRUST_PROXY=1`,
чтобы корректно работали ограничения по IP.

---

## Как менять контент

Почти всё содержимое собрано в одном файле:

```
client/src/content.js
```

Там: имя ребёнка, возраст, родители, дата и время, адрес и ссылка на карту,
программа, телефоны, текст дресс-кода, палитра, дедлайн ответа.

### Своё фото

В проекте уже есть фото для арки — `client/public/images/portrait.jpg`.
Чтобы заменить его, просто положите свой файл с тем же именем (или укажите
другой путь в `client/.env`):

```env
VITE_PORTRAIT_URL=/images/portrait.jpg
```

Если фото нет или оно не загрузилось, на первом экране автоматически
появляется элегантная монограмма.

### Своя музыка

1. Положите файл в `client/public/audio/` (например, `music.mp3`).
2. В `client/.env`:

```env
VITE_MUSIC_SRC=/audio/music.mp3
```

Пока файл не указан, кнопка запускает тихую мелодию, синтезированную в браузере
(без внешних файлов и без автозапуска — только по нажатию, как требуют браузеры).

---

## API

Все ответы — JSON. Авторизация админки — httpOnly cookie `invite_admin`
(также принимается `Authorization: Bearer <token>`).

| Метод | Маршрут | Доступ | Описание |
|---|---|---|---|
| GET | `/api/health` | все | проверка сервера |
| POST | `/api/rsvp` | все | отправить анкету гостя |
| POST | `/api/auth/login` | все | вход (`login`, `password`) |
| GET | `/api/auth/me` | админ | текущий администратор |
| POST | `/api/auth/logout` | все | выход |
| GET | `/api/admin/rsvps?status=&q=&page=&limit=` | админ | список + статистика |
| GET | `/api/admin/rsvps/export?status=&q=` | админ | CSV-выгрузка |
| PATCH | `/api/admin/rsvps/:id` | админ | статус `new` / `processed` |
| DELETE | `/api/admin/rsvps/:id` | админ | удалить запись |

Поля анкеты: `name` (2–120), `contact` (5–160), `attendance` (`yes`/`no`/`maybe`),
`guests` (1–10; для `no` сохраняется 0), `message` (до 1000).

Защита: bcrypt (12 раундов), JWT, httpOnly + SameSite=Lax cookie, ограничение
попыток входа (10 за 15 минут), лимит запросов к API, honeypot и лимит отправок
формы, параметризованные SQL-запросы, экранирование CSV.

### Таблицы

```sql
admins(id, login UNIQUE, password_hash, created_at)

rsvps(
  id, name, contact,
  attendance ENUM('yes','no','maybe'),
  guests TINYINT, message TEXT,
  status ENUM('new','processed') DEFAULT 'new',
  created_at, updated_at
)
```

Схема лежит в `server/src/schema.sql`; `npm run db:init` создаёт базу
`one_year_invitation` (имя задаётся в `DB_NAME`) и применяет её.

---

## Настройки (`server/.env`)

| Переменная | По умолчанию | Назначение |
|---|---|---|
| `PORT` | `4000` | порт API |
| `DB_HOST` / `DB_PORT` | `127.0.0.1` / `3306` | MySQL |
| `DB_USER` / `DB_PASSWORD` | `root` / пусто | доступ к MySQL |
| `DB_NAME` | `one_year_invitation` | имя базы |
| `JWT_SECRET` | dev-значение | секрет подписи токена |
| `SESSION_HOURS` | `12` | срок жизни сессии |
| `ADMIN_LOGIN` / `ADMIN_PASSWORD` | `admin` / `admin12345` | администратор для `db:init` |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS для dev |
| `COOKIE_SECURE` | `false` | `true` только под HTTPS |
| `SEED_DEMO` | `true` | демо-записи при инициализации |

---

## Возможные проблемы

- **`Access denied for user 'root'@'localhost'`** — укажите верные `DB_USER` и
  `DB_PASSWORD` в `server/.env`, затем снова `npm run db:init`.
- **`ECONNREFUSED 3306`** — не запущен MySQL. Windows: `Get-Service MySQL | Start-Service`.
- **Порт занят** — поменяйте `PORT` в `server/.env` и `target` прокси в
  `client/vite.config.js`.
- **Не устанавливается cookie в проде** — при HTTPS включите `COOKIE_SECURE=true`;
  при HTTP оставьте `false`.
- **Не загрузились шрифты** — сайт использует Google Fonts (Cormorant Garamond,
  Montserrat, Marck Script). Без интернета сработают системные запасные шрифты.

---

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run install:all` | ставит зависимости во все три `package.json` |
| `npm run db:init` | создаёт БД, таблицы, администратора и демо-записи |
| `npm run dev` | API с `--watch` + Vite dev server |
| `npm run build` | production-сборка клиента в `client/dist` |
| `npm start` | Express отдаёт API и собранный клиент |

Сделано с любовью · 2026

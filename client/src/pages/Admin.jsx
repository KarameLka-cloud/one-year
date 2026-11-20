import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

const LIMIT = 10;

const ATTENDANCE = {
  yes: { label: 'Придёт', className: 'yes' },
  no: { label: 'Не придёт', className: 'no' },
};

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}

function pluralChildren(count) {
  const abs = Math.abs(count) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return 'детей';
  if (last === 1) return 'ребёнок';
  if (last >= 2 && last <= 4) return 'ребёнка';
  return 'детей';
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function TableSkeleton() {
  return (
    <div className="records__skeleton" aria-label="Загрузка записей">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="records__skeleton-row" key={index}>
          <span style={{ width: '26%' }} />
          <span style={{ width: '18%' }} />
          <span style={{ width: '12%' }} />
          <span style={{ width: '16%' }} />
          <span style={{ width: '12%' }} />
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState('checking');
  const [adminLogin, setAdminLogin] = useState('');
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const mounted = useRef(true);

  const goToLogin = useCallback(() => {
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    mounted.current = true;
    api
      .get('/auth/me')
      .then((data) => {
        if (!mounted.current) return;
        setAdminLogin(data.admin?.login || '');
        setAuth('ok');
      })
      .catch(() => {
        if (mounted.current) goToLogin();
      });
    return () => {
      mounted.current = false;
    };
  }, [goToLogin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (auth !== 'ok') return undefined;
    let active = true;
    setLoading(true);
    setError('');

    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set('q', search);

    api
      .get(`/admin/rsvps?${params.toString()}`)
      .then((data) => {
        if (!active) return;
        setItems(data.items);
        setTotal(data.total);
        setStats(data.stats);
        if (data.items.length === 0 && page > 1) setPage((value) => value - 1);
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 401) {
          goToLogin();
          return;
        }
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [auth, page, search, reloadKey, goToLogin]);

  useEffect(() => {
    if (!actionError) return undefined;
    const timer = setTimeout(() => setActionError(''), 5000);
    return () => clearTimeout(timer);
  }, [actionError]);

  useEffect(() => {
    if (!selected && !toDelete) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelected(null);
        setToDelete(null);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selected, toDelete]);

  const totalPages = Math.max(Math.ceil(total / LIMIT), 1);
  const currentStats = stats || { total: 0, totalAdults: 0, totalChildren: 0, totalPeople: 0, comingTotal: 0, notComing: 0, unread: 0 };

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Всё равно уводим на страницу входа.
    }
    goToLogin();
  }

  function openRecord(record) {
    setSelected(record);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setActionError('');
    try {
      await api.del(`/admin/rsvps/${toDelete.id}`);
      setToDelete(null);
      setSelected(null);
      setReloadKey((value) => value + 1);
    } catch (err) {
      if (err.status === 401) {
        goToLogin();
        return;
      }
      setActionError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  async function exportCsv() {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    try {
      await api.download(
        `/admin/rsvps/export${params.toString() ? `?${params.toString()}` : ''}`,
        `rsvps-${new Date().toISOString().slice(0, 10)}.csv`,
      );
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (auth !== 'ok') {
    return (
      <div className="admin-loading" role="status" aria-live="polite">
        <span className="admin-loading__mark">Н</span>
        <span className="admin-loading__text">проверяем доступ…</span>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="admin__header-inner">
          <Link to="/" className="admin__brand">
            <span className="admin__brand-mark">Н</span>
            <span className="admin__brand-text">
              <strong>Аяна</strong>
              <small>панель организатора</small>
            </span>
          </Link>
          <div className="admin__user">
            <span className="admin__user-login" title="Вы вошли как">
              {adminLogin}
            </span>
            <button type="button" className="admin__logout" onClick={logout}>
              выйти
            </button>
          </div>
        </div>
      </header>

      <main className="admin__main">
        <div className="admin__title-row">
          <div>
            <p className="eyebrow">гости и ответы</p>
            <h1>записи с приглашения</h1>
          </div>
          <div className="admin__title-actions">
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => setReloadKey((value) => value + 1)}
            >
              обновить
            </button>
            <button type="button" className="btn btn--primary btn--small" onClick={exportCsv}>
              скачать CSV
            </button>
          </div>
        </div>

        <div className="stats">
          <article className="stat stat--dark">
            <p className="stat__label">всего ответов</p>
            <strong className="stat__value">{currentStats.total}</strong>
            <p className="stat__note">
              все обработаны
            </p>
          </article>
          <article className="stat stat--sage">
            <p className="stat__label">всего человек</p>
            <strong className="stat__value">{currentStats.totalPeople}</strong>
            <p className="stat__note">
              {currentStats.totalAdults} взрослых и {currentStats.totalChildren} {pluralChildren(currentStats.totalChildren)}
            </p>
          </article>
          <article className="stat stat--blush">
            <p className="stat__label">смогут</p>
            <strong className="stat__value">{currentStats.comingTotal}</strong>
            <p className="stat__note">
              {currentStats.comingAdults} взрослых и {currentStats.comingChildren} {pluralChildren(currentStats.comingChildren)}
            </p>
          </article>
          <article className="stat stat--gold">
            <p className="stat__label">не смогут</p>
            <strong className="stat__value">{currentStats.notComing}</strong>
            <p className="stat__note">обязательно обнимем при встрече</p>
          </article>
        </div>

        <section className="records">
          <div className="records__toolbar">
            <div className="admin-search">
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Имя или пара…"
                aria-label="Поиск по записям"
              />
              {query && (
                <button
                  type="button"
                  className="admin-search__clear"
                  onClick={() => setQuery('')}
                  aria-label="Очистить поиск"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {actionError && (
            <div className="admin-alert" role="alert">
              <span>{actionError}</span>
              <button type="button" onClick={() => setActionError('')} aria-label="Закрыть">
                ×
              </button>
            </div>
          )}

          {error ? (
            <div className="records__state">
              <p className="records__state-title">не удалось загрузить записи</p>
              <p className="records__state-text">{error}</p>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => setReloadKey((value) => value + 1)}
              >
                попробовать снова
              </button>
            </div>
          ) : loading ? (
            <TableSkeleton />
          ) : items.length === 0 ? (
            <div className="records__state">
              <span className="records__state-mark">Н</span>
              <p className="records__state-title">пока нет ответов</p>
              <p className="records__state-text">
                {search
                  ? 'По выбранным условиям ничего не найдено. Попробуйте изменить фильтр.'
                  : 'Как только гости заполнят анкету, их ответы появятся здесь.'}
              </p>
              {(search) && (
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => {
                    setQuery('');
                  }}
                >
                  сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            <div className="records__table-wrap">
              <table className="records__table">
                <thead>
                  <tr>
                    <th>гость</th>
                    <th>пара</th>
                    <th>присутствие</th>
                    <th>детей</th>
                    <th>дата ответа</th>
                    <th aria-label="Действия" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((record) => (
                    <tr key={record.id} onClick={() => openRecord(record)}>
                      <td data-label="Гость">
                        <span className="guest">
                          <strong>{record.name}</strong>
                        </span>
                      </td>
                      <td data-label="Пара">
                        <span className="guest">
                          {record.pair || '—'}
                        </span>
                      </td>
                      <td data-label="Присутствие">
                        <span className={`badge badge--${ATTENDANCE[record.attendance].className}`}>
                          {ATTENDANCE[record.attendance].label}
                        </span>
                      </td>
                      <td data-label="Детей">
                        <span className="guests-count">{record.children > 0 ? record.children : '—'}</span>
                      </td>
                      <td data-label="Дата ответа">
                        <span className="record-date">{formatDate(record.createdAt)}</span>
                      </td>
                      <td data-label="Действия">
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={(event) => {
                              event.stopPropagation();
                              openRecord(record);
                            }}
                            aria-label={`Открыть запись ${record.name}`}
                          >
                            <EyeIcon />
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            onClick={(event) => {
                              event.stopPropagation();
                              setToDelete(record);
                            }}
                            aria-label={`Удалить запись ${record.name}`}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {total > 0 && (
            <div className="records__footer">
              <span className="records__count">
                всего {total} {total === 1 ? 'запись' : total < 5 ? 'записи' : 'записей'}
              </span>
              <div className="pagination">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(value - 1, 1))}
                  disabled={page <= 1}
                  aria-label="Предыдущая страница"
                >
                  ←
                </button>
                <span>
                  {page} <small>/ {totalPages}</small>
                </span>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
                  disabled={page >= totalPages}
                  aria-label="Следующая страница"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {selected && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="record-title" onClick={() => setSelected(null)}>
          <div className="modal__card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal__close"
              onClick={() => setSelected(null)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <p className="eyebrow">ответ гостя</p>
            <h2 id="record-title">{selected.name}</h2>
            <div className="modal__chips">
              <span className={`badge badge--${ATTENDANCE[selected.attendance].className}`}>
                {ATTENDANCE[selected.attendance].label}
              </span>
              <span className="modal__chip">
                {selected.children > 0
                  ? `${selected.children} ${pluralChildren(selected.children)}`
                  : 'без детей'}
              </span>
            </div>
            <dl className="modal__list">
              <div>
                <dt>ФИО пары</dt>
                <dd className={selected.pair ? '' : 'is-empty'}>
                  {selected.pair || 'Не указано'}
                </dd>
              </div>
              <div>
                <dt>дата ответа</dt>
                <dd>{formatDate(selected.createdAt)}</dd>
              </div>
            </dl>
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={() => {
                  setToDelete(selected);
                  setSelected(null);
                }}
              >
                удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {toDelete && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title" onClick={() => setToDelete(null)}>
          <div className="modal__card modal__card--small" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow">удаление</p>
            <h2 id="delete-title">удалить запись?</h2>
            <p className="modal__text">
              Ответ гостя <strong>{toDelete.name}</strong> будет удалён без возможности
              восстановления.
            </p>
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => setToDelete(null)}
                disabled={deleting}
              >
                отмена
              </button>
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'удаляем…' : 'удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

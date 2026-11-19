import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { Sparkle } from '../components/Decor.jsx';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get('/auth/me')
      .then(() => {
        if (active) navigate('/admin', { replace: true });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.login.trim() || !form.password) {
      setError('Введите логин и пароль');
      return;
    }

    setBusy(true);
    setError('');

    try {
      await api.post('/auth/login', {
        login: form.login.trim(),
        password: form.password,
      });
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__bg" aria-hidden="true">
        <span className="auth__blob auth__blob--one" />
        <span className="auth__blob auth__blob--two" />
        <span className="auth__blob auth__blob--three" />
      </div>

      <div className="auth__card">
        <aside className="auth__art">
          <span className="auth__art-label eyebrow">для своих</span>
          <span className="auth__monogram" aria-hidden="true">
            Н
          </span>
          <p className="auth__script script">номина</p>
          <p className="auth__art-note">
            первый день рождения
            <br />
            06 . 12 . 2026
          </p>
          <Sparkle size={18} className="auth__art-spark auth__art-spark--one" />
          <Sparkle size={11} className="auth__art-spark auth__art-spark--two" />
        </aside>

        <div className="auth__form">
          <Link className="auth__back" to="/">
            <span aria-hidden="true">←</span> к приглашению
          </Link>
          <p className="eyebrow">панель организатора</p>
          <h1>вход в админку</h1>
          <p className="auth__hint">
            Здесь собраны ответы гостей. Введите данные, чтобы посмотреть записи.
          </p>

          <form className="auth__form-fields" onSubmit={handleSubmit}>
            <label className="field" htmlFor="login">
              <span className="field__label">логин</span>
              <input
                id="login"
                type="text"
                value={form.login}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, login: event.target.value }));
                  setError('');
                }}
                placeholder="admin"
                autoComplete="username"
                autoFocus
                maxLength={64}
              />
            </label>

            <label className="field" htmlFor="password">
              <span className="field__label">пароль</span>
              <span className="field__password">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, password: event.target.value }));
                    setError('');
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  maxLength={128}
                />
                <button
                  type="button"
                  className="field__eye"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? 'скрыть' : 'показать'}
                </button>
              </span>
            </label>

            {error && (
              <p className="form__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn--primary auth__submit" disabled={busy}>
              {busy ? 'входим…' : 'войти'}
            </button>
          </form>

          <p className="auth__footer-note">Доступ только для организаторов праздника</p>
        </div>
      </div>
    </div>
  );
}

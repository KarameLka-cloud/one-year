import { useState } from 'react';
import { api } from '../api.js';
import { CheckIcon } from './Decor.jsx';

const ATTENDANCE_OPTIONS = [
  { value: 'yes', label: 'буду с радостью' },
  { value: 'no', label: 'к сожалению, не смогу' },
  { value: 'maybe', label: 'пока не уверен(а)' },
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6];

function guestsLabel(count) {
  const abs = Math.abs(count) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return 'гостей';
  if (last === 1) return 'гость';
  if (last >= 2 && last <= 4) return 'гостя';
  return 'гостей';
}

const initialForm = {
  name: '',
  contact: '',
  attendance: 'yes',
  guests: '1',
  message: '',
  company: '', // honeypot
};

export function RsvpForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverError, setServerError] = useState('');

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Напишите, пожалуйста, ваше имя';
    if (form.contact.trim().length < 5)
      nextErrors.contact = 'Оставьте телефон или ник в мессенджере';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus('sending');
    setServerError('');

    try {
      await api.post('/rsvp', {
        ...form,
        guests: Number(form.guests),
        message: form.message.trim(),
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setServerError(error.message);
      if (error.fields) setErrors(error.fields);
    }
  }

  function reset() {
    setForm(initialForm);
    setErrors({});
    setServerError('');
    setStatus('idle');
  }

  if (status === 'success') {
    return (
      <div className="rsvp-card rsvp-card--success" role="status" aria-live="polite">
        <span className="rsvp-success__icon">
          <CheckIcon size={34} />
        </span>
        <p className="eyebrow">ответ получен</p>
        <h3 className="rsvp-success__title">спасибо!</h3>
        <p className="rsvp-success__text">
          Мы получили ваш ответ и уже с нетерпением ждём встречи. Если что-то изменится — просто
          напишите нам.
        </p>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          отправить ещё один ответ
        </button>
      </div>
    );
  }

  return (
    <div className="rsvp-card">
      <div className="rsvp-card__head">
        <p className="eyebrow">ответьте, пожалуйста</p>
        <h3>анкета гостя</h3>
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__row">
          <label className={`field${errors.name ? ' has-error' : ''}`} htmlFor="rsvp-name">
            <span className="field__label">ваше имя</span>
            <input
              id="rsvp-name"
              type="text"
              name="name"
              value={form.name}
              onChange={update('name')}
              placeholder="Имя и фамилия"
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </label>

          <label className={`field${errors.contact ? ' has-error' : ''}`} htmlFor="rsvp-contact">
            <span className="field__label">телефон или мессенджер</span>
            <input
              id="rsvp-contact"
              type="text"
              name="contact"
              value={form.contact}
              onChange={update('contact')}
              placeholder="+7 ··· / Telegram / MAX"
              autoComplete="tel"
              maxLength={160}
              aria-invalid={Boolean(errors.contact)}
            />
            {errors.contact && <span className="field__error">{errors.contact}</span>}
          </label>
        </div>

        <fieldset className="field field--choices">
          <legend className="field__label">сможете присоединиться?</legend>
          <div className="choices">
            {ATTENDANCE_OPTIONS.map((option) => (
              <label className="choice" key={option.value}>
                <input
                  type="radio"
                  name="attendance"
                  value={option.value}
                  checked={form.attendance === option.value}
                  onChange={update('attendance')}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {form.attendance !== 'no' && (
          <label className="field field--narrow" htmlFor="rsvp-guests">
            <span className="field__label">сколько вас будет?</span>
            <select id="rsvp-guests" name="guests" value={form.guests} onChange={update('guests')}>
              {GUEST_OPTIONS.map((count) => (
                <option value={count} key={count}>
                  {count} {guestsLabel(count)}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="field field--full" htmlFor="rsvp-message">
          <span className="field__label">пожелания или тёплые слова</span>
          <textarea
            id="rsvp-message"
            name="message"
            value={form.message}
            onChange={update('message')}
            placeholder="Например, нужен детский стульчик или вы приедете с малышом…"
            rows={4}
            maxLength={600}
          />
          <span className="field__counter">{form.message.length}/600</span>
        </label>

        <label className="hp" aria-hidden="true" tabIndex={-1}>
          <span>Не заполняйте это поле</span>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={update('company')}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>

        {serverError && (
          <p className="form__error" role="alert">
            {serverError}
          </p>
        )}

        <div className="form__footer">
          <button type="submit" className="btn btn--primary form__submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'отправляем…' : 'отправить ответ'}
          </button>
          <p className="form__note">
            Нажимая «отправить», вы соглашаетесь на обработку указанных данных — только для
            организации праздника.
          </p>
        </div>
      </form>
    </div>
  );
}

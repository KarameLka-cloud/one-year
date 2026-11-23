(() => {
  'use strict';

  const form = document.getElementById('rsvp-form');
  if (!form) return;

  const formCard = document.getElementById('rsvp-form-card');
  const successCard = document.getElementById('rsvp-success-card');
  const submit = document.getElementById('rsvp-submit');
  const serverError = document.getElementById('rsvp-server-error');
  const again = document.getElementById('rsvp-again');
  const csrf = document.querySelector('meta[name="csrf-token"]');

  const nameInput = form.querySelector('#rsvp-name');
  const pairInput = form.querySelector('#rsvp-pair');
  const childrenField = form.querySelector('[data-children-field]');
  const childrenSelect = form.querySelector('#rsvp-children');

  function errorNode(field) {
    return form.querySelector(`[data-error-for="${field}"]`);
  }

  function clearErrors() {
    if (serverError) {
      serverError.hidden = true;
      serverError.textContent = '';
    }

    form.querySelectorAll('[data-error-for]').forEach((node) => {
      node.hidden = true;
      node.textContent = '';
    });

    form.querySelectorAll('.field.has-error').forEach((node) => {
      node.classList.remove('has-error');
    });

    if (nameInput) nameInput.setAttribute('aria-invalid', 'false');
  }

  function showFieldError(field, message) {
    const node = errorNode(field);
    if (node) {
      node.textContent = message;
      node.hidden = false;
    }

    const input = form.querySelector(`[name="${field}"]`);
    const label = input ? input.closest('.field') : null;
    if (label) label.classList.add('has-error');
    if (field === 'name' && nameInput) nameInput.setAttribute('aria-invalid', 'true');
  }

  function showServerError(message) {
    if (!serverError) return;
    serverError.textContent = message;
    serverError.hidden = false;
  }

  function syncChildrenField() {
    const checked = form.querySelector('input[name="attendance"]:checked');
    const attending = !checked || checked.value === 'yes';
    if (childrenField) childrenField.hidden = !attending;
  }

  form.querySelectorAll('input[name="attendance"]').forEach((radio) => {
    radio.addEventListener('change', syncChildrenField);
  });
  syncChildrenField();

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      nameInput.classList.remove('is-invalid');
      const node = errorNode('name');
      if (node) {
        node.hidden = true;
        node.textContent = '';
      }
      nameInput.closest('.field')?.classList.remove('has-error');
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const name = nameInput ? nameInput.value.trim() : '';
    const pair = pairInput ? pairInput.value.trim() : '';

    if (name.length < 2) {
      showFieldError('name', 'Напишите, пожалуйста, ваше имя');
      if (nameInput) nameInput.focus();
      return;
    }

    const data = new FormData(form);
    data.set('name', name);
    data.set('pair', pair);

    if (submit) {
      submit.disabled = true;
      submit.textContent = 'отправляем…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrf ? csrf.content : '',
        },
        body: data,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (payload?.fields) {
          Object.entries(payload.fields).forEach(([field, message]) => {
            showFieldError(field, Array.isArray(message) ? message[0] : String(message));
          });
          const firstInvalid = form.querySelector('.field.has-error input');
          if (firstInvalid) firstInvalid.focus();
        }

        showServerError(payload?.error || `Ошибка запроса (${response.status})`);
        return;
      }

      if (formCard) formCard.hidden = true;
      if (successCard) successCard.hidden = false;
    } catch {
      showServerError('Не удалось отправить ответ. Проверьте соединение и попробуйте снова.');
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = 'отправить ответ';
      }
    }
  });

  if (again) {
    again.addEventListener('click', (event) => {
      event.preventDefault();
      clearErrors();
      form.reset();

      const yes = form.querySelector('input[name="attendance"][value="yes"]');
      if (yes) yes.checked = true;
      if (childrenSelect) childrenSelect.value = '0';
      syncChildrenField();

      if (successCard) successCard.hidden = true;
      if (formCard) formCard.hidden = false;

      if (nameInput) {
        nameInput.setAttribute('aria-invalid', 'false');
        nameInput.focus();
      }
    });
  }
})();

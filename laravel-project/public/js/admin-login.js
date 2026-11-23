(() => {
  'use strict';

  const toggle = document.getElementById('password-toggle');
  const input = document.getElementById('password');
  const form = document.getElementById('login-form');
  const submit = document.getElementById('login-submit');

  if (toggle && input) {
    toggle.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.textContent = show ? 'скрыть' : 'показать';
      toggle.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
  }

  if (form && submit) {
    form.addEventListener('submit', () => {
      submit.disabled = true;
      submit.textContent = 'входим…';
    });
  }
})();

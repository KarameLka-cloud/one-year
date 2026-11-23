(() => {
  'use strict';

  const csrf = document.querySelector('meta[name="csrf-token"]');

  function pluralChildren(count) {
    const abs = Math.abs(count) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return 'детей';
    if (last === 1) return 'ребёнок';
    if (last >= 2 && last <= 4) return 'ребёнка';
    return 'детей';
  }

  /*
   * Живой поиск: отправляем GET-форму после паузы в наборе.
   */
  const searchForm = document.getElementById('admin-search-form');
  const searchInput = document.getElementById('admin-search-input');
  const searchClear = document.getElementById('admin-search-clear');

  if (searchForm && searchInput) {
    let timer = null;

    searchInput.addEventListener('input', () => {
      if (searchClear) searchClear.hidden = searchInput.value === '';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => searchForm.requestSubmit(), 350);
    });

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.hidden = true;
        searchForm.requestSubmit();
      });
    }
  }

  const recordModal = document.getElementById('record-modal');
  const deleteModal = document.getElementById('delete-modal');
  if (!recordModal || !deleteModal) return;

  const recordTitle = document.getElementById('record-title');
  const recordAttendance = document.getElementById('record-attendance');
  const recordChildren = document.getElementById('record-children');
  const recordPair = document.getElementById('record-pair');
  const recordDate = document.getElementById('record-date');
  const recordDelete = document.getElementById('record-delete');
  const deleteText = document.getElementById('delete-text');
  const deleteForm = document.getElementById('delete-form');
  const deleteError = document.getElementById('delete-error');
  const deleteSubmit = document.getElementById('delete-submit');

  let currentRecord = null;

  function syncBodyLock() {
    const open = !recordModal.hidden || !deleteModal.hidden;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function show(modal) {
    modal.hidden = false;
    syncBodyLock();
  }

  function hide(modal) {
    modal.hidden = true;
    syncBodyLock();
  }

  function fillRecord(record) {
    if (recordTitle) recordTitle.textContent = record.name;
    if (recordPair) {
      recordPair.textContent = record.pair || 'Не указано';
      recordPair.classList.toggle('is-empty', !record.pair);
    }
    if (recordDate) recordDate.textContent = record.createdAtLabel || '—';
    if (recordAttendance) {
      const comes = record.attendance === 'yes';
      recordAttendance.className = `badge badge--${comes ? 'yes' : 'no'}`;
      recordAttendance.textContent = comes ? 'Придёт' : 'Не придёт';
    }
    if (recordChildren) {
      recordChildren.textContent = record.children > 0
        ? `${record.children} ${pluralChildren(record.children)}`
        : 'без детей';
    }
  }

  function openRecord(record) {
    currentRecord = record;
    fillRecord(record);
    hide(deleteModal);
    show(recordModal);
  }

  function openDelete(record) {
    currentRecord = record;
    if (deleteText) {
      deleteText.textContent = `Ответ гостя «${record.name}» будет удалён без возможности восстановления.`;
    }
    if (deleteForm) deleteForm.action = record.deleteUrl;
    if (deleteError) {
      deleteError.hidden = true;
      deleteError.textContent = '';
    }
    hide(recordModal);
    show(deleteModal);
  }

  document.querySelectorAll('tr[data-record]').forEach((row) => {
    let record = null;
    try {
      record = JSON.parse(row.dataset.record || '{}');
    } catch {
      record = null;
    }
    if (!record) return;

    row.addEventListener('click', () => openRecord(record));

    row.querySelectorAll('[data-record-open]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        openRecord(record);
      });
    });

    row.querySelectorAll('[data-record-delete]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        openDelete(record);
      });
    });
  });

  if (recordDelete) {
    recordDelete.addEventListener('click', () => {
      if (currentRecord) openDelete(currentRecord);
    });
  }

  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
      hide(button.closest('.modal'));
    });
  });

  [recordModal, deleteModal].forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) hide(modal);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    hide(recordModal);
    hide(deleteModal);
  });

  if (deleteForm) {
    deleteForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (deleteError) {
        deleteError.hidden = true;
        deleteError.textContent = '';
      }

      if (deleteSubmit) {
        deleteSubmit.disabled = true;
        deleteSubmit.textContent = 'удаляем…';
      }

      try {
        const response = await fetch(deleteForm.action, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrf ? csrf.content : '',
          },
          body: new FormData(deleteForm),
        });

        if (response.ok) {
          window.location.reload();
          return;
        }

        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Не удалось удалить запись');
      } catch (error) {
        if (deleteError) {
          deleteError.textContent = error.message || 'Не удалось удалить запись';
          deleteError.hidden = false;
        }
      } finally {
        if (deleteSubmit) {
          deleteSubmit.disabled = false;
          deleteSubmit.textContent = 'удалить';
        }
      }
    });
  }
})();

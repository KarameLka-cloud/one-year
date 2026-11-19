const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  const type = response.headers.get('content-type') || '';
  const data = type.includes('application/json')
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    const error = new Error(data?.error || `Ошибка запроса (${response.status})`);
    error.status = response.status;
    error.fields = data?.fields || null;
    throw error;
  }

  return data;
}

export const api = {
  get(path) {
    return request(path);
  },
  post(path, body) {
    return request(path, { method: 'POST', body: JSON.stringify(body ?? {}) });
  },
  patch(path, body) {
    return request(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) });
  },
  del(path) {
    return request(path, { method: 'DELETE' });
  },
  async download(path, fallbackName = 'export.csv') {
    const response = await fetch(`${BASE}${path}`, { credentials: 'include' });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error || 'Не удалось скачать файл');
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fallbackName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};

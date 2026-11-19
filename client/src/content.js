// Все данные приглашения — в одном месте.
// Меняйте имена, дату, адрес и программу под себя.

export const content = {
  name: 'Номина',
  monogram: 'Н',
  age: '1 год',
  eventTitle: 'первый день рождения',
  parents: 'баир и туяна',
  parentsShort: 'Баир и Туяна',

  // Фото для арки на первом экране. Можно заменить файл
  // client/public/images/portrait.jpg или указать свой путь в client/.env
  // (VITE_PORTRAIT_URL=/images/portrait.jpg). Если файла нет — покажется монограмма.
  photo: import.meta.env.VITE_PORTRAIT_URL || '/images/portrait.jpg',

  date: {
    iso: '2026-12-06T15:00:00+08:00',
    day: '06',
    month: 'декабря',
    year: '2026',
    weekday: 'воскресенье',
    time: '15:00',
    short: '06 . 12 . 2026',
  },

  venue: {
    label: 'ресторан',
    name: '«Бурятия»',
    address: 'Коммунистическая ул., 47А',
    city: 'Улан-Удэ',
    mapUrl:
      'https://yandex.ru/maps/?text=%D0%A3%D0%BB%D0%B0%D0%BD-%D0%A3%D0%B4%D1%8D%2C%20%D0%9A%D0%BE%D0%BC%D0%BC%D1%83%D0%BD%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2C%2047%D0%90',
  },

  program: [
    {
      time: '15:00',
      title: 'сбор гостей',
      text: 'welcome-напитки, объятия и первые фотографии',
      icon: 'glass',
    },
    {
      time: '16:00',
      title: 'начало праздника',
      text: 'поздравления, тёплые слова и праздничный ужин',
      icon: 'star',
    },
    {
      time: '20:00',
      title: 'подача торта',
      text: 'самый сладкий момент — задуваем первую свечу',
      icon: 'cake',
    },
  ],

  contacts: [
    { label: '+7 (901) 324-89-99', href: 'tel:+79013248999' },
    { label: '+7 (900) 624-30-88', href: 'tel:+79006243088' },
  ],

  dressCode:
    'Никаких строгих ограничений нет. Но мы будем очень рады видеть вас в нарядных и праздничных образах.',

  palette: [
    { name: 'пудровый', color: '#e3bdb5' },
    { name: 'кремовый', color: '#f6e8d8' },
    { name: 'шалфей', color: '#c6d0ba' },
    { name: 'золото', color: '#c9a978' },
    { name: 'какао', color: '#8a6f60' },
  ],

  rsvpDeadline: '25 ноября',
};

export const DATE_TARGET = new Date(content.date.iso);

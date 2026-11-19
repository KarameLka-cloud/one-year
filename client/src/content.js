// Все данные приглашения — в одном месте.
// Меняйте имена, дату, адрес и программу под себя.

export const content = {
  name: "Аяна",
  monogram: "Н",
  age: "1 год",
  eventTitle: "первый день рождения",
  parents: "Олег и Дулма",
  parentsShort: "Олег и Дулма",

  // Фото для арки на первом экране. Можно заменить файл
  // client/public/images/portrait.jpg или указать свой путь в client/.env
  // (VITE_PORTRAIT_URL=/images/portrait.jpg). Если файла нет — покажется монограмма.
  photo: import.meta.env.VITE_PORTRAIT_URL || "/images/portrait.jpg",

  date: {
    iso: "2027-02-26T14:00:00+08:00",
    day: "26",
    month: "февраль",
    year: "2027",
    weekday: "пятница",
    time: "14:00",
    short: "26 . 02 . 2027",
  },

  venue: {
    label: "ресторан",
    name: "«У Истока»",
    address: "Ржанова ул., 43",
    city: "Иркутск",
    mapUrl:
      "https://yandex.ru/maps/?um=constructor%3A67cb8e593cfe9ea4410a75fc2773767ac68d0c15a144e02a3e09da4326ab5467&source=constructorLink",
  },

  program: [
    {
      time: "14:00",
      title: "сбор гостей",
      // text: "welcome-напитки, объятия и первые фотографии",
      icon: "glass",
    },
    {
      time: "15:00",
      title: "начало банкета",
      // text: "поздравления, тёплые слова и праздничный ужин",
      icon: "star",
    },
    {
      time: "20:00",
      title: "подача торта",
      // text: "самый сладкий момент — задуваем первую свечу",
      icon: "cake",
    },
  ],

  contacts: [
    { label: "+7 (929) 485-90-11", href: "tel:+79294859011" },
  ],

  dressCode:
    "Никаких строгих ограничений нет. Но мы будем очень рады видеть вас в нарядных и праздничных образах.",

  palette: [
    { name: "пудровый", color: "#e3bdb5" },
    { name: "кремовый", color: "#f6e8d8" },
    { name: "шалфей", color: "#c6d0ba" },
    { name: "золото", color: "#c9a978" },
    { name: "какао", color: "#8a6f60" },
  ],

  rsvpDeadline: "08 февраля",
};

export const DATE_TARGET = new Date(content.date.iso);

const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export function Calendar({ year, month, eventDay }) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7; // неделя начинается с понедельника
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className="calendar" role="group" aria-label={`Календарь на ${month + 1} месяц ${year} года`}>
      <div className="calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar__grid">
        {cells.map((day, index) =>
          day === null ? (
            <span key={`empty-${index}`} className="calendar__day calendar__day--empty" />
          ) : (
            <span
              key={day}
              className={`calendar__day${day === eventDay ? ' calendar__day--event' : ''}`}
              aria-current={day === eventDay ? 'date' : undefined}
              aria-label={
                day === eventDay
                  ? `${day} — день праздника`
                  : String(day)
              }
            >
              {day === eventDay ? <span className="calendar__event-day">{day}</span> : day}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

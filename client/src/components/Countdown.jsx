import { useEffect, useState } from 'react';

const pad = (value) => String(value).padStart(2, '0');

function plural(value, forms) {
  const abs = Math.abs(value) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last === 1) return forms[0];
  if (last >= 2 && last <= 4) return forms[1];
  return forms[2];
}

function getLeft(target) {
  const diff = Math.max(target - Date.now(), 0);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

export function Countdown({ target }) {
  const targetMs = new Date(target).getTime();
  const [left, setLeft] = useState(() => getLeft(targetMs));

  useEffect(() => {
    const timer = setInterval(() => setLeft(getLeft(targetMs)), 1000);
    return () => clearInterval(timer);
  }, [targetMs]);

  const cells = [
    { value: left.days, label: plural(left.days, ['день', 'дня', 'дней']) },
    { value: left.hours, label: plural(left.hours, ['час', 'часа', 'часов']) },
    { value: left.minutes, label: plural(left.minutes, ['минута', 'минуты', 'минут']) },
    { value: left.seconds, label: plural(left.seconds, ['секунда', 'секунды', 'секунд']) },
  ];

  return (
    <div className="countdown" role="timer" aria-label="До торжества осталось">
      {cells.map((cell) => (
        <div className="countdown__cell" key={cell.label}>
          <strong>{pad(cell.value)}</strong>
          <span>{cell.label}</span>
        </div>
      ))}
    </div>
  );
}

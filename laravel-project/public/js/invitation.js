(() => {
  'use strict';

  /*
   * Появление секций при скролле.
   */
  function initReveal() {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!nodes.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
  }

  /*
   * Обратный отсчёт до торжества.
   */
  function plural(value, forms) {
    const abs = Math.abs(value) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return forms[2];
    if (last === 1) return forms[0];
    if (last >= 2 && last <= 4) return forms[1];
    return forms[2];
  }

  function initCountdown() {
    const root = document.querySelector('[data-countdown-target]');
    if (!root) return;

    const target = new Date(root.dataset.countdownTarget).getTime();
    if (Number.isNaN(target)) return;

    const cells = root.querySelectorAll('.countdown__cell');
    const units = [
      ['день', 'дня', 'дней'],
      ['час', 'часа', 'часов'],
      ['минута', 'минуты', 'минут'],
      ['секунда', 'секунды', 'секунд'],
    ];

    const pad = (value) => String(value).padStart(2, '0');

    function render() {
      const diff = Math.max(target - Date.now(), 0);
      const left = [
        Math.floor(diff / 86400000),
        Math.floor((diff / 3600000) % 24),
        Math.floor((diff / 60000) % 60),
        Math.floor((diff / 1000) % 60),
      ];

      cells.forEach((cell, index) => {
        const strong = cell.querySelector('strong');
        const span = cell.querySelector('span');
        if (strong) strong.textContent = pad(left[index]);
        if (span) span.textContent = plural(left[index], units[index]);
      });
    }

    render();
    window.setInterval(render, 1000);
  }

  /*
   * Музыка: свой файл из data-music-src или тихая генеративная мелодия.
   */
  function initMusic() {
    const button = document.getElementById('music-toggle');
    if (!button) return;

    const label = button.querySelector('.music__label');
    const src = button.dataset.musicSrc || '';
    let playing = false;
    let context = null;
    let master = null;
    let timer = null;
    let audio = null;

    const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880.0, 659.25];

    function playSequence() {
      if (!context || !master) return;
      const start = context.currentTime + 0.08;

      notes.forEach((frequency, index) => {
        const at = start + index * 0.55;
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(0.12, at + 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, at + 1.45);

        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(at);
        oscillator.stop(at + 1.5);
      });
    }

    function setPlaying(value) {
      playing = value;
      button.classList.toggle('is-on', value);
      button.setAttribute('aria-pressed', value ? 'true' : 'false');
      if (label) label.textContent = value ? 'выключить музыку' : 'включить музыку';
    }

    async function start() {
      if (src) {
        audio = audio || new Audio(src);
        audio.loop = true;
        audio.volume = 0.35;
        await audio.play();
      } else {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        context = new AudioContextClass();
        await context.resume();
        master = context.createGain();
        master.gain.value = 0.08;
        master.connect(context.destination);
        playSequence();
        timer = window.setInterval(playSequence, 4600);
      }

      setPlaying(true);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      if (audio) audio.pause();
      if (context) {
        context.close().catch(() => {});
        context = null;
        master = null;
      }
      setPlaying(false);
    }

    button.addEventListener('click', async () => {
      if (playing) {
        stop();
        return;
      }

      try {
        await start();
      } catch {
        stop();
        if (label) label.textContent = 'музыка недоступна';
      }
    });
  }

  initReveal();
  initCountdown();
  initMusic();
})();

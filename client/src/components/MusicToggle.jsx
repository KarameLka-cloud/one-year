import { useEffect, useRef, useState } from 'react';

const MUSIC_SRC = (import.meta.env.VITE_MUSIC_SRC || '').trim();
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

function buildEngine() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2100;
  filter.Q.value = 0.5;
  filter.connect(master);

  // Мягкое эхо, чтобы ноты звучали объёмно.
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.46;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.3;
  const wet = ctx.createGain();
  wet.gain.value = 0.45;
  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(master);

  // Тихий «фон» из двух длинных нот.
  const padGain = ctx.createGain();
  padGain.gain.value = 0.035;
  padGain.connect(filter);

  [130.81, 196.0].forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    osc.detune.value = index === 0 ? -4 : 5;
    osc.connect(padGain);
    osc.start();
  });

  const playNote = (frequency, at, duration, volume) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(volume, at + 0.32);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain);
    gain.connect(filter);
    osc.start(at);
    osc.stop(at + duration + 0.1);
  };

  const tick = () => {
    if (ctx.state !== 'running') return;
    if (Math.random() < 0.22) return; // пауза между фразами
    const now = ctx.currentTime + 0.06;
    const index = Math.floor(Math.random() * SCALE.length);
    playNote(SCALE[index], now, 2.8, 0.15);
    if (Math.random() > 0.55) {
      playNote(SCALE[(index + 2) % SCALE.length] / 2, now + 0.34, 3.4, 0.1);
    }
  };

  const fadeIn = () => {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.24, now + 1.6);
  };

  const fadeOut = () => {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value || 0.0001, now);
    master.gain.linearRampToValueAtTime(0.0001, now + 0.7);
  };

  return { ctx, tick, fadeIn, fadeOut };
}

export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const engineRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const playToken = useRef(0);

  useEffect(() => {
    if (!MUSIC_SRC) return undefined;
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      const engine = engineRef.current;
      if (engine) {
        engine.ctx.close().catch(() => {});
        engineRef.current = null;
      }
    };
  }, []);

  function stop() {
    const token = ++playToken.current;
    setPlaying(false);
    clearInterval(timerRef.current);
    timerRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const engine = engineRef.current;
    if (engine) {
      engine.fadeOut();
      setTimeout(() => {
        if (playToken.current === token) {
          engine.ctx.suspend().catch(() => {});
        }
      }, 720);
    }
  }

  async function start() {
    playToken.current += 1;

    if (MUSIC_SRC) {
      if (!audioRef.current) return;
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setSupported(false);
      }
      return;
    }

    let engine = engineRef.current;
    if (!engine) {
      engine = buildEngine();
      if (!engine) {
        setSupported(false);
        return;
      }
      engineRef.current = engine;
    }

    try {
      await engine.ctx.resume();
      engine.fadeIn();
      clearInterval(timerRef.current);
      timerRef.current = setInterval(engine.tick, 1400);
      setPlaying(true);
    } catch {
      setSupported(false);
    }
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      className={`music${playing ? ' is-on' : ''}`}
      onClick={() => (playing ? stop() : start())}
      aria-pressed={playing}
      aria-label={playing ? 'Выключить музыку' : 'Включить музыку'}
      title={playing ? 'Выключить музыку' : 'Включить музыку'}
    >
      <span className="music__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="music__label">{playing ? 'музыка играет' : 'включить музыку'}</span>
    </button>
  );
}

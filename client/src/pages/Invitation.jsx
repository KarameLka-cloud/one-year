import { useState } from "react";
import { content } from "../content.js";
import { useReveal } from "../components/useReveal.js";
import { Calendar } from "../components/Calendar.jsx";
import { Countdown } from "../components/Countdown.jsx";
import { RsvpForm } from "../components/RsvpForm.jsx";
import {
  ArrowDown,
  Balloons,
  Heart,
  PinIcon,
  ProgramIcon,
  Sparkle,
  Sprig,
  Sticker,
} from "../components/Decor.jsx";

function Portrait() {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(content.photo) && !failed;

  return (
    <figure className="portrait">
      <span className="portrait__ring" aria-hidden="true" />
      <span
        className="portrait__ring portrait__ring--inner"
        aria-hidden="true"
      />
      <div
        className={`portrait__arch${showPhoto ? " portrait__arch--photo" : ""}`}
      >
        {showPhoto ? (
          <img
            className="portrait__photo"
            src={content.photo}
            alt={`${content.name} — ${content.age}`}
            onError={() => setFailed(true)}
          />
        ) : (
          <>
            <span className="portrait__age">01</span>
            <span className="portrait__letter" aria-hidden="true">
              {content.monogram}
            </span>
            <span className="portrait__caption script">мне годик</span>
            <Sparkle className="portrait__spark portrait__spark--a" size={22} />
            <Sparkle className="portrait__spark portrait__spark--b" size={12} />
            <span className="portrait__dot" aria-hidden="true" />
          </>
        )}
      </div>
      <Sticker className="portrait__sticker" />
    </figure>
  );
}

export default function Invitation() {
  useReveal();

  return (
    <>
      <main>
        <section className="hero" id="top">
          <div className="hero__top">
            <p className="hero__tag">
              <Sparkle size={11} /> приглашение
            </p>
            <p className="hero__top-date">{content.date.short}</p>
          </div>

          <div className="hero__sparkles" aria-hidden="true">
            <Sparkle size={18} className="hero__spark hero__spark--1" />
            <Sparkle size={10} className="hero__spark hero__spark--2" />
            <Sparkle size={14} className="hero__spark hero__spark--3" />
          </div>

          <div className="hero__inner">
            <div className="hero__copy">
              <p className="hero__kicker eyebrow">Дорогие родные и друзья!</p>
              <h1 className="hero__name">{content.name}</h1>
              <p className="hero__script">{content.eventTitle}</p>
              <p className="hero__lede">
                Приглашаем Вас отметить с нами важное событие для нашей семьи!
              </p>

              <div className="hero__facts">
                <div>
                  <span>дата</span>
                  <strong>26.02.2027</strong>
                </div>
                <div>
                  <span>сбор гостей</span>
                  <strong>{content.date.time}</strong>
                </div>
                <div>
                  <span>город</span>
                  <strong>{content.venue.city}</strong>
                </div>
              </div>
            </div>

            <div className="hero__art">
              <Portrait />
              <Balloons className="hero__balloons" />
            </div>
          </div>

          <a
            className="scroll-cue"
            href="#about"
            aria-label="Перейти к тексту приглашения"
          >
            <span>листайте вниз</span>
            <span className="scroll-cue__line" aria-hidden="true">
              <ArrowDown size={12} />
            </span>
          </a>
        </section>

        <section className="section about" id="about">
          <div className="wrap about__wrap">
            <div className="about__visual">
              <figure className="about__photo" data-reveal>
                <img src="/images/family.jpg" alt="Олег, Дулма и Аяна" />
                <div className="about__head">
                  <p className="eyebrow">с любовью</p>
                  <h2 className="about__title">
                    дорогие
                    <br />
                    <em>родные и друзья!</em>
                  </h2>
                  <Sprig className="about__sprig" />
                </div>
              </figure>
            </div>

            <div className="about__body">
              <p className="about__lead" data-reveal>
                Нашей любимой доченьке <strong>Аяне</strong> исполняется{" "}
                <em>один год</em>.
              </p>
              <p data-reveal style={{ "--d": "0.08s" }}>
                Мы готовим уютный праздник, где детям будет весело и просторно
                играть, а взрослым — приятно и тепло общаться. Будем рады видеть
                всех!
              </p>
              <p
                className="about__signature script"
                data-reveal
                style={{ "--d": "0.24s" }}
              >
                С нетерпением ждём встречи!
              </p>
            </div>

            <div className="about__stats" data-reveal style={{ "--d": "0.1s" }}>
              <div>
                <strong>12</strong>
                <span>месяцев</span>
              </div>
              <span className="about__stats-line" aria-hidden="true" />
              <div>
                <strong>365</strong>
                <span>дней</span>
              </div>
              <span className="about__stats-line" aria-hidden="true" />
              <div>
                <strong>∞</strong>
                <span>любви</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section when" id="when">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <p className="eyebrow">когда</p>
              <h2 className="section-title">
                февраль <em>2027</em>
              </h2>
            </div>

            <div className="when__grid">
              <div className="date-card" data-reveal>
                <div className="date-card__top">
                  <span className="date-card__day">{content.date.day}</span>
                  <div className="date-card__month-block">
                    <p className="date-card__month">{content.date.month}</p>
                    <p className="date-card__weekday">{content.date.weekday}</p>
                  </div>
                </div>

                <div className="date-card__time">
                  <span className="eyebrow">сбор гостей</span>
                  <strong>{content.date.time}</strong>
                </div>

                <div className="date-card__divider" aria-hidden="true" />

                <Countdown target={content.date.iso} />
                <p className="date-card__quote script">совсем скоро</p>
                <p className="date-card__note">
                  начало праздника в 15:00 · не опаздывайте, мы будем ждать
                </p>
              </div>

              <div
                className="calendar-card"
                data-reveal
                style={{ "--d": "0.1s" }}
              >
                <div className="calendar-card__head">
                  <span className="calendar-card__month script">февраль</span>
                  <span className="calendar-card__year">
                    {content.date.year}
                  </span>
                </div>
                <Calendar year={2027} month={1} eventDay={26} />
                <p className="calendar-card__note">
                  <Heart size={14} />
                  отмечен день, когда нам будет особенно тепло
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section where" id="where">
          <div className="wrap where__grid">
            <div className="place" data-reveal>
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A67cb8e593cfe9ea4410a75fc2773767ac68d0c15a144e02a3e09da4326ab5467&amp;source=constructor"
                width="640"
                height="440"
                frameborder="0"
              ></iframe>
            </div>

            <div className="where__copy" data-reveal style={{ "--d": "0.1s" }}>
              <p className="eyebrow">где</p>
              <h2 className="section-title">
                {content.venue.label}
                <br />
                <em>{content.venue.name}</em>
              </h2>
              <p className="where__address">
                {content.venue.address}
                <br />
                {content.venue.city}
              </p>
              {/* <p className="where__note">
                Просторный зал, детская зона и парковка рядом. Если понадобится
                помощь с дорогой — просто напишите нам.
              </p> */}
              <a
                className="btn btn--ghost"
                href={content.venue.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <PinIcon size={16} />
                открыть на карте
              </a>
            </div>
          </div>
        </section>

        <section className="section program" id="program">
          <div className="wrap">
            <div className="section-head section-head--center" data-reveal>
              <p className="eyebrow">программа</p>
              <h2 className="section-title">
                как пройдёт <em>наш день</em>
              </h2>
            </div>

            <ol className="timeline">
              {content.program.map((item, index) => (
                <li
                  className="timeline__item"
                  key={item.time}
                  data-reveal
                  style={{ "--d": `${index * 0.09}s` }}
                >
                  <span className="timeline__icon">
                    <ProgramIcon name={item.icon} />
                  </span>
                  <span className="timeline__time">{item.time}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="timeline__index" aria-hidden="true">
                    0{index + 1}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* <section className="section dress" id="dresscode">
          <div className="wrap">
            <div className="dress__card" data-reveal>
              <div className="dress__copy">
                <p className="eyebrow">дресс-код</p>
                <h2 className="section-title">
                  нарядные <em>и счастливые</em>
                </h2>
                <p>{content.dressCode}</p>
              </div>
            </div>
          </div>
        </section> */}

        <section className="section rsvp" id="rsvp">
          <div className="wrap rsvp__grid">
            <div className="rsvp__copy" data-reveal>
              <p className="eyebrow">ваш ответ</p>
              <h2 className="section-title">
                будете <em>с нами?</em>
              </h2>
              <p className="rsvp__text">
                Пожалуйста, ответьте до {content.rsvpDeadline} — так мы сможем
                всё подготовить и никого не забыть.
              </p>
              <div className="rsvp__contacts">
                <p className="eyebrow">если есть вопросы</p>
                {content.contacts.map((contact) => (
                  <a key={contact.href} href={contact.href}>
                    {contact.label}
                  </a>
                ))}
              </div>
              <div className="rsvp__decor" aria-hidden="true">
                <Sparkle size={14} />
                <span />
                <Heart size={14} />
              </div>
            </div>

            <div
              className="rsvp__form-wrap"
              data-reveal
              style={{ "--d": "0.1s" }}
            >
              <RsvpForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <div className="footer__head">
            <p className="footer__script script">с любовью,</p>
            <p className="footer__parents script">{content.parents}</p>
          </div>
          <span className="footer__ornament" aria-hidden="true">
            <span />
            <Sparkle size={14} />
            <span />
          </span>
          <div className="footer__bottom">
            <p className="footer__meta">
              {content.date.short} · {content.venue.city}
            </p>
            <div className="footer__contacts">
              {content.contacts.map((contact) => (
                <a key={contact.href} href={contact.href}>
                  {contact.label}
                </a>
              ))}
            </div>
            <p className="footer__copy">сделано с любовью · 2027</p>
          </div>
        </div>
      </footer>
    </>
  );
}

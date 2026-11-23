@extends('layouts.app')

@section('title', $content['name'].' — приглашение на первый день рождения')
@section('description', 'Нашей любимой доченьке '.$content['name'].' исполняется 1 год! Приглашаем Вас отметить с нами важное событие для нашей семьи!')
@section('og-title', $content['name'].' — первый день рождения')
@section('og-description', $content['date']['compact'].' · '.$content['date']['time'].' · '.$content['venue']['city'])

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/invitation.css') }}?v={{ filemtime(public_path('css/invitation.css')) }}" />
@endpush

@section('content')
    <main>
        <section class="hero" id="top">
            <div class="hero__top">
                <p class="hero__tag">
                    <x-icon name="sparkle" :size="11" /> приглашение
                </p>
                <p class="hero__top-date">{{ $content['date']['short'] }}</p>
            </div>

            <div class="hero__sparkles" aria-hidden="true">
                <x-icon name="sparkle" :size="18" class="hero__spark hero__spark--1" />
                <x-icon name="sparkle" :size="10" class="hero__spark hero__spark--2" />
                <x-icon name="sparkle" :size="14" class="hero__spark hero__spark--3" />
            </div>

            <div class="hero__inner">
                <div class="hero__copy">
                    <p class="hero__kicker eyebrow">Дорогие родные и друзья!</p>
                    <h1 class="hero__name">{{ $content['name'] }}</h1>
                    <p class="hero__script">{{ $content['event_title'] }}</p>
                    <p class="hero__lede">
                        Приглашаем Вас отметить с нами важное событие для нашей семьи!
                    </p>

                    <div class="hero__facts">
                        <div>
                            <span>дата</span>
                            <strong>{{ $content['date']['compact'] }}</strong>
                        </div>
                        <div>
                            <span>сбор гостей</span>
                            <strong>{{ $content['date']['time'] }}</strong>
                        </div>
                        <div>
                            <span>город</span>
                            <strong>{{ $content['venue']['city'] }}</strong>
                        </div>
                    </div>
                </div>

                <div class="hero__art">
                    <figure class="portrait">
                        <span class="portrait__ring" aria-hidden="true"></span>
                        <span class="portrait__ring portrait__ring--inner" aria-hidden="true"></span>

                        @if ($photoUrl)
                            <div class="portrait__arch portrait__arch--photo">
                                <img
                                    class="portrait__photo"
                                    src="{{ $photoUrl }}"
                                    alt="{{ $content['name'] }} — {{ $content['age'] }}"
                                />
                            </div>
                        @else
                            <div class="portrait__arch">
                                <span class="portrait__age">01</span>
                                <span class="portrait__letter" aria-hidden="true">{{ $content['monogram'] }}</span>
                                <span class="portrait__caption script">мне годик</span>
                                <x-icon name="sparkle" :size="22" class="portrait__spark portrait__spark--a" />
                                <x-icon name="sparkle" :size="12" class="portrait__spark portrait__spark--b" />
                                <span class="portrait__dot" aria-hidden="true"></span>
                            </div>
                        @endif

                        <x-sticker class="portrait__sticker" />
                    </figure>

                    <x-balloons class="hero__balloons" />
                </div>
            </div>

            <a class="scroll-cue" href="#about" aria-label="Перейти к тексту приглашения">
                <span>листайте вниз</span>
                <span class="scroll-cue__line" aria-hidden="true">
                    <x-icon name="arrow-down" :size="12" />
                </span>
            </a>
        </section>

        <section class="section about" id="about">
            <div class="wrap about__wrap">
                <div class="about__visual">
                    <figure class="about__photo" data-reveal>
                        <img src="{{ asset(ltrim($content['family_photo'], '/')) }}" alt="Олег, Дулма и Аяна" />
                        <div class="about__head">
                            <h2 class="about__title">
                                Дорогие
                                <br />
                                <em>родные и друзья!</em>
                            </h2>
                            <x-sprig class="about__sprig" />
                        </div>
                    </figure>
                </div>

                <div class="about__body">
                    <p class="about__lead" data-reveal>
                        Нашей любимой доченьке <strong>{{ $content['name'] }}</strong> исполняется
                        <em>один год</em>.
                    </p>
                    <p data-reveal style="--d: 0.08s">
                        Мы готовим уютный праздник, где детям будет весело и просторно играть, а взрослым —
                        приятно и тепло общаться. Будем рады видеть всех!
                    </p>
                    <p class="about__signature script" data-reveal style="--d: 0.24s">
                        С нетерпением ждём встречи!
                    </p>
                </div>

                <div class="about__stats" data-reveal style="--d: 0.1s">
                    <div>
                        <strong>12</strong>
                        <span>месяцев</span>
                    </div>
                    <span class="about__stats-line" aria-hidden="true"></span>
                    <div>
                        <strong>365</strong>
                        <span>дней</span>
                    </div>
                    <span class="about__stats-line" aria-hidden="true"></span>
                    <div>
                        <strong>∞</strong>
                        <span>любви</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="section when" id="when">
            <div class="wrap">
                <div class="section-head" data-reveal>
                    <p class="eyebrow">когда</p>
                    <h2 class="section-title">
                        {{ $content['date']['month'] }} <em>{{ $content['date']['year'] }}</em>
                    </h2>
                </div>

                <div class="when__grid">
                    <div class="date-card" data-reveal>
                        <div class="date-card__top">
                            <span class="date-card__day">{{ $content['date']['day'] }}</span>
                            <div class="date-card__month-block">
                                <p class="date-card__month">{{ $content['date']['month'] }}</p>
                                <p class="date-card__weekday">{{ $content['date']['weekday'] }}</p>
                            </div>
                        </div>

                        <div class="date-card__time">
                            <span class="eyebrow">сбор гостей</span>
                            <strong>{{ $content['date']['time'] }}</strong>
                        </div>

                        <div class="date-card__divider" aria-hidden="true"></div>

                        <x-countdown :target="$content['date']['iso']" />
                        <p class="date-card__quote script">совсем скоро</p>
                    </div>

                    <div class="calendar-card" data-reveal style="--d: 0.1s">
                        <div class="calendar-card__head">
                            <span class="calendar-card__month script">{{ $content['date']['month'] }}</span>
                            <span class="calendar-card__year">{{ $content['date']['year'] }}</span>
                        </div>
                        <x-calendar
                            :year="$content['calendar']['year']"
                            :month="$content['calendar']['month']"
                            :event-day="$content['calendar']['day']"
                        />
                        <p class="calendar-card__note">
                            <x-icon name="heart" :size="14" />
                            отмечен день, когда нам будет особенно тепло
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="section where" id="where">
            <div class="wrap where__grid">
                <div class="place" data-reveal>
                    <div class="place__map">
                        <iframe
                            src="{{ $content['venue']['map_embed'] }}"
                            width="100%"
                            height="440"
                            frameborder="0"
                        ></iframe>
                    </div>
                </div>

                <div class="where__copy" data-reveal style="--d: 0.1s">
                    <p class="eyebrow">где</p>
                    <h2 class="section-title">
                        {{ $content['venue']['label'] }}
                        <br />
                        <em>{{ $content['venue']['name'] }}</em>
                    </h2>
                    <p class="where__address">
                        {{ $content['venue']['address'] }}
                        <br />
                        {{ $content['venue']['city'] }}
                    </p>
                    <a
                        class="btn btn--ghost"
                        href="{{ $content['venue']['map_url'] }}"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <x-icon name="pin" :size="16" />
                        открыть на карте
                    </a>
                </div>
            </div>
        </section>

        <section class="section program" id="program">
            <div class="wrap">
                <div class="section-head section-head--center" data-reveal>
                    <p class="eyebrow">программа</p>
                    <h2 class="section-title">
                        как пройдёт <em>наш день</em>
                    </h2>
                </div>

                <ol class="timeline">
                    @foreach ($content['program'] as $index => $item)
                        <li class="timeline__item" data-reveal style="--d: {{ $index * 0.09 }}s">
                            <span class="timeline__icon">
                                <x-icon :name="$item['icon']" :size="26" />
                            </span>
                            <span class="timeline__time">{{ $item['time'] }}</span>
                            <h3>{{ $item['title'] }}</h3>
                            <p>{{ $item['text'] ?? '' }}</p>
                            <span class="timeline__index" aria-hidden="true">0{{ $index + 1 }}</span>
                        </li>
                    @endforeach
                </ol>
            </div>
        </section>

        <section class="section rsvp" id="rsvp">
            <div class="wrap rsvp__grid">
                <div class="rsvp__copy" data-reveal>
                    <p class="eyebrow">ваш ответ</p>
                    <h2 class="section-title">
                        будете <em>с нами?</em>
                    </h2>
                    <p class="rsvp__text">
                        Пожалуйста, ответьте до {{ $content['rsvp_deadline'] }} — так мы сможем всё
                        подготовить и никого не забыть.
                    </p>
                    <div class="rsvp__contacts">
                        <p class="eyebrow">если есть вопросы</p>
                        @foreach ($content['contacts'] as $contact)
                            <a href="{{ $contact['href'] }}">{{ $contact['label'] }}</a>
                        @endforeach
                    </div>
                    <div class="rsvp__decor" aria-hidden="true">
                        <x-icon name="sparkle" :size="14" />
                        <span></span>
                        <x-icon name="heart" :size="14" />
                    </div>
                </div>

                <div class="rsvp__form-wrap" data-reveal style="--d: 0.1s">
                    <div id="rsvp-form-card" @if (session('rsvp_success')) hidden @endif>
                        @include('partials.rsvp-form')
                    </div>
                    <div id="rsvp-success-card" @if (! session('rsvp_success')) hidden @endif>
                        @include('partials.rsvp-success')
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="wrap footer__inner">
            <div class="footer__head">
                <p class="footer__script script">с уважением</p>
                <p class="footer__parents script">{{ $content['parents'] }}</p>
            </div>
            <span class="footer__ornament" aria-hidden="true">
                <span></span>
                <x-icon name="sparkle" :size="14" />
                <span></span>
            </span>
            <div class="footer__bottom">
                <p class="footer__meta">
                    {{ $content['date']['short'] }} · {{ $content['venue']['city'] }}
                </p>
                <div class="footer__contacts">
                    @foreach ($content['contacts'] as $contact)
                        <a href="{{ $contact['href'] }}">{{ $contact['label'] }}</a>
                    @endforeach
                </div>
                <p class="footer__copy">сделано с любовью · {{ $content['date']['year'] }}</p>
            </div>
        </div>
    </footer>
@endsection

@push('scripts')
    <script src="{{ asset('js/invitation.js') }}?v={{ filemtime(public_path('js/invitation.js')) }}" defer></script>
    <script src="{{ asset('js/rsvp.js') }}?v={{ filemtime(public_path('js/rsvp.js')) }}" defer></script>
@endpush

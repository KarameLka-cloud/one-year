<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#fbf6ee" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>@yield('title', 'Аяна — приглашение на первый день рождения')</title>
    <meta name="description" content="@yield('description', 'Приглашение на первый день рождения Аяны — 26 февраля 2027 года, Иркутск.')" />
    <meta property="og:title" content="@yield('og-title', 'Аяна — первый день рождения')" />
    <meta property="og:description" content="@yield('og-description', '26 февраля 2027 · 14:00 · Иркутск')" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="{{ asset('images/portrait.jpg') }}" />
    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Marck+Script&family=Montserrat:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="{{ asset('css/base.css') }}?v={{ filemtime(public_path('css/base.css')) }}" />
    @stack('styles')
    <noscript>
      <style>
        [data-reveal] { opacity: 1; transform: none; }
      </style>
    </noscript>
  </head>
  <body class="@yield('body-class')">
    @yield('content')
    @stack('scripts')
  </body>
</html>

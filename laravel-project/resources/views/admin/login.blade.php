@extends('layouts.app')

@section('title', 'Вход в админку — '.config('invitation.name'))
@section('description', 'Панель организатора: ответы гостей на приглашение.')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}?v={{ filemtime(public_path('css/admin.css')) }}" />
@endpush

@section('content')
    <div class="auth">
        <div class="auth__bg" aria-hidden="true">
            <span class="auth__blob auth__blob--one"></span>
            <span class="auth__blob auth__blob--two"></span>
            <span class="auth__blob auth__blob--three"></span>
        </div>

        <div class="auth__card">
            <aside class="auth__art">
                <span class="auth__art-label eyebrow">для своих</span>
                <span class="auth__monogram" aria-hidden="true">{{ config('invitation.monogram') }}</span>
                <p class="auth__script script">{{ config('invitation.name') }}</p>
                <p class="auth__art-note">
                    {{ config('invitation.event_title') }}
                    <br />
                    {{ config('invitation.date.short') }}
                </p>
                <x-icon name="sparkle" :size="18" class="auth__art-spark auth__art-spark--one" />
                <x-icon name="sparkle" :size="11" class="auth__art-spark auth__art-spark--two" />
            </aside>

            <div class="auth__form">
                <a class="auth__back" href="{{ route('invitation') }}">
                    <span aria-hidden="true">←</span> к приглашению
                </a>
                <p class="eyebrow">панель организатора</p>
                <h1>вход в админку</h1>
                <p class="auth__hint">
                    Здесь собраны ответы гостей. Введите данные, чтобы посмотреть записи.
                </p>

                <form class="auth__form-fields" method="POST" action="{{ route('admin.login.store') }}" id="login-form">
                    @csrf

                    <label class="field" for="login">
                        <span class="field__label">логин</span>
                        <input
                            id="login"
                            type="text"
                            name="login"
                            value="{{ old('login') }}"
                            placeholder="admin"
                            autocomplete="username"
                            autofocus
                            maxlength="64"
                        />
                    </label>

                    <label class="field" for="password">
                        <span class="field__label">пароль</span>
                        <span class="field__password">
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                autocomplete="current-password"
                                maxlength="128"
                            />
                            <button
                                type="button"
                                class="field__eye"
                                id="password-toggle"
                                aria-label="Показать пароль"
                            >
                                показать
                            </button>
                        </span>
                    </label>

                    @if ($errors->any())
                        <p class="form__error" role="alert">{{ $errors->first() }}</p>
                    @endif

                    <button type="submit" class="btn btn--primary auth__submit" id="login-submit">
                        войти
                    </button>
                </form>

                <p class="auth__footer-note">
                    Доступ только для организаторов праздника
                </p>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('js/admin-login.js') }}?v={{ filemtime(public_path('js/admin-login.js')) }}" defer></script>
@endpush

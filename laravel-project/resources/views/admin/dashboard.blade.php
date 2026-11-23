@extends('layouts.app')

@section('title', 'Записи с приглашения — '.config('invitation.name'))
@section('description', 'Панель организатора: ответы гостей на приглашение.')
@section('body-class', 'admin-page')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}?v={{ filemtime(public_path('css/admin.css')) }}" />
@endpush

@section('content')
    <div class="admin">
        <header class="admin__header">
            <div class="admin__header-inner">
                <a href="{{ route('invitation') }}" class="admin__brand">
                    <span class="admin__brand-mark">{{ config('invitation.monogram') }}</span>
                    <span class="admin__brand-text">
                        <strong>{{ config('invitation.name') }}</strong>
                        <small>панель организатора</small>
                    </span>
                </a>
                <div class="admin__user">
                    <span class="admin__user-login" title="Вы вошли как">
                        {{ auth('admin')->user()->login }}
                    </span>
                    <form method="POST" action="{{ route('admin.logout') }}">
                        @csrf
                        <button type="submit" class="admin__logout">выйти</button>
                    </form>
                </div>
            </div>
        </header>

        <main class="admin__main">
            <div class="admin__title-row">
                <div>
                    <p class="eyebrow">гости и ответы</p>
                    <h1>записи с приглашения</h1>
                </div>
                <div class="admin__title-actions">
                    <a class="btn btn--ghost btn--small" href="{{ request()->fullUrl() }}">обновить</a>
                    <a
                        class="btn btn--primary btn--small"
                        href="{{ route('api.admin.export', $q !== '' ? ['q' => $q] : []) }}"
                    >
                        скачать CSV
                    </a>
                </div>
            </div>

            <div class="stats">
                <article class="stat stat--dark">
                    <p class="stat__label">всего ответов</p>
                    <strong class="stat__value">{{ $stats['total'] }}</strong>
                    <p class="stat__note">все обработаны</p>
                </article>
                <article class="stat stat--sage">
                    <p class="stat__label">всего человек</p>
                    <strong class="stat__value">{{ $stats['totalPeople'] }}</strong>
                    <p class="stat__note">
                        {{ $stats['totalAdults'] }} взрослых и {{ $stats['totalChildren'] }}
                        {{ \App\Support\Plural::children($stats['totalChildren']) }}
                    </p>
                </article>
                <article class="stat stat--blush">
                    <p class="stat__label">смогут</p>
                    <strong class="stat__value">{{ $stats['comingTotal'] }}</strong>
                    <p class="stat__note">
                        {{ $stats['comingAdults'] }} взрослых и {{ $stats['comingChildren'] }}
                        {{ \App\Support\Plural::children($stats['comingChildren']) }}
                    </p>
                </article>
                <article class="stat stat--gold">
                    <p class="stat__label">не смогут</p>
                    <strong class="stat__value">{{ $stats['notComing'] }}</strong>
                    <p class="stat__note">обязательно обнимем при встрече</p>
                </article>
            </div>

            <section class="records">
                <div class="records__toolbar">
                    <form class="admin-search" role="search" method="GET" action="{{ route('admin.dashboard') }}" id="admin-search-form">
                        <x-icon name="search" :size="17" />
                        <input
                            type="search"
                            name="q"
                            value="{{ $q }}"
                            placeholder="Имя или пара…"
                            aria-label="Поиск по записям"
                            id="admin-search-input"
                        />
                        <button
                            type="button"
                            class="admin-search__clear"
                            id="admin-search-clear"
                            aria-label="Очистить поиск"
                            @if ($q === '') hidden @endif
                        >
                            ×
                        </button>
                    </form>
                </div>

                @if (session('error'))
                    <div class="admin-alert" role="alert">
                        <span>{{ session('error') }}</span>
                    </div>
                @endif

                @if ($records->isEmpty())
                    <div class="records__state">
                        <span class="records__state-mark">{{ config('invitation.monogram') }}</span>
                        <p class="records__state-title">пока нет ответов</p>
                        <p class="records__state-text">
                            @if ($q !== '')
                                По выбранным условиям ничего не найдено. Попробуйте изменить фильтр.
                            @else
                                Как только гости заполнят анкету, их ответы появятся здесь.
                            @endif
                        </p>
                        @if ($q !== '')
                            <a class="btn btn--ghost btn--small" href="{{ route('admin.dashboard') }}">
                                сбросить фильтры
                            </a>
                        @endif
                    </div>
                @else
                    <div class="records__table-wrap">
                        <table class="records__table">
                            <thead>
                                <tr>
                                    <th>гость</th>
                                    <th>пара</th>
                                    <th>присутствие</th>
                                    <th>детей</th>
                                    <th>дата ответа</th>
                                    <th aria-label="Действия"></th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($records as $record)
                                    @php
                                        $recordData = [
                                            'name' => $record->name,
                                            'pair' => $record->pair ?? '',
                                            'attendance' => $record->attendance,
                                            'children' => (int) $record->children,
                                            'createdAtLabel' => \App\Support\DateFormat::display($record->created_at),
                                            'deleteUrl' => route('admin.rsvps.destroy', $record),
                                        ];
                                    @endphp
                                    <tr data-record="{{ json_encode($recordData, JSON_UNESCAPED_UNICODE | JSON_HEX_APOS | JSON_HEX_QUOT) }}">
                                        <td data-label="Гость">
                                            <span class="guest">
                                                <strong>{{ $record->name }}</strong>
                                            </span>
                                        </td>
                                        <td data-label="Пара">
                                            <span class="guest">{{ $record->pair ?: '—' }}</span>
                                        </td>
                                        <td data-label="Присутствие">
                                            <span class="badge badge--{{ $record->attendance }}">
                                                {{ $record->attendance === 'yes' ? 'Придёт' : 'Не придёт' }}
                                            </span>
                                        </td>
                                        <td data-label="Детей">
                                            <span class="guests-count">{{ $record->children > 0 ? $record->children : '—' }}</span>
                                        </td>
                                        <td data-label="Дата ответа">
                                            <span class="record-date">{{ \App\Support\DateFormat::display($record->created_at) }}</span>
                                        </td>
                                        <td data-label="Действия">
                                            <div class="row-actions">
                                                <button
                                                    type="button"
                                                    class="icon-btn"
                                                    data-record-open
                                                    aria-label="Открыть запись {{ $record->name }}"
                                                >
                                                    <x-icon name="eye" :size="17" />
                                                </button>
                                                <button
                                                    type="button"
                                                    class="icon-btn icon-btn--danger"
                                                    data-record-delete
                                                    aria-label="Удалить запись {{ $record->name }}"
                                                >
                                                    <x-icon name="trash" :size="16" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif

                @if ($records->total() > 0)
                    <div class="records__footer">
                        <span class="records__count">
                            всего {{ $records->total() }} {{ \App\Support\Plural::records($records->total()) }}
                        </span>
                        <form class="pagination" method="GET" action="{{ route('admin.dashboard') }}">
                            @if ($q !== '')
                                <input type="hidden" name="q" value="{{ $q }}" />
                            @endif
                            @if ($records->onFirstPage())
                                <button type="button" disabled aria-label="Предыдущая страница">←</button>
                            @else
                                <button type="submit" name="page" value="{{ $records->currentPage() - 1 }}" aria-label="Предыдущая страница">←</button>
                            @endif
                            <span>
                                {{ $records->currentPage() }} <small>/ {{ $records->lastPage() }}</small>
                            </span>
                            @if ($records->hasMorePages())
                                <button type="submit" name="page" value="{{ $records->currentPage() + 1 }}" aria-label="Следующая страница">→</button>
                            @else
                                <button type="button" disabled aria-label="Следующая страница">→</button>
                            @endif
                        </form>
                    </div>
                @endif
            </section>
        </main>
    </div>

    <div class="modal" id="record-modal" role="dialog" aria-modal="true" aria-labelledby="record-title" hidden>
        <div class="modal__card">
            <button type="button" class="modal__close" data-close aria-label="Закрыть">×</button>
            <p class="eyebrow">ответ гостя</p>
            <h2 id="record-title"></h2>
            <div class="modal__chips">
                <span class="badge" id="record-attendance"></span>
                <span class="modal__chip" id="record-children"></span>
            </div>
            <dl class="modal__list">
                <div>
                    <dt>ФИО пары</dt>
                    <dd id="record-pair"></dd>
                </div>
                <div>
                    <dt>дата ответа</dt>
                    <dd id="record-date"></dd>
                </div>
            </dl>
            <div class="modal__actions">
                <button type="button" class="btn btn--danger btn--small" id="record-delete">
                    удалить
                </button>
            </div>
        </div>
    </div>

    <div class="modal" id="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title" hidden>
        <div class="modal__card modal__card--small">
            <p class="eyebrow">удаление</p>
            <h2 id="delete-title">удалить запись?</h2>
            <p class="modal__text" id="delete-text">
                Ответ гостя будет удалён без возможности восстановления.
            </p>
            <p class="form__error" id="delete-error" role="alert" hidden></p>
            <form method="POST" id="delete-form" action="">
                @csrf
                @method('DELETE')
                @if ($q !== '')
                    <input type="hidden" name="q" value="{{ $q }}" />
                @endif
                <input type="hidden" name="page" value="{{ $records->currentPage() }}" />
                <div class="modal__actions">
                    <button type="button" class="btn btn--ghost btn--small" data-close>отмена</button>
                    <button type="submit" class="btn btn--danger btn--small" id="delete-submit">удалить</button>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('js/admin.js') }}?v={{ filemtime(public_path('js/admin.js')) }}" defer></script>
@endpush

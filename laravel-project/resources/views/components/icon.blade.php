@props([
    'name' => 'sparkle',
    'size' => 16,
    'class' => '',
])

@php
    $viewBox = in_array($name, ['glass', 'star', 'cake', 'check'], true) ? '0 0 32 32' : '0 0 24 24';
@endphp

<svg
    class="{{ $class }}"
    width="{{ $size }}"
    height="{{ $size }}"
    viewBox="{{ $viewBox }}"
    fill="none"
    aria-hidden="true"
>
    @switch($name)
        @case('sparkle')
            <path
                d="M12 1.5c.55 5.9 4.6 9.95 10.5 10.5-5.9.55-9.95 4.6-10.5 10.5C11.45 16.6 7.4 12.55 1.5 12 7.4 11.45 11.45 7.4 12 1.5Z"
                fill="currentColor"
            />
            @break

        @case('heart')
            <path
                d="M12 20.4S3.3 14.9 3.3 8.9A4.8 4.8 0 0 1 12 5.8a4.8 4.8 0 0 1 8.7 3.1c0 6-8.7 11.5-8.7 11.5Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
            />
            @break

        @case('arrow-down')
            <path
                d="M12 3v18M5 14l7 7 7-7"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            @break

        @case('pin')
            <path
                d="M12 21.5s7-6.2 7-12A7 7 0 1 0 5 9.5c0 5.8 7 12 7 12Z"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linejoin="round"
            />
            <circle cx="12" cy="9.5" r="2.5" fill="currentColor" />
            @break

        @case('glass')
            <path
                d="M6 5h8l-1.2 8.5a2.8 2.8 0 0 1-5.6 0L6 5Z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linejoin="round"
            />
            <path d="M10 16v10M7 26h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
            <path
                d="M18 7h8l-1.2 8.5a2.8 2.8 0 0 1-5.6 0L18 7Z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linejoin="round"
            />
            <path d="M22 18v8M19 26h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
            <path
                d="M12 4.5c1.4 1.2 2.6 1.2 4 0M24 6.5c1.4 1.2 2.6 1.2 4 0"
                stroke="currentColor"
                stroke-width="1.1"
                stroke-linecap="round"
            />
            @break

        @case('star')
            <path
                d="M16 4c.7 7.8 4.2 11.3 12 12-7.8.7-11.3 4.2-12 12-.7-7.8-4.2-11.3-12-12 7.8-.7 11.3-4.2 12-12Z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linejoin="round"
            />
            <circle cx="25" cy="7" r="1.4" fill="currentColor" />
            <circle cx="7" cy="25" r="1.1" fill="currentColor" />
            @break

        @case('cake')
            <path
                d="M6 20h20v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7Z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linejoin="round"
            />
            <path
                d="M6 23.5c2.5 2 4.5 2 7 0s4.5-2 7 0 4.5 2 6 0"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
            />
            <path
                d="M9 20v-4.5a2.5 2.5 0 0 1 5 0V20M18 20v-4.5a2.5 2.5 0 0 1 5 0V20"
                stroke="currentColor"
                stroke-width="1.3"
            />
            <path d="M11.5 10V7M20.5 10V7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
            <path
                d="M11.5 4.8c1.3-1.2 1.3-2.4 0-3.6M20.5 4.8c1.3-1.2 1.3-2.4 0-3.6"
                stroke="currentColor"
                stroke-width="1.1"
                stroke-linecap="round"
            />
            @break

        @case('check')
            <path
                d="M6.5 17.5 13 24 26 9.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            @break

        @case('search')
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6" />
            <path d="m16.5 16.5 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            @break

        @case('eye')
            <path
                d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                stroke="currentColor"
                stroke-width="1.5"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
            @break

        @case('trash')
            <path
                d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path d="M10 11v5M14 11v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
            @break
    @endswitch
</svg>

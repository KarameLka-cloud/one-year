@props([
    'class' => '',
    'top' => '1',
    'bottom' => 'год',
])

@php
    $pathId = 'sticker-'.uniqid();
@endphp

<div class="{{ $class }}">
    <svg viewBox="0 0 140 140" fill="none" aria-hidden="true">
        <circle cx="70" cy="70" r="68" fill="#fffaf3" />
        <circle cx="70" cy="70" r="62" stroke="#c9a978" stroke-width="1" stroke-dasharray="2 4" />
        <circle cx="70" cy="70" r="44" stroke="#e3bdb5" stroke-width="1" opacity=".8" />
        <defs>
            <path id="{{ $pathId }}" d="M70,70 m-54,0 a54,54 0 1,1 108,0 a54,54 0 1,1 -108,0" />
        </defs>
        <g class="sticker__ring">
            <text fill="#8a6f60" font-size="8.2" letter-spacing="2.4" font-family="Montserrat, sans-serif">
                <textPath href="#{{ $pathId }}" startOffset="0">
                    {{ config('invitation.name') }} · один год · {{ config('invitation.date.compact') }} ·
                </textPath>
            </text>
        </g>
        <text
            x="70"
            y="75"
            text-anchor="middle"
            fill="#b28a52"
            font-family="Cormorant Garamond, Georgia, serif"
            font-size="42"
            font-style="italic"
        >
            {{ $top }}
        </text>
        <text x="70" y="93" text-anchor="middle" fill="#a4695f" font-family="Marck Script, cursive" font-size="15">
            {{ $bottom }}
        </text>
    </svg>
</div>

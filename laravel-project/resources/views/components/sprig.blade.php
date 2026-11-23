@props(['class' => ''])

@php
    $leaves = [
        ['x' => 36, 'y' => 46, 'rotate' => -42, 'scale' => 1],
        ['x' => 52, 'y' => 38, 'rotate' => -34, 'scale' => 0.92],
        ['x' => 68, 'y' => 30, 'rotate' => -26, 'scale' => 0.85],
        ['x' => 84, 'y' => 24, 'rotate' => -18, 'scale' => 0.78],
        ['x' => 45, 'y' => 49, 'rotate' => 42, 'scale' => 0.9],
        ['x' => 62, 'y' => 41, 'rotate' => 34, 'scale' => 0.82],
        ['x' => 79, 'y' => 34, 'rotate' => 26, 'scale' => 0.74],
        ['x' => 96, 'y' => 27, 'rotate' => 18, 'scale' => 0.66],
    ];
@endphp

<svg class="{{ $class }}" viewBox="0 0 160 70" fill="none" aria-hidden="true">
    <path d="M6 62C52 59 100 38 154 9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
    @foreach ($leaves as $leaf)
        <ellipse
            cx="{{ $leaf['x'] }}"
            cy="{{ $leaf['y'] }}"
            rx="{{ 10 * $leaf['scale'] }}"
            ry="{{ 4.4 * $leaf['scale'] }}"
            fill="currentColor"
            opacity="0.34"
            transform="rotate({{ $leaf['rotate'] }} {{ $leaf['x'] }} {{ $leaf['y'] }})"
        />
    @endforeach
</svg>

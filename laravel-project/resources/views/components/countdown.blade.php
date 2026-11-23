@props(['target'])

@php
    $targetDate = \Carbon\Carbon::parse($target);
    $diff = max($targetDate->getTimestamp() - now()->getTimestamp(), 0);

    $left = [
        'days' => intdiv($diff, 86_400),
        'hours' => intdiv($diff, 3_600) % 24,
        'minutes' => intdiv($diff, 60) % 60,
        'seconds' => $diff % 60,
    ];

    $cells = [
        ['value' => $left['days'], 'label' => \App\Support\Plural::count($left['days'], ['день', 'дня', 'дней'])],
        ['value' => $left['hours'], 'label' => \App\Support\Plural::count($left['hours'], ['час', 'часа', 'часов'])],
        ['value' => $left['minutes'], 'label' => \App\Support\Plural::count($left['minutes'], ['минута', 'минуты', 'минут'])],
        ['value' => $left['seconds'], 'label' => \App\Support\Plural::count($left['seconds'], ['секунда', 'секунды', 'секунд'])],
    ];
@endphp

<div
    class="countdown"
    role="timer"
    aria-label="До торжества осталось"
    data-countdown-target="{{ $target }}"
>
    @foreach ($cells as $cell)
        <div class="countdown__cell">
            <strong>{{ str_pad((string) $cell['value'], 2, '0', STR_PAD_LEFT) }}</strong>
            <span>{{ $cell['label'] }}</span>
        </div>
    @endforeach
</div>

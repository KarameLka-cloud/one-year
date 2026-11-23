@props([
    'year',
    'month',
    'eventDay',
])

@php
    $weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    $first = \Carbon\Carbon::create($year, $month, 1);
    $offset = ($first->dayOfWeek + 6) % 7; // неделя начинается с понедельника
    $daysInMonth = $first->daysInMonth;
    $cells = array_merge(
        array_fill(0, $offset, null),
        range(1, $daysInMonth),
    );
    $monthLabel = \Carbon\Carbon::create($year, $month, 1)
        ->locale(config('app.locale'))
        ->translatedFormat('F Y');
@endphp

<div class="calendar" role="group" aria-label="Календарь на {{ $monthLabel }}">
    <div class="calendar__weekdays" aria-hidden="true">
        @foreach ($weekdays as $day)
            <span>{{ $day }}</span>
        @endforeach
    </div>
    <div class="calendar__grid">
        @foreach ($cells as $index => $day)
            @if ($day === null)
                <span class="calendar__day calendar__day--empty"></span>
            @else
                <span
                    class="calendar__day{{ $day === $eventDay ? ' calendar__day--event' : '' }}"
                    @if ($day === $eventDay) aria-current="date" @endif
                    aria-label="{{ $day === $eventDay ? $day.' — день праздника' : (string) $day }}"
                >
                    @if ($day === $eventDay)
                        <span class="calendar__event-day">{{ $day }}</span>
                    @else
                        {{ $day }}
                    @endif
                </span>
            @endif
        @endforeach
    </div>
</div>

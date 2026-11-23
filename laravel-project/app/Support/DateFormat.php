<?php

namespace App\Support;

use Carbon\Carbon;
use DateTimeInterface;

final class DateFormat
{
    public static function display(?DateTimeInterface $date): string
    {
        if (! $date) {
            return '—';
        }

        return Carbon::instance($date)
            ->locale(config('app.locale'))
            ->translatedFormat('d M Y, H:i');
    }
}

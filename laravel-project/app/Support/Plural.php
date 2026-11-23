<?php

namespace App\Support;

final class Plural
{
    /**
     * @param  array{0: string, 1: string, 2: string}  $forms
     */
    public static function count(int $number, array $forms): string
    {
        $abs = abs($number) % 100;
        $last = $abs % 10;

        if ($abs > 10 && $abs < 20) {
            return $forms[2];
        }

        if ($last === 1) {
            return $forms[0];
        }

        if ($last >= 2 && $last <= 4) {
            return $forms[1];
        }

        return $forms[2];
    }

    public static function children(int $number): string
    {
        return self::count($number, ['ребёнок', 'ребёнка', 'детей']);
    }

    public static function records(int $number): string
    {
        return self::count($number, ['запись', 'записи', 'записей']);
    }
}

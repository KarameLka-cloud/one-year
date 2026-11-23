<?php

namespace App\Support;

final class TextSanitizer
{
    /**
     * Убирает управляющие символы, нормализует переводы строк и обрезает строку.
     */
    public static function clean(mixed $value, int $maxLength): string
    {
        $text = (string) ($value ?? '');

        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? '';
        $text = str_replace("\r\n", "\n", $text);
        $text = trim($text);

        return mb_substr($text, 0, $maxLength);
    }

    /**
     * То же самое, но с приведением всех пробелов к одному.
     */
    public static function cleanSingleLine(mixed $value, int $maxLength): string
    {
        $text = self::clean($value, $maxLength * 2);
        $text = preg_replace('/\s+/u', ' ', $text) ?? '';
        $text = trim($text);

        return mb_substr($text, 0, $maxLength);
    }
}

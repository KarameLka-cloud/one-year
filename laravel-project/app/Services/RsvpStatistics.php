<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

final class RsvpStatistics
{
    /**
     * Та же статистика, что считал Express API: каждый ответ — взрослый,
     * дополнительно учитывается пара и дети.
     *
     * @return array<string, int>
     */
    public function all(): array
    {
        $row = DB::table('rsvps')->selectRaw(<<<'SQL'
            COUNT(*) AS total,
            COUNT(*) + COALESCE(SUM(CASE WHEN pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END), 0) AS totalAdults,
            COALESCE(SUM(children), 0) AS totalChildren,
            COUNT(*) + COALESCE(SUM(CASE WHEN pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END), 0) + COALESCE(SUM(children), 0) AS totalPeople,
            COALESCE(SUM(CASE WHEN attendance = 'yes' THEN 1 ELSE 0 END), 0)
                + COALESCE(SUM(CASE WHEN attendance = 'yes' AND pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END), 0) AS comingAdults,
            COALESCE(SUM(CASE WHEN attendance = 'yes' THEN children ELSE 0 END), 0) AS comingChildren,
            COALESCE(SUM(CASE WHEN attendance = 'yes' THEN 1 ELSE 0 END), 0)
                + COALESCE(SUM(CASE WHEN attendance = 'yes' AND pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END), 0)
                + COALESCE(SUM(CASE WHEN attendance = 'yes' THEN children ELSE 0 END), 0) AS comingTotal,
            COALESCE(SUM(CASE WHEN attendance = 'no' THEN 1 ELSE 0 END), 0)
                + COALESCE(SUM(CASE WHEN attendance = 'no' AND pair IS NOT NULL AND TRIM(pair) != '' THEN 1 ELSE 0 END), 0)
                + COALESCE(SUM(CASE WHEN attendance = 'no' THEN children ELSE 0 END), 0) AS notComing
        SQL)->first();

        return [
            'total' => (int) ($row->total ?? 0),
            'totalAdults' => (int) ($row->totalAdults ?? 0),
            'totalChildren' => (int) ($row->totalChildren ?? 0),
            'totalPeople' => (int) ($row->totalPeople ?? 0),
            'comingAdults' => (int) ($row->comingAdults ?? 0),
            'comingChildren' => (int) ($row->comingChildren ?? 0),
            'comingTotal' => (int) ($row->comingTotal ?? 0),
            'notComing' => (int) ($row->notComing ?? 0),
        ];
    }
}

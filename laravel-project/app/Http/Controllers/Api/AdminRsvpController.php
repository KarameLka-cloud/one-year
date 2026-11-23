<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rsvp;
use App\Services\RsvpStatistics;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AdminRsvpController extends Controller
{
    public function index(Request $request, RsvpStatistics $statistics): JsonResponse
    {
        $page = max((int) $request->query('page', 1), 1);
        $limit = min(max((int) $request->query('limit', 10), 1), 100);
        $q = mb_substr(trim((string) $request->query('q', '')), 0, 120);

        $query = Rsvp::query()
            ->search($q)
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        $total = (clone $query)->count();

        $items = $query
            ->forPage($page, $limit)
            ->get()
            ->map(fn (Rsvp $rsvp) => $rsvp->toApiArray())
            ->all();

        return response()->json([
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'stats' => $statistics->all(),
        ]);
    }

    public function export(Request $request): Response
    {
        $q = mb_substr(trim((string) $request->query('q', '')), 0, 120);

        $rows = Rsvp::query()
            ->search($q)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();

        $escapeCell = static function (mixed $value): string {
            $text = (string) ($value ?? '');

            if (preg_match('/^[=+\-@\t\r]/u', $text)) {
                $text = "'".$text;
            }

            return '"'.str_replace('"', '""', $text).'"';
        };

        $header = ['ID', 'Дата', 'Имя', 'Пара', 'Присутствие', 'Дети'];
        $attendanceLabels = ['yes' => 'Придёт', 'no' => 'Не придёт'];

        $lines = $rows->map(function (Rsvp $rsvp) use ($escapeCell, $attendanceLabels) {
            return [
                $rsvp->id,
                $rsvp->created_at?->format('d.m.Y, H:i') ?? '',
                $rsvp->name,
                $rsvp->pair ?? '',
                $attendanceLabels[$rsvp->attendance] ?? $rsvp->attendance,
                $rsvp->children,
            ];
        })->map(fn (array $cells) => implode(';', array_map($escapeCell, $cells)));

        $csv = "\u{FEFF}".implode("\r\n", [
            implode(';', array_map($escapeCell, $header)),
            ...$lines->all(),
        ]);

        $filename = 'rsvps-'.now()->format('Y-m-d').'.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }

    public function destroy(Rsvp $rsvp): JsonResponse
    {
        $rsvp->delete();

        return response()->json(['ok' => true]);
    }
}

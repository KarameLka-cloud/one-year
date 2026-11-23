<?php

namespace App\Http\Controllers;

use App\Models\Rsvp;
use App\Support\TextSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RsvpController extends Controller
{
    /**
     * Принимает анкету гостя. Отвечает JSON для API/fetch-запросов
     * и редиректом для обычной отправки формы без JavaScript.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        // Honeypot: скрытое поле должно оставаться пустым.
        if (TextSanitizer::clean($request->input('company'), 80) !== '') {
            return $this->success($request);
        }

        $name = TextSanitizer::cleanSingleLine($request->input('name'), 120);
        $pair = TextSanitizer::cleanSingleLine($request->input('pair'), 120);
        $attendance = in_array($request->input('attendance'), ['yes', 'no'], true)
            ? (string) $request->input('attendance')
            : Rsvp::ATTENDANCE_YES;
        $children = (int) $request->input('children', 0);
        $children = min(max($children, 0), 20);

        if (mb_strlen($name) < 2) {
            $message = 'Напишите, пожалуйста, ваше имя';

            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Проверьте заполнение формы',
                    'fields' => ['name' => $message],
                ], 422);
            }

            return back()
                ->withErrors(['name' => $message])
                ->withInput($request->except(['company']));
        }

        $rsvp = Rsvp::create([
            'name' => $name,
            'pair' => $pair !== '' ? $pair : null,
            'attendance' => $attendance,
            'children' => $children,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'ok' => true,
                'id' => $rsvp->id,
            ], 201);
        }

        return redirect()
            ->to(route('invitation').'#rsvp')
            ->with('rsvp_success', true);
    }

    private function success(Request $request): JsonResponse|RedirectResponse
    {
        if ($request->expectsJson()) {
            return response()->json(['ok' => true, 'id' => null], 201);
        }

        return redirect()
            ->to(route('invitation').'#rsvp')
            ->with('rsvp_success', true);
    }
}

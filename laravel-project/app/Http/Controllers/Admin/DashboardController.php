<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rsvp;
use App\Services\RsvpStatistics;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(Request $request, RsvpStatistics $statistics): View
    {
        $q = mb_substr(trim((string) $request->query('q', '')), 0, 120);

        $records = Rsvp::query()
            ->search($q)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return view('admin.dashboard', [
            'records' => $records,
            'stats' => $statistics->all(),
            'q' => $q,
        ]);
    }

    public function destroy(Request $request, Rsvp $rsvp): JsonResponse|RedirectResponse
    {
        $rsvp->delete();

        if ($request->expectsJson()) {
            return response()->json(['ok' => true]);
        }

        return redirect()
            ->route('admin.dashboard', array_filter($request->only(['q', 'page'])))
            ->with('status', 'Запись удалена');
    }
}

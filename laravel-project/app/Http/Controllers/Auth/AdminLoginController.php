<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\View\View;

class AdminLoginController extends Controller
{
    public function showLogin(): View|RedirectResponse
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }

        return view('admin.login');
    }

    public function login(Request $request): JsonResponse|RedirectResponse
    {
        $login = Str::lower(trim((string) $request->input('login', '')));
        $password = (string) $request->input('password', '');

        if ($login === '' || $password === '') {
            return $this->fail($request, 'Введите логин и пароль', 400);
        }

        if (! Auth::guard('admin')->attempt(['login' => $login, 'password' => $password])) {
            return $this->fail($request, 'Неверный логин или пароль', 401);
        }

        $request->session()->regenerate();

        $admin = Auth::guard('admin')->user();

        if ($request->expectsJson()) {
            return response()->json([
                'admin' => [
                    'id' => $admin->id,
                    'login' => $admin->login,
                ],
            ]);
        }

        return redirect()->intended(route('admin.dashboard'));
    }

    public function me(Request $request): JsonResponse
    {
        $admin = Auth::guard('admin')->user();

        return response()->json([
            'admin' => [
                'id' => $admin->id,
                'login' => $admin->login,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse|RedirectResponse
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json(['ok' => true]);
        }

        return redirect()->route('admin.login');
    }

    private function fail(Request $request, string $message, int $status): JsonResponse|RedirectResponse
    {
        if ($request->expectsJson()) {
            return response()->json(['error' => $message], $status);
        }

        return back()
            ->withErrors(['login' => $message])
            ->withInput($request->only('login'));
    }
}

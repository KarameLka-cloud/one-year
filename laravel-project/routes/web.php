<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Api\AdminRsvpController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\RsvpController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Приглашение
|--------------------------------------------------------------------------
*/

Route::get('/', [InvitationController::class, 'index'])->name('invitation');
Route::post('/rsvp', [RsvpController::class, 'store'])
    ->middleware('throttle:rsvp')
    ->name('rsvp.store');

/*
|--------------------------------------------------------------------------
| Админка (обычные страницы и формы)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminLoginController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminLoginController::class, 'login'])
        ->middleware('throttle:admin-login')
        ->name('login.store');

    Route::middleware('auth:admin')->group(function () {
        Route::post('/logout', [AdminLoginController::class, 'logout'])->name('logout');
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::delete('/rsvps/{rsvp}', [DashboardController::class, 'destroy'])->name('rsvps.destroy');
    });
});

/*
|--------------------------------------------------------------------------
| JSON API
|--------------------------------------------------------------------------
|
| Сохранены прежние адреса Express API. Авторизация — та же сессия
| Laravel (httpOnly cookie), поэтому запросы из админки работают без
| отдельного токена. Для JSON-ответов отправляйте Accept: application/json.
|
*/

Route::prefix('api')->middleware('throttle:api')->group(function () {
    Route::get('/health', fn () => response()->json([
        'ok' => true,
        'service' => 'one-year-invitation',
        'time' => now()->toJSON(),
    ]))->name('api.health');

    Route::post('/rsvp', [RsvpController::class, 'store'])
        ->middleware('throttle:rsvp')
        ->name('api.rsvp.store');

    Route::post('/auth/login', [AdminLoginController::class, 'login'])
        ->middleware('throttle:admin-login')
        ->name('api.auth.login');

    Route::middleware('auth:admin')->group(function () {
        Route::get('/auth/me', [AdminLoginController::class, 'me'])->name('api.auth.me');
        Route::post('/auth/logout', [AdminLoginController::class, 'logout'])->name('api.auth.logout');

        Route::get('/admin/rsvps', [AdminRsvpController::class, 'index'])->name('api.admin.rsvps');
        Route::get('/admin/rsvps/export', [AdminRsvpController::class, 'export'])->name('api.admin.export');
        Route::delete('/admin/rsvps/{rsvp}', [AdminRsvpController::class, 'destroy'])->name('api.admin.destroy');
    });

    Route::any('/{any}', function (Request $request) {
        return response()->json(['error' => 'API: маршрут не найден'], 404);
    })->where('any', '.*')->name('api.fallback');
});

<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Carbon::setLocale(config('app.locale'));

        // Общий лимит API: 180 запросов в минуту с одного IP.
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(180)
                ->by($request->ip())
                ->response(fn () => response()->json(
                    ['error' => 'Слишком много запросов, попробуйте позже.'],
                    429,
                ));
        });

        // Отправка анкеты: не больше 30 раз в час с одного IP.
        RateLimiter::for('rsvp', function (Request $request) {
            return Limit::perHour(30)
                ->by($request->ip())
                ->response(function (Request $request) {
                    $message = 'Слишком много отправок. Попробуйте немного позже.';

                    if ($request->expectsJson()) {
                        return response()->json(['error' => $message], 429);
                    }

                    return back()->withErrors(['form' => $message])->withInput();
                });
        });

        // Вход в админку: не больше 10 попыток за 15 минут с одного IP.
        RateLimiter::for('admin-login', function (Request $request) {
            return Limit::perMinutes(15, 10)
                ->by($request->ip())
                ->response(function (Request $request) {
                    $message = 'Слишком много попыток входа. Попробуйте через 15 минут.';

                    if ($request->expectsJson()) {
                        return response()->json(['error' => $message], 429);
                    }

                    return back()
                        ->withErrors(['login' => $message])
                        ->withInput($request->only('login'));
                });
        });
    }
}

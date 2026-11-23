<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvitationPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_invitation_page_renders_content_and_rsvp_form(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('Аяна', false);
        $response->assertSee('первый день рождения', false);
        $response->assertSee('26 . 02 . 2027', false);
        $response->assertSee('«У Истока»', false);
        $response->assertSee('Ржанова ул., 43', false);
        $response->assertSee('анкета гостя', false);
        $response->assertSee('action="'.route('rsvp.store').'"', false);
        $response->assertSee('name="csrf-token"', false);
        $response->assertSee('data-countdown-target="'.config('invitation.date.iso').'"', false);
    }

    public function test_calendar_marks_the_celebration_day(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('февраль', false);
        $response->assertSee('2027', false);
        $response->assertSee('calendar__day--event', false);
        $response->assertSee('aria-current="date"', false);
        $response->assertSee('calendar__event-day">26</span>', false);
    }

    public function test_health_endpoint_returns_json(): void
    {
        $this->getJson('/api/health')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'service' => 'one-year-invitation',
            ]);
    }

    public function test_security_headers_are_present(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $this->assertStringContainsString(
            "default-src 'self'",
            (string) $response->headers->get('Content-Security-Policy'),
        );
    }

    public function test_unknown_api_route_returns_json_404(): void
    {
        $this->getJson('/api/unknown')
            ->assertNotFound()
            ->assertJson(['error' => 'API: маршрут не найден']);
    }
}

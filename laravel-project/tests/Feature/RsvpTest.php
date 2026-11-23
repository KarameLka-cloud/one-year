<?php

namespace Tests\Feature;

use App\Models\Rsvp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class RsvpTest extends TestCase
{
    use RefreshDatabase;

    public function test_tests_use_an_isolated_in_memory_database(): void
    {
        $this->assertSame(':memory:', DB::connection()->getDatabaseName());
    }

    public function test_guest_can_submit_rsvp_via_json(): void
    {
        $response = $this->postJson('/api/rsvp', [
            'name' => '  Анна   Петрова ',
            'pair' => 'Сергей и Мария',
            'attendance' => 'yes',
            'children' => 2,
        ]);

        $response->assertCreated()->assertJson(['ok' => true]);

        $this->assertDatabaseHas('rsvps', [
            'name' => 'Анна Петрова',
            'pair' => 'Сергей и Мария',
            'attendance' => 'yes',
            'children' => 2,
        ]);
    }

    public function test_empty_pair_is_stored_as_null(): void
    {
        $this->postJson('/api/rsvp', [
            'name' => 'Дмитрий',
            'pair' => '   ',
            'attendance' => 'no',
            'children' => 0,
        ])->assertCreated();

        $this->assertDatabaseHas('rsvps', [
            'name' => 'Дмитрий',
            'pair' => null,
            'attendance' => 'no',
        ]);
    }

    public function test_name_is_required(): void
    {
        $response = $this->postJson('/api/rsvp', [
            'name' => ' ',
            'attendance' => 'yes',
        ]);

        $response->assertUnprocessable()
            ->assertJsonPath('fields.name', 'Напишите, пожалуйста, ваше имя');

        $this->assertDatabaseCount('rsvps', 0);
    }

    public function test_honeypot_submission_is_silently_ignored(): void
    {
        $this->postJson('/api/rsvp', [
            'name' => 'Спам-бот',
            'attendance' => 'yes',
            'company' => 'ООО Ромашка',
        ])->assertCreated()->assertJson(['ok' => true, 'id' => null]);

        $this->assertDatabaseCount('rsvps', 0);
    }

    public function test_form_without_javascript_redirects_back_with_success_flash(): void
    {
        $response = $this->post('/rsvp', [
            'name' => 'Ольга Иванова',
            'attendance' => 'yes',
            'children' => 1,
        ]);

        $response->assertRedirect(route('invitation').'#rsvp');
        $response->assertSessionHas('rsvp_success', true);

        $this->assertDatabaseHas('rsvps', ['name' => 'Ольга Иванова']);
    }

    public function test_invalid_attendance_falls_back_to_yes_and_children_are_capped(): void
    {
        $this->postJson('/api/rsvp', [
            'name' => 'Гость',
            'attendance' => 'maybe',
            'children' => 99,
        ])->assertCreated();

        $this->assertDatabaseHas('rsvps', [
            'name' => 'Гость',
            'attendance' => Rsvp::ATTENDANCE_YES,
            'children' => 20,
        ]);
    }

    public function test_control_characters_are_removed_from_name(): void
    {
        $this->postJson('/api/rsvp', [
            'name' => "Ан\u{0000}на\nПетрова",
            'attendance' => 'yes',
        ])->assertCreated();

        $this->assertDatabaseHas('rsvps', ['name' => 'Анна Петрова']);
    }
}

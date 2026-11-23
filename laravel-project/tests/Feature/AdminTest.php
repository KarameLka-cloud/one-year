<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Rsvp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(string $password = 'secret-password'): Admin
    {
        return Admin::create([
            'login' => 'admin',
            'password_hash' => Hash::make($password),
        ]);
    }

    private function createRsvp(array $attributes = []): Rsvp
    {
        return Rsvp::create(array_merge([
            'name' => 'Анна Петрова',
            'pair' => 'Сергей и Мария',
            'attendance' => 'yes',
            'children' => 1,
        ], $attributes));
    }

    public function test_guests_are_redirected_to_login_page(): void
    {
        $this->get('/admin')->assertRedirect(route('admin.login'));
        $this->get('/api/auth/me')->assertUnauthorized();
        $this->getJson('/api/admin/rsvps')->assertUnauthorized();
    }

    public function test_login_page_is_available(): void
    {
        $this->get('/admin/login')
            ->assertOk()
            ->assertSee('вход в админку', false)
            ->assertSee('action="'.route('admin.login.store').'"', false);
    }

    public function test_admin_can_log_in_and_log_out(): void
    {
        $admin = $this->createAdmin();

        $this->post('/admin/login', [
            'login' => ' ADMIN ',
            'password' => 'secret-password',
        ])->assertRedirect(route('admin.dashboard'));

        $this->assertAuthenticatedAs($admin, 'admin');

        $this->post('/admin/logout')->assertRedirect(route('admin.login'));
        $this->assertGuest('admin');
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        $this->createAdmin();

        $this->postJson('/api/auth/login', [
            'login' => 'admin',
            'password' => 'wrong',
        ])->assertUnauthorized()->assertJson(['error' => 'Неверный логин или пароль']);

        $this->assertGuest('admin');
    }

    public function test_login_requires_both_fields(): void
    {
        $this->postJson('/api/auth/login', ['login' => 'admin'])
            ->assertBadRequest()
            ->assertJson(['error' => 'Введите логин и пароль']);
    }

    public function test_json_login_returns_admin_and_session_works(): void
    {
        $admin = $this->createAdmin();

        $this->postJson('/api/auth/login', [
            'login' => 'admin',
            'password' => 'secret-password',
        ])->assertOk()->assertJson([
            'admin' => ['id' => $admin->id, 'login' => 'admin'],
        ]);

        $this->getJson('/api/auth/me')
            ->assertOk()
            ->assertJson(['admin' => ['login' => 'admin']]);

        $this->postJson('/api/auth/logout')->assertOk()->assertJson(['ok' => true]);
        $this->assertGuest('admin');
    }

    public function test_dashboard_shows_records_and_statistics(): void
    {
        $this->actingAs($this->createAdmin(), 'admin');

        $this->createRsvp();
        $this->createRsvp([
            'name' => 'Дмитрий',
            'pair' => null,
            'attendance' => 'no',
            'children' => 0,
        ]);

        $this->get('/admin')
            ->assertOk()
            ->assertSee('Анна Петрова', false)
            ->assertSee('Дмитрий', false)
            ->assertSee('Сергей и Мария', false)
            ->assertSee('Придёт', false)
            ->assertSee('Не придёт', false);
    }

    public function test_dashboard_search_filters_records(): void
    {
        $this->actingAs($this->createAdmin(), 'admin');

        $this->createRsvp(['name' => 'Анна Петрова', 'pair' => null]);
        $this->createRsvp(['name' => 'Борис Смирнов', 'pair' => 'Мария']);

        $this->get('/admin?q=Анна')
            ->assertOk()
            ->assertSee('Анна Петрова', false)
            ->assertDontSee('Борис Смирнов', false);

        $this->get('/admin?q=Мария')
            ->assertOk()
            ->assertSee('Борис Смирнов', false)
            ->assertDontSee('Анна Петрова', false);
    }

    public function test_dashboard_paginates_ten_records_per_page(): void
    {
        $this->actingAs($this->createAdmin(), 'admin');

        for ($i = 1; $i <= 12; $i++) {
            $this->createRsvp(['name' => sprintf('Гость %02d', $i), 'pair' => null]);
        }

        $this->get('/admin')
            ->assertOk()
            ->assertSee('Гость 12', false)
            ->assertDontSee('Гость 01', false);

        $this->get('/admin?page=2')
            ->assertOk()
            ->assertSee('Гость 02', false)
            ->assertSee('Гость 01', false)
            ->assertDontSee('Гость 12', false);
    }

    public function test_api_lists_records_with_pagination_and_statistics(): void
    {
        $this->actingAs($this->createAdmin(), 'admin');

        $this->createRsvp();
        $this->createRsvp([
            'name' => 'Дмитрий',
            'pair' => null,
            'attendance' => 'no',
            'children' => 0,
        ]);

        $this->getJson('/api/admin/rsvps?limit=1')
            ->assertOk()
            ->assertJsonPath('total', 2)
            ->assertJsonPath('page', 1)
            ->assertJsonPath('limit', 1)
            ->assertJsonCount(1, 'items')
            ->assertJsonPath('stats.total', 2)
            ->assertJsonPath('stats.totalAdults', 3)
            ->assertJsonPath('stats.totalChildren', 1)
            ->assertJsonPath('stats.totalPeople', 4)
            ->assertJsonPath('stats.comingAdults', 2)
            ->assertJsonPath('stats.comingChildren', 1)
            ->assertJsonPath('stats.comingTotal', 3)
            ->assertJsonPath('stats.notComing', 1);
    }

    public function test_api_search_filters_records(): void
    {
        $this->actingAs($this->createAdmin(), 'admin');

        $this->createRsvp(['name' => 'Анна Петрова']);
        $this->createRsvp(['name' => 'Борис Смирнов', 'pair' => null]);

        $this->getJson('/api/admin/rsvps?q='.urlencode('Борис'))
            ->assertOk()
            ->assertJsonPath('total', 1)
            ->assertJsonPath('items.0.name', 'Борис Смирнов');
    }

    public function test_csv_export_contains_quoted_data(): void
    {
        $this->actingAs($this->createAdmin(), 'admin');

        $this->createRsvp(['name' => '=Анна "Петрова"', 'pair' => null, 'children' => 2]);

        $response = $this->get('/api/admin/rsvps/export');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

        $content = $response->getContent();

        $this->assertStringStartsWith("\u{FEFF}", $content);
        $this->assertStringContainsString('"ID";"Дата";"Имя"', $content);
        $this->assertStringContainsString('"\'=Анна ""Петрова"""', $content);
        $this->assertStringContainsString('"Придёт"', $content);
    }

    public function test_record_can_be_deleted_from_dashboard(): void
    {
        $this->actingAs($this->createAdmin(), 'admin');

        $rsvp = $this->createRsvp();

        $this->delete('/admin/rsvps/'.$rsvp->id)
            ->assertRedirect(route('admin.dashboard'));

        $this->assertDatabaseMissing('rsvps', ['id' => $rsvp->id]);
    }

    public function test_record_can_be_deleted_via_api(): void
    {
        $this->actingAs($this->createAdmin(), 'admin');

        $rsvp = $this->createRsvp();

        $this->deleteJson('/api/admin/rsvps/'.$rsvp->id)
            ->assertOk()
            ->assertJson(['ok' => true]);

        $this->assertDatabaseMissing('rsvps', ['id' => $rsvp->id]);
    }
}

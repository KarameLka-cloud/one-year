<?php

namespace Database\Seeders;

use App\Models\Rsvp;
use Illuminate\Database\Seeder;

class RsvpSeeder extends Seeder
{
    /**
     * Демонстрационные ответы добавляются только если включён SEED_DEMO
     * и таблица пока пуста.
     */
    public function run(): void
    {
        if (! config('invitation.seed_demo') || Rsvp::query()->exists()) {
            return;
        }

        $records = [
            ['Анна Петрова', 'Сергей и Мария', 'yes', 1],
            ['Ольга Иванова', null, 'yes', 2],
            ['Дмитрий', null, 'no', 0],
        ];

        foreach ($records as $index => [$name, $pair, $attendance, $children]) {
            Rsvp::create([
                'name' => $name,
                'pair' => $pair,
                'attendance' => $attendance,
                'children' => $children,
                'created_at' => now()->subMinutes(12 * ($index + 1)),
                'updated_at' => now()->subMinutes(12 * ($index + 1)),
            ]);
        }
    }
}

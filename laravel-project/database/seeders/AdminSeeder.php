<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $login = Str::lower(trim((string) config('invitation.admin.login')));
        $password = (string) config('invitation.admin.password');

        Admin::updateOrCreate(
            ['login' => $login],
            ['password_hash' => Hash::make($password)],
        );
    }
}

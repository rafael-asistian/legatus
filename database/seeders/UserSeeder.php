<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'rafael@legatus.mx'],
            [
                'name' => 'Rafael Castellanos',
                'email' => 'rafael@legatus.mx',
                'password' => Hash::make('nca140819'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}

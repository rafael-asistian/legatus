<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        Client::create([
            'name' => 'Alejandra (agente)',
            'email' => 'mariale2109@gmail.com',
            'phone' => '555-123-4567',
            'client_since' => now()->subDays(9),
            'status' => 'active',
        ]);

        Client::create([
            'name' => 'Juan Perez',
            'email' => 'juan.perez@example.com',
            'phone' => '555-987-6543',
            'client_since' => now()->subDays(20),
            'status' => 'active',
        ]);
        
        Client::create([
            'name' => 'Maria Lopez',
            'email' => 'maria.lopez@example.com',
            'phone' => '555-555-5555',
            'client_since' => now()->subDays(5),
            'status' => 'inactive',
        ]);
    }
}

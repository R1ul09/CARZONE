<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin CarZone',
            'email' => 'admin@carzone.com',
            'email_verified_at' => now(),
            'password' => Hash::make('carzone1234'),
            'role_id' => 2,
        ]);

        User::create([
            'name' => 'Empleado CarZone',
            'email' => 'empleado@carzone.com',
            'email_verified_at' => now(),
            'password' => Hash::make('carzone1234'),
            'role_id' => 3,
        ]);

        User::create([
            'name' => 'Cliente Demo',
            'email' => 'cliente@carzone.com',
            'email_verified_at' => now(),
            'password' => Hash::make('carzone1234'),
            'role_id' => 1,
        ]);
    }
}
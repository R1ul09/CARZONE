<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            ['id' => 1, 'nombre' => 'cliente',  'descripcion' => 'Cliente estándar del concesionario', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'nombre' => 'admin',    'descripcion' => 'Administrador con acceso total', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'nombre' => 'empleado', 'descripcion' => 'Empleado del concesionario', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
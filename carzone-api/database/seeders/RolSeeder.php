<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rol;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Rol::create([
            'id' => 1,
            'nombre' => 'cliente',
            'descripcion' => 'Cliente estándar del concesionario'
        ]);

        Rol::create([
            'id' => 2,
            'nombre' => 'admin',
            'descripcion' => 'Administrador con acceso total'
        ]);
    }
}
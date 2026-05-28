<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiciosSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('servicios')->insert([
            [
                'nombre'      => 'Prueba de Conducción',
                'descripcion' => 'Prueba dinámica del vehículo acompañado por un asesor.',
                'precio'      => 0.00,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nombre'      => 'Revisión mecánica',
                'descripcion' => 'Chequeo completo de 50 puntos clave del vehículo.',
                'precio'      => 49.99,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nombre'      => 'Tasación de vehículo',
                'descripcion' => 'Valoración de tu coche actual como parte de pago.',
                'precio'      => 0.00,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
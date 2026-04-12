<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Servicio;

class ServicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Servicio::create([
            'nombre' => 'Prueba de Conducción',
            'descripcion' => 'Prueba dinámica del vehículo acompañado por un asesor.',
            'precio' => 0
        ]);

        Servicio::create([
            'nombre' => 'Revisión mecánica',
            'descripcion' => 'Chequeo completo de 50 puntos clave del vehículo.',
            'precio' => 49.99
        ]);

        Servicio::create([
            'nombre' => 'Tasación de vehículo',
            'descripcion' => 'Valoración de tu coche actual como parte de pago.',
            'precio' => 0
        ]);
    }
}

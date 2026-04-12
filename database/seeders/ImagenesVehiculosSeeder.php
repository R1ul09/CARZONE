<?php

namespace Database\Seeders;

use App\Models\Coche;
use App\Models\ImagenVehiculo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class ImagenesVehiculosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Obtenemos todos los archivos dentro de 'public/coches'
        $archivos = Storage::disk('public')->allFiles('coches');

        foreach ($archivos as $ruta) {
            // Extraemos el nombre del modelo de la carpeta (ej: veneno_roadster)
            $partes = explode('/', $ruta);
            $nombreModeloDir = $partes[2] ?? null; 

            if ($nombreModeloDir) {
                // Limpiamos el nombre para la búsqueda
                $busquedaLimpia = str_replace(['_', '-'], ' ', $nombreModeloDir);
                
                // Buscamos el coche por la primera palabra del directorio
                $coche = Coche::where('modelo', 'like', "%" . explode(' ', $busquedaLimpia)[0] . "%")->first();
                
                if ($coche) {
                    // Usamos updateOrCreate para evitar duplicados si volvemos a ejecutar el seeder
                    ImagenVehiculo::updateOrCreate(
                        ['ruta' => $ruta],
                        [
                            'coche_id' => $coche->id,
                            'es_principal' => Str::contains($ruta, 'escaparate'),
                        ]
                    );
                } else {
                    $this->command->warn("No se encontró coche para la carpeta: $nombreModeloDir");
                }
            }
        }
    }
}
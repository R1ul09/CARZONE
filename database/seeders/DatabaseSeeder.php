<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Marca;
use App\Models\Coche;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            ServicioSeeder::class,
            RolSeeder::class
        ]);

        $marca = Marca::create(['nombre' => 'Tesla']);
        
        Coche::create([
            'modelo' => 'Model 3',
            'anio' => 2024,
            'precio' => 45000,
            'marca_id' => $marca->id
        ]);
    }
}

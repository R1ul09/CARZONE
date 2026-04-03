<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarcaSeeder extends Seeder
{
    public function run(): void
    {
        $marcas = [
            ['id' => 1, 'nombre' => 'Tesla'],
            ['id' => 2, 'nombre' => 'BMW'],
            ['id' => 3, 'nombre' => 'Audi'],
            ['id' => 4, 'nombre' => 'Lamborghini'],
            ['id' => 5, 'nombre' => 'Dacia'],
            ['id' => 6, 'nombre' => 'Toyota'],
            ['id' => 7, 'nombre' => 'Ferrari'],
        ];

        foreach ($marcas as $marca) {
            DB::table('marcas')->updateOrInsert(['id' => $marca['id']], $marca);
        }
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CocheSeeder extends Seeder
{
    public function run(): void
    {
        $coches = [
            ['modelo' => 'Model S Plaid', 'anio' => 2023, 'precio' => 120000, 'marca_id' => 1],
            ['modelo' => 'Model 3', 'anio' => 2022, 'precio' => 45000, 'marca_id' => 1],
            ['modelo' => 'Serie 3', 'anio' => 2021, 'precio' => 35000, 'marca_id' => 2],
            ['modelo' => 'X5 M', 'anio' => 2024, 'precio' => 110000, 'marca_id' => 2],
            ['modelo' => 'A3 Sportback', 'anio' => 2020, 'precio' => 28000, 'marca_id' => 3],
            ['modelo' => 'RS e-tron GT', 'anio' => 2023, 'precio' => 145000, 'marca_id' => 3],
            ['modelo' => 'Huracán STO', 'anio' => 2022, 'precio' => 320000, 'marca_id' => 4],
            ['modelo' => 'Sandero', 'anio' => 2023, 'precio' => 14000, 'marca_id' => 5],
            ['modelo' => 'Corolla Hybrid', 'anio' => 2022, 'precio' => 26000, 'marca_id' => 6],
            ['modelo' => '296 GTB', 'anio' => 2024, 'precio' => 300000, 'marca_id' => 7],
            ['modelo' => 'Huracan Performante', 'anio' => 2017, 'precio' => 280000, 'marca_id' => 4],
            ['modelo' => 'Veneno Roadster', 'anio' => 2014, 'precio' => 7630000, 'marca_id' => 4],
        ];

        foreach ($coches as $coche) {
            DB::table('coches')->insert($coche);
        }
    }
}
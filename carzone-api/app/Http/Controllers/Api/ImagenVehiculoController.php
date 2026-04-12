<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagenVehiculo;
use Illuminate\Http\Request;

class ImagenVehiculoController extends Controller
{
    public function index() {

        $imagenes = ImagenVehiculo::all();

        return response()->json($imagenes);
    }

    public function store(Request $request) {
        $request->validate([
            "coche_id" => "required|exists:coches,id",
            "ruta" => "required|string",
            "es_principal" => "boolean",
        ]);

        $imagen = ImagenVehiculo::create($request->all());

        return response()->json($imagen, 201);
    }
}

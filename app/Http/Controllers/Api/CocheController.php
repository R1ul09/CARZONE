<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coche;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CocheController extends Controller
{
    public function index()
    {
        return response()->json(Coche::with('marca')->get(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'modelo' => 'required|string|max:255',
            'anio' => 'required|integer',
            'precio' => 'required|numeric',
            'marca_id' => 'required|exists:marcas,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $coche = Coche::create($request->all());
        return response()->json($coche, 201);
    }

    public function show($id)
    {
        $coche = Coche::with('marca')->find($id);
        if (!$coche) return response()->json(['message' => 'No encontrado'], 404);
        return response()->json($coche, 200);
    }

    public function update(Request $request, $id)
    {
        // Buscamos el coche por ID
        $coche = Coche::find($id);

        if (!$coche) {
            return response()->json(['message' => 'No encontrado'], 404);
        }
        
        // Al usar $coche->fill() o update(), asegúrate de que el modelo Coche
        // tenga los campos en el array $fillable
        $coche->update($request->all());

        return response()->json($coche, 200);
    }

    public function destroy($id)
    {
        $coche = Coche::find($id);

        if (!$coche) {
            return response()->json(['message' => 'No encontrado'], 404);
        }
        
        $coche->delete();

        return response()->json(['message' => 'Coche eliminado'], 200);
    }
}
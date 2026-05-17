<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Marca;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MarcaController extends Controller
{
    public function index()
    {
        return response()->json(Marca::all(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'anio_fundacion' => 'nullable|integer|min:1800|max:' . date('Y'),
            'pais' => 'nullable|string|max:120',
            'descripcion' => 'nullable|string',
            'logo' => 'nullable|string',
            'imagen_hero' => 'nullable|string',
            'slogan' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $marca = Marca::create($request->all());

        return response()->json($marca, 201);
    }

    public function show($id)
    {
        $marca = Marca::find($id);

        if (!$marca) return response()->json(['message' => 'No encontrado'], 404);

        return response()->json($marca, 200);
    }

    public function update(Request $request, $id)
    {
        $marca = Marca::find($id);

        if (!$marca) return response()->json(['message' => 'No encontrado'], 404);

        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:255',
            'anio_fundacion' => 'nullable|integer|min:1800|max:' . date('Y'),
            'pais' => 'nullable|string|max:120',
            'descripcion' => 'nullable|string',
            'logo' => 'nullable|string',
            'imagen_hero' => 'nullable|string',
            'slogan' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $marca->update($request->all());

        return response()->json($marca, 200);
    }

    public function destroy($id)
    {
        $marca = Marca::find($id);

        if (!$marca) return response()->json(['message' => 'No encontrado'], 404);

        $marca->delete();
        
        return response()->json(['message' => 'Marca eliminada'], 200);
    }
}
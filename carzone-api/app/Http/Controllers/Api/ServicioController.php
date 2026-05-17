<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServicioController extends Controller
{
    public function index()
    {
        return response()->json(Servicio::all(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $servicio = Servicio::create($request->all());

        return response()->json($servicio, 201);
    }

    public function show($id)
    {
        $servicio = Servicio::find($id);

        if (!$servicio) return response()->json(['message' => 'No encontrado'], 404);

        return response()->json($servicio, 200);
    }

    public function update(Request $request, $id)
    {
        $servicio = Servicio::find($id);

        if (!$servicio) return response()->json(['message' => 'No encontrado'], 404);

        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'sometimes|required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $servicio->update($request->all());

        return response()->json($servicio, 200);
    }

    public function destroy($id)
    {
        $servicio = Servicio::find($id);

        if (!$servicio) return response()->json(['message' => 'No encontrado'], 404);

        $servicio->delete();
        
        return response()->json(['message' => 'Servicio eliminado'], 200);
    }
}
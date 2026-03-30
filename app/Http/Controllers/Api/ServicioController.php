<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    public function index()
    {
        return response()->json(Servicio::all(), 200);
    }

    public function store(Request $request)
    {
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
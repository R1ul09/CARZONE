<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Marca;
use Illuminate\Http\Request;

class MarcaController extends Controller
{
    public function index()
    {
        return response()->json(Marca::all(), 200);
    }

    public function store(Request $request)
    {
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
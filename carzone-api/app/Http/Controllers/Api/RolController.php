<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use Illuminate\Http\Request;

class RolController extends Controller
{
    public function index()
    {
        return response()->json(Rol::all(), 200);
    }

    public function store(Request $request)
    {
        $rol = Rol::create($request->all());

        return response()->json($rol, 201);
    }

    public function show($id)
    {
        $rol = Rol::find($id);

        if (!$rol) return response()->json(['message' => 'No encontrado'], 404);

        return response()->json($rol, 200);
    }

    public function update(Request $request, $id)
    {
        $rol = Rol::find($id);

        if (!$rol) return response()->json(['message' => 'No encontrado'], 404);

        $rol->update($request->all());

        return response()->json($rol, 200);
    }

    public function destroy($id)
    {
        $rol = Rol::find($id);

        if (!$rol) return response()->json(['message' => 'No encontrado'], 404);

        $rol->delete();
        
        return response()->json(['message' => 'Rol eliminado'], 200);
    }
}
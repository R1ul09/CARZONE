<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RolController extends Controller
{
    public function index()
    {
        return response()->json(Rol::all(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100|unique:roles,nombre',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

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

        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:100|unique:roles,nombre,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

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
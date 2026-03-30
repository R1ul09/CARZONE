<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Financiacion;
use Illuminate\Http\Request;

class FinanciacionController extends Controller
{
    public function index()
    {
        return response()->json(Financiacion::all(), 200);
    }

    public function store(Request $request)
    {
        $financiacion = Financiacion::create($request->all());

        return response()->json($financiacion, 201);
    }

    public function show($id)
    {
        $financiacion = Financiacion::find($id);

        if (!$financiacion) return response()->json(['message' => 'No encontrado'], 404);

        return response()->json($financiacion, 200);
    }

    public function update(Request $request, $id)
    {
        $financiacion = Financiacion::find($id);

        if (!$financiacion) return response()->json(['message' => 'No encontrado'], 404);

        $financiacion->update($request->all());

        return response()->json($financiacion, 200);
    }

    public function destroy($id)
    {
        $financiacion = Financiacion::find($id);

        if (!$financiacion) return response()->json(['message' => 'No encontrado'], 404);

        $financiacion->delete();

        return response()->json(['message' => 'Financiacion eliminada'], 200);
    }
}
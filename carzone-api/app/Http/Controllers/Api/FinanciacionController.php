<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Financiacion;
use Illuminate\Http\Request;

class FinanciacionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Financiacion::with(['coche.marca'])->orderBy('created_at', 'desc');

        if ($user && $user->rol?->nombre !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $financiaciones = $query->get();

        return response()->json($financiaciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'coche_id'       => 'required|exists:coches,id',
            'meses'          => 'required|integer',
            'cuota_mensual'  => 'required|numeric',
            'entrada'        => 'required|numeric',
            'interes'        => 'required|numeric',
        ]);

        $financiacion = Financiacion::create([
            'user_id'       => $request->user()->id,
            'coche_id'      => $request->coche_id,
            'meses'         => $request->meses,
            'cuota_mensual' => $request->cuota_mensual,
            'entrada'       => $request->entrada,
            'interes'       => $request->interes,
        ]);

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

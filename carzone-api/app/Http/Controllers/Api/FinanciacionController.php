<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\FinanciacionSolicitadaMail;
use App\Mail\FinanciacionRespondidaMail;
use App\Models\Financiacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class FinanciacionController extends Controller
{
    // Listar las financiaciones del usuario autenticado
    public function index(Request $request)
    {
        $financiaciones = Financiacion::with(['coche.marca'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($financiaciones);
    }

    // Crear una nueva solicitud de financiación
    public function store(Request $request)
    {
        $request->validate([
            'coche_id' => 'required|exists:coches,id',
            'meses' => 'required|integer',
            'cuota_mensual'=> 'required|numeric',
            'entrada' => 'required|numeric',
            'interes' => 'required|numeric',
        ]);

        $financiacion = Financiacion::create([
            'user_id' => $request->user()->id,
            'coche_id' => $request->coche_id,
            'meses' => $request->meses,
            'cuota_mensual'=> $request->cuota_mensual,
            'entrada' => $request->entrada,
            'interes' => $request->interes,
            'estado' => 'pendiente',
        ]);

        // Cargamos las relaciones necesarias para el email
        $financiacion->load(['user', 'coche.marca']);

        // Avisamos al cliente de que su solicitud ha llegado
        Mail::to($financiacion->user->email)
            ->send(new FinanciacionSolicitadaMail($financiacion));

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

    // Un admin o empleado acepta o deniega una financiación
    public function responder(Request $request, $id)
    {
        $financiacion = Financiacion::find($id);
        if (!$financiacion) return response()->json(['message' => 'No encontrado'], 404);

        $request->validate([
            'estado' => 'required|in:aceptada,denegada',
        ]);

        $financiacion->update(['estado' => $request->estado]);
        $financiacion->load(['user', 'coche.marca']);

        // Avisamos al cliente con la respuesta
        Mail::to($financiacion->user->email)
            ->send(new FinanciacionRespondidaMail($financiacion));

        return response()->json([
            'message' => 'Financiación ' . $request->estado . ' correctamente',
            'financiacion' => $financiacion,
        ], 200);
    }

    // Solo el dueño o un admin puede eliminar una financiación
    public function destroy($id)
    {
        $financiacion = Financiacion::find($id);
        if (!$financiacion) return response()->json(['message' => 'No encontrado'], 404);

        $user = Auth::user();
        $rolNombre = $user->rol?->nombre;

        if ($financiacion->user_id !== $user->id && !in_array($rolNombre, ['admin'])) {
            return response()->json(['message' => 'No tienes permiso para eliminar esta financiación'], 403);
        }

        $financiacion->delete();
        return response()->json(['message' => 'Financiación eliminada'], 200);
    }

    // Listar todas las financiaciones (admin / empleado)
    public function todas()
    {
        $financiaciones = Financiacion::with(['coche.marca', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($financiaciones);
    }
}
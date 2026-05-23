<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class CitaController extends Controller
{
    // Listar citas del usuario autenticado
    public function index(Request $request)
    {
        $citas = Cita::with(['coche.marca', 'servicio'])
            ->where('user_id', $request->user()->id)
            ->orderBy('fecha', 'asc')
            ->orderBy('hora', 'asc')
            ->get();

        return response()->json($citas);
    }

    // Crear una cita
    public function store(Request $request)
    {
        $validador = Validator::make($request->all(), [
            'servicio_id' => 'required|exists:servicios,id',
            'coche_id' => 'nullable|exists:coches,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|date_format:H:i',
        ]);

        if ($validador->fails()) {
            return response()->json($validador->errors(), 422);
        }

        $hora = $request->hora;
        if ($hora < '09:00' || $hora > '20:00') {
            return response()->json([
                'message' => 'El concesionario está cerrado a esa hora. El horario es de 09:00 a 20:00.'
            ], 422);
        }

        // ── NUEVO: evitar que el mismo usuario tenga dos citas a la misma hora el mismo día ──
        $yaTimeCita = Cita::where('user_id', Auth::id())
            ->where('fecha', $request->fecha)
            ->where('hora', $request->hora)
            ->whereNotIn('estado', ['cancelada'])
            ->exists();

        if ($yaTimeCita) {
            return response()->json([
                'message' => 'Ya tienes una cita a esa hora. Elige otro horario.'
            ], 409);
        }

        // Comprobar también que el coche no está ocupado a esa hora
        if ($request->coche_id) {
            $cocheOcupado = Cita::where('coche_id', $request->coche_id)
                ->where('fecha', $request->fecha)
                ->where('hora', $request->hora)
                ->whereNotIn('estado', ['cancelada'])
                ->exists();

            if ($cocheOcupado) {
                return response()->json([
                    'message' => 'Este coche ya tiene una cita programada a esa hora.'
                ], 409);
            }
        }

        $cita = Cita::create([
            'user_id' => Auth::id(),
            'servicio_id' => $request->servicio_id,
            'coche_id' => $request->coche_id,
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'estado' => 'pendiente',
        ]);

        return response()->json($cita->load(['servicio', 'coche.marca']), 201);
    }

    // Ver detalle de una cita
    public function show($id)
    {
        $cita = Cita::with(['user', 'coche.marca', 'servicio'])->find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $user = Auth::user();
        $rolNombre = $user->rol?->nombre;

        if (!in_array($rolNombre, ['admin', 'empleado']) && $cita->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso'], 403);
        }

        return response()->json($cita, 200);
    }

    // Modificar una cita
    public function update(Request $request, $id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $user = Auth::user();
        $rolNombre = $user->rol?->nombre;
        $esAdminOEmpleado = in_array($rolNombre, ['admin', 'empleado']);

        if (!$esAdminOEmpleado && $cita->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para editar esta cita'], 403);
        }

        $validator = Validator::make($request->all(), [
            'servicio_id' => 'exists:servicios,id',
            'coche_id' => 'nullable|exists:coches,id',
            'fecha' => 'date|after_or_equal:today',
            'hora' => 'date_format:H:i',
            'estado' => 'string|in:pendiente,confirmada,cancelada,realizada,hora_ocupada',
            'mensaje_empleado' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->has('hora')) {
            $hora = $request->hora;
            if ($hora < '09:00' || $hora > '20:00') {
                return response()->json([
                    'message' => 'Fuera del horario (09:00-20:00).'
                ], 422);
            }
        }

        // Los clientes solo pueden cancelar su propia cita
        if (!$esAdminOEmpleado && $request->has('estado') && $request->estado !== 'cancelada') {
            return response()->json([
                'message' => 'Solo un empleado o administrador puede cambiar el estado a ' . $request->estado
            ], 403);
        }

        // Los clientes no pueden escribir el campo de mensaje
        if (!$esAdminOEmpleado && $request->has('mensaje_empleado')) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $cita->update($request->only([
            'servicio_id', 'coche_id', 'fecha', 'hora',
            'estado', 'mensaje_empleado',
        ]));

        return response()->json([
            'message' => 'Cita actualizada correctamente',
            'cita' => $cita->fresh(['servicio', 'coche.marca']),
        ], 200);
    }

    // Eliminar una cita
    public function destroy($id)
    {
        $cita = Cita::find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $user = Auth::user();
        $rolNombre = $user->rol?->nombre;

        if (!in_array($rolNombre, ['admin', 'empleado']) && $cita->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para eliminar esta cita'], 403);
        }

        $cita->delete();

        return response()->json(['message' => 'Cita eliminada correctamente'], 200);
    }

    // Listar todas las citas (empleado / admin)
    public function todas(): JsonResponse
    {
        $citas = Cita::with(['servicio', 'coche.marca', 'user'])
            ->orderBy('fecha', 'asc')
            ->orderBy('hora', 'asc')
            ->get();

        return response()->json($citas);
    }
}
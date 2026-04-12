<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CitaController extends Controller
{
    // Listar citas
    public function index()
    {
        $user = Auth::user();

        // Si es admin, ve todas las citas con la info del usuario, coche y servicio
        if ($user->rol->nombre === 'admin') {
            $citas = Cita::with(['user', 'coche', 'servicio'])->get();
        } else {
            // Si es cliente, solo ve las suyas
            $citas = Cita::with(['coche', 'servicio'])
                        ->where('user_id', $user->id)
                        ->get();
        }

        return response()->json($citas, 200);
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

        // miramos si la hora esta dentro de la hora buena
        $hora = $request->hora;
        if ($hora < '09:00' || $hora > '20:00') {
            return response()->json(['message' => 'El concesionario está cerrado a esa hora. El horario es de 09:00 a 20:00.'], 422);
        }

        // validamos solapamiento (¿Está el coche ocupado?)
        if ($request->coche_id) {
            $existeCita = Cita::where('coche_id', $request->coche_id)
                ->where('fecha', $request->fecha)
                ->where('hora', $request->hora)
                ->where('estado', '!=', 'cancelada')
                ->exists();

            if ($existeCita) {
                return response()->json(['message' => 'Este coche ya tiene una cita programada para esa hora.'], 422);
            }
        }

        // Si todo está ok, creamos
        $cita = Cita::create([
            'user_id' => Auth::id(),
            'servicio_id' => $request->servicio_id,
            'coche_id' => $request->coche_id,
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'estado' => 'pendiente',
        ]);

        return response()->json($cita, 201);
    }

    // Ver detalle de una cita
    public function show($id)
    {
        $cita = Cita::with(['user', 'coche', 'servicio'])->find($id);

        if (!$cita) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        // Un cliente no puede ver la cita de otro
        if (Auth::user()->rol->nombre !== 'admin' && $cita->user_id !== Auth::id()) {
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

        // Seguridad: Si no es admin y la cita no es suya, fuera
        if ($user->rol->nombre !== 'admin' && $cita->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para editar esta cita'], 403);
        }

        $hora = $request->hora;
        if ($hora < '09:00' || $hora > '20:00') {
            return response()->json(['message' => 'El concesionario está cerrado a esa hora. El horario es de 09:00 a 20:00.'], 422);
        }

        // validamos solapamiento (¿Está el coche ocupado?)
        if ($request->coche_id) {
            $existeCita = Cita::where('coche_id', $request->coche_id)
                ->where('fecha', $request->fecha)
                ->where('hora', $request->hora)
                ->where('estado', '!=', 'cancelada')
                ->exists();

            if ($existeCita) {
                return response()->json(['message' => 'Este coche ya tiene una cita programada para esa hora.'], 422);
            }
        }

        // Validación
        $validator = Validator::make($request->all(), [
            'servicio_id' => 'exists:servicios,id',
            'coche_id'    => 'nullable|exists:coches,id',
            'fecha'       => 'date|after_or_equal:today',
            'hora'        => 'string',
            'estado'      => 'string|in:pendiente,confirmada,cancelada,realizada'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Lógica de negocio: Un cliente NO debería poder marcar su propia cita como "realizada"
        // Solo el admin debería poder cambiar el estado a 'confirmada' o 'realizada'
        if ($user->rol->nombre !== 'admin' && $request->has('estado')) {
            if ($request->estado !== 'cancelada') { // Al cliente solo le dejamos cancelar
                return response()->json(['message' => 'Solo un administrador puede cambiar el estado a ' . $request->estado], 403);
            }
        }

        $cita->update($request->all());

        return response()->json([
            'message' => 'Cita actualizada correctamente',
            'cita' => $cita
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

        // Seguridad: Si no es admin y la cita no es suya, fuera
        if ($user->rol->nombre !== 'admin' && $cita->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para eliminar esta cita'], 403);
        }

        $cita->delete();

        return response()->json(['message' => 'Cita eliminada correctamente'], 200);
    }
}
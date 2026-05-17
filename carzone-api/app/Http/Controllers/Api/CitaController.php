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
    // Listar citas
    public function index(Request $request)
    {
        $citas = Cita::with(['coche.marca'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
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

        $user = Auth::user();
        $rolNombre = $user->rol?->nombre;
        // Un cliente no puede ver la cita de otro; admin y empleados sí pueden
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

        // Seguridad: Si no es admin/empleado y la cita no es suya, fuera
        if (!$esAdminOEmpleado && $cita->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para editar esta cita'], 403);
        }

        // Solo validar hora si se envía
        if ($request->has('hora')) {
            $hora = $request->hora;
            if ($hora < '09:00' || $hora > '20:00') {
                return response()->json(['message' => 'El concesionario está cerrado a esa hora. El horario es de 09:00 a 20:00.'], 422);
            }
        }

        // validamos solapamiento (¿Está el coche ocupado?)
        if ($request->has('coche_id') && $request->coche_id) {
            $existeCita = Cita::where('coche_id', $request->coche_id)
                ->where('fecha', $request->fecha ?? $cita->fecha)
                ->where('hora', $request->hora ?? $cita->hora)
                ->where('estado', '!=', 'cancelada')
                ->where('id', '!=', $id)
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

        // Lógica de negocio: los clientes solo pueden cancelar su propia cita
        // Admin y empleados pueden cambiar cualquier estado
        if (!$esAdminOEmpleado && $request->has('estado')) {
            if ($request->estado !== 'cancelada') {
                return response()->json(['message' => 'Solo un empleado o administrador puede cambiar el estado a ' . $request->estado], 403);
            }
        }

        // Actualizar solo los campos permitidos (evitar mass assignment de campos ajenos)
        $cita->update($request->only(['servicio_id', 'coche_id', 'fecha', 'hora', 'estado']));

        return response()->json([
            'message' => 'Cita actualizada correctamente',
            'cita' => $cita->fresh()
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

        // Seguridad: Si no es admin (role_id 2) y la cita no es suya, fuera
        if ($user->role_id !== 2 && $cita->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para eliminar esta cita'], 403);
        }

        $cita->delete();

        return response()->json(['message' => 'Cita eliminada correctamente'], 200);
    }

    // Método para empleados: Listar todas las citas
    public function todas(): JsonResponse
    {
        $citas = Cita::with(['servicio', 'coche.marca', 'user'])
            ->orderBy('fecha', 'asc')
            ->get();

        return response()->json($citas);
    }

}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagenVehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImagenVehiculoController extends Controller
{
    public function index()
    {
        return response()->json(ImagenVehiculo::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'coche_id' => 'required|exists:coches,id',
            // Acepta fichero subido O URL externa
            'imagen' => 'required_without:ruta|file|image|mimes:jpeg,jpg,png,webp|max:5120',
            'ruta' => 'required_without:imagen|string|url',
            'es_principal'=> 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            // Subida desde el ordenador → guardamos en storage/app/public/coches/
            $path = $request->file('imagen')->store('coches', 'public');
            // el accessor del modelo añade asset('storage/...')
            $ruta = $path;
        } else {
            // URL externa que el empleado pega manualmente
            // Guardamos solo la URL tal cual (el accessor la devuelve intacta si ya es http)
            $ruta = $request->ruta;
        }

        // Si se marca como principal, quitamos la flag al resto del coche
        if ($request->boolean('es_principal')) {
            ImagenVehiculo::where('coche_id', $request->coche_id)
                ->update(['es_principal' => false]);
        }

        $imagen = ImagenVehiculo::create([
            'coche_id' => $request->coche_id,
            'ruta' => $ruta,
            'es_principal'=> $request->boolean('es_principal'),
        ]);

        return response()->json($imagen, 201);
    }

    public function destroy($id)
    {
        $imagen = ImagenVehiculo::findOrFail($id);

        // Si la ruta es local (no empieza por http) la borramos del disco
        if ($imagen->getRawOriginal('ruta') && !str_starts_with($imagen->getRawOriginal('ruta'), 'http')) {
            Storage::disk('public')->delete($imagen->getRawOriginal('ruta'));
        }

        $imagen->delete();

        return response()->json(['message' => 'Imagen eliminada'], 200);
    }
}
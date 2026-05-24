<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Marca;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MarcaController extends Controller
{
    public function index()
    {
        return response()->json(Marca::all(), 200);
    }

    public function store(Request $request)
    {
        $data = $this->procesarDatos($request, new Marca());
        $marca = Marca::create($data);
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

        $data = $this->procesarDatos($request, $marca);
        $marca->update($data);
        return response()->json($marca, 200);
    }

    public function destroy($id)
    {
        $marca = Marca::find($id);
        if (!$marca) return response()->json(['message' => 'No encontrado'], 404);

        // Limpiar archivos locales si existen
        foreach (['logo', 'imagen_hero'] as $campo) {
            $ruta = $marca->getRawOriginal($campo);
            if ($ruta && !str_starts_with($ruta, 'http')) {
                Storage::disk('public')->delete($ruta);
            }
        }

        $marca->delete();
        return response()->json(['message' => 'Marca eliminada'], 200);
    }

    // Procesa ficheros subidos y devuelve el array de datos listo para guardar
    private function procesarDatos(Request $request, Marca $marca): array
    {
        $data = $request->except(['logo_file', 'imagen_hero_file']);

        // Logo
        if ($request->hasFile('logo_file')) {
            // Borrar el logo anterior si era local
            $rutaAnterior = $marca->getRawOriginal('logo');
            if ($rutaAnterior && !str_starts_with($rutaAnterior, 'http')) {
                Storage::disk('public')->delete($rutaAnterior);
            }
            $data['logo'] = $request->file('logo_file')->store('marcas/logos', 'public');
        }

        // Imagen hero
        if ($request->hasFile('imagen_hero_file')) {
            $rutaAnterior = $marca->getRawOriginal('imagen_hero');
            if ($rutaAnterior && !str_starts_with($rutaAnterior, 'http')) {
                Storage::disk('public')->delete($rutaAnterior);
            }
            $data['imagen_hero'] = $request->file('imagen_hero_file')->store('marcas/hero', 'public');
        }

        return $data;
    }
}
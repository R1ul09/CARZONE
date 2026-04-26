<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coche;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CocheController extends Controller
{
    public function index(Request $request)
    {
        // vamos a hacer que se pueda filtrar por cualquier campo del modelo coche, para eso vamos a usar
        $cochesFiltrados = Coche::with(['marca', 'imagenPrincipal'])
            // el metodo when sirve para filtro si el campo existe en la request, si no existe pues nada
            // es mucho mejor que muchos if para cada campo
            ->when($request->input('modelo'), function ($query, $modelo) {
                $query->where('modelo', 'like', '%' . $modelo . '%');
            })
            ->when($request->input('precio_min'), function ($query, $precioMin) {
                $query->where('precio', '>=', $precioMin);
            })
            ->when($request->input('precio_max'), function ($query, $precioMax) {
                $query->where('precio', '<=', $precioMax);
            })
            ->when($request->input('anio'), function ($query, $anio) {
                $query->where('anio', $anio);
            })
            ->when($request->input('marca'), function ($query, $marca) {
                $query->whereHas('marca', function($q) use ($marca) {
                    $q->where('nombre', 'like', '%' . $marca . '%');
                });
            })
            ->when($request->input('ids'), function ($query, $ids) {
                $idsArray = explode(',', $ids);
                $query->whereIn('id', $idsArray);
            })
            ->get();

        // Finalmente, obtenemos los resultados
        $coches = $cochesFiltrados;

        return response()->json($coches, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'modelo' => 'required|string|max:255',
            'anio' => 'required|integer',
            'precio' => 'required|numeric',
            'marca_id' => 'required|exists:marcas,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $coche = Coche::create($request->all());
        return response()->json($coche, 201);
    }

    public function show($id)
    {
        $coche = Coche::with(['marca', 'imagenes'])->find($id);

        if (!$coche) return response()->json(['message' => 'No encontrado'], 404);

        return response()->json($coche, 200);
    }

    public function update(Request $request, $id)
    {
        // Buscamos el coche por ID
        $coche = Coche::find($id);

        if (!$coche) {
            return response()->json(['message' => 'No encontrado'], 404);
        }
        
        $coche->update($request->all());

        return response()->json($coche, 200);
    }

    public function destroy($id)
    {
        $coche = Coche::find($id);

        if (!$coche) {
            return response()->json(['message' => 'No encontrado'], 404);
        }
        
        $coche->delete();

        return response()->json(['message' => 'Coche eliminado'], 200);
    }
}
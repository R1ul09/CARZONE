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
        $query = Coche::with(['marca', 'imagenPrincipal'])
            // el metodo when sirve para filtro si el campo existe en la request, si no existe pues nada
            // es mucho mejor que muchos if para cada campo
            ->when($request->input('modelo'), function ($q, $modelo) {
                $q->where('modelo', 'like', '%' . $modelo . '%');
            })
            ->when($request->input('precio_min'), function ($q, $precioMin) {
                $q->where('precio', '>=', $precioMin);
            })
            ->when($request->input('precio_max'), function ($q, $precioMax) {
                $q->where('precio', '<=', $precioMax);
            })
            ->when($request->input('anio'), function ($q, $anio) {
                $q->where('anio', $anio);
            })
            ->when($request->input('marca_id'), function ($q, $marcaId) {
                $q->where('marca_id', $marcaId);
            })
            ->when($request->input('tipo_carroceria'), function ($q, $tipo) {
                $q->where('tipo_carroceria', $tipo);
            })
            ->when($request->input('combustible'), function ($q, $combustible) {
                $q->where('combustible', $combustible);
            })
            ->when($request->input('precio_max'), function ($q, $precioMax) {
                $q->where('precio', '<=', $precioMax);
            })
            ->when($request->input('orden'), function ($q, $orden) {
                match($orden) {
                    'precio_asc'   => $q->orderBy('precio', 'asc'),
                    'precio_desc'  => $q->orderBy('precio', 'desc'),
                    'anio_desc'    => $q->orderBy('anio', 'desc'),
                    'potencia_desc'=> $q->orderBy('potencia', 'desc'),
                    default        => null
                };
            })
            ->when($request->input('marca'), function ($q, $marca) {
                $q->whereHas('marca', function($subq) use ($marca) {
                    $subq->where('nombre', 'like', '%' . $marca . '%');
                });
            })
            ->when($request->input('ids'), function ($q, $ids) {
                $idsArray = array_filter(explode(',', $ids));
                if (!empty($idsArray)) {
                    $q->whereIn('id', $idsArray);
                }
            });
        
        $coches = $query->get();

        // Finalmente, obtenemos los resultados
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
        $coche = Coche::with(['marca', 'imagenes', 'imagenPrincipal'])->find($id);

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

    public function cambiarDisponibilidad(Request $request, $id)
    {
        $coche = Coche::find($id);

        if (!$coche) {
            return response()->json(['message' => 'Coche no encontrado'], 404);
        }

        $request->validate([
            'disponible' => 'required|boolean'
        ]);

        $coche->disponible = $request->disponible;
        $coche->save();

        return response()->json($coche, 200);
    }
}

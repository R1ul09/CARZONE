<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        // Si el usuario no existe o su rol no coincide
        // Comprobamos directamente el nombre a través de la relación
        if (!$user || !$user->rol || $user->rol->nombre !== $role) {
            return response()->json([
                'message' => "Acceso denegado. Tu rol es '" . ($user->rol->nombre ?? 'desconocido') . "' y necesitas ser '$role'."
            ], 403);
        }

        return $next($request);
    }
}

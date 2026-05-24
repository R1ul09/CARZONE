<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Login con cookie HttpOnly
     *
     * No devuelve ningún token. El navegador recibe una cookie de sesión
     * que enviará automáticamente en cada petición posterior.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();
        // cargamos el rol para que el frontend sepa a dónde redirigir
        $user->load('rol');

        return response()->json([
            'user'           => $user,
            'email_verified' => !is_null($user->email_verified_at),
            'message'        => "¡Bienvenido de nuevo, {$user->name}!",
        ]);
    }

    /**
     * Logout: invalida la sesión y limpia la cookie.
     */
    public function destroy(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}
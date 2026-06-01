<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * Controlador de login con token de API
 * 
 * Usado exclusivamente por los tests automatizados (pytest).
 */
class TokenLoginController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Las credenciales no son correctas.'
            ], 422);
        }

        // Borramos tokens anteriores del mismo usuario para no acumular basura
        $user->tokens()->where('name', 'pytest')->delete();

        // Creamos un token nuevo identificado como 'pytest'
        $token = $user->createToken('pytest')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }
}
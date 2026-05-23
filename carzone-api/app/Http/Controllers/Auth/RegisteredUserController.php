<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
    /**
     * Registra un nuevo usuario.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
            'role_id' => 1,
        ]);

        // Esto dispara el envío del email de verificación
        event(new Registered($user));

        // Login con sesión (cookie HttpOnly, no token manual)
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'user' => $user,
            'email_verified' => false,
            'message' => 'Cuenta creada. Revisa tu email para verificar tu cuenta.',
        ], 201);
    }
}
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
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

        // Intentamos enviar el email de verificación
        try {
            event(new Registered($user));
        } catch (\Exception $e) {
            Log::warning('Email de verificación no enviado: ' . $e->getMessage());
        }

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'user'           => $user,
            'email_verified' => false,
            'message'        => 'Cuenta creada. Revisa tu email para verificar tu cuenta.',
        ], 201);
    }
}
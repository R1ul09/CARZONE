<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\BienvenidaMail;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * edirige al usuario a la pantalla de login de Google
     */
    public function redirect()
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    /**
     * Google devuelve al usuario aquí con sus datos
     * Buscamos o creamos el usuario y lo logueamos
     */
    public function callback()
    {
        $frontendUrl = config('app.frontend_url', 'https://localhost');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            // Si Google devuelve error o el usuario cancela
            return redirect("{$frontendUrl}/login?oauth_error=1");
        }

        // Buscamos por google_id primero, luego por email
        $user = User::where('google_id', $googleUser->getId())->first()
            ?? User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Usuario existente: vinculamos google_id si aún no lo tenía
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }
        } else {
            // Usuario nuevo: lo creamos con rol de cliente (role_id = 1)
            $rolCliente = Rol::where('nombre', 'cliente')->first();

            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => null,
                'role_id' => $rolCliente?->id ?? 1,
                'email_verified_at' => now(),
            ]);

            try {
                // Enviamos un email de bienvenida al nuevo usuario
                Mail::to($user->email)->send(new BienvenidaMail($user));
            } catch (\Throwable $e) {
                // Si el envío del email falla, lo registramos pero no bloqueamos el login
                Log::error("Error enviando email de bienvenida a {$user->email}: " . $e->getMessage());
            }
        }

        // Iniciamos sesión con cookie (Sanctum SPA)
        Auth::login($user, remember: true);
        request()->session()->regenerate();

        // Redirigimos al frontend con una señal de éxito
        return redirect("{$frontendUrl}/oauth/callback?status=ok");
    }
}
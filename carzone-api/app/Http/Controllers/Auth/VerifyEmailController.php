<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request; // Cambiamos a Request normal
use Illuminate\Http\RedirectResponse;
use App\Models\User; // Importamos el modelo User

class VerifyEmailController extends Controller
{
    /**
     * El usuario hace clic en el enlace del email
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:4200');

        // 1. Buscamos al usuario manualmente usando el ID que viene en la URL
        $user = User::findOrFail($request->route('id'));

        // 2. Verificamos que el hash de la URL sea correcto para ese usuario
        if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            // Si el enlace está corrupto o es falso, lo mandamos al login con error
            return redirect("{$frontendUrl}/login?error=invalid_hash");
        }

        // 3. Comprobamos si ya estaba verificado
        if ($user->hasVerifiedEmail()) {
            return redirect("{$frontendUrl}/login?already_verified=1");
        }

        // 4. Lo marcamos como verificado y disparamos el evento
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // 5. Redirigimos al front con el parámetro ?verified=1
        return redirect("{$frontendUrl}/login?verified=1");
    }
}
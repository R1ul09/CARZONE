<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\BienvenidaMail;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:4200');

        // buscamos al usuario usando el ID que viene en la URL
        $user = User::findOrFail($request->route('id'));

        // verificamos que el hash de la URL sea correcto para ese usuario
        if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return redirect("{$frontendUrl}/login?error=invalid_hash");
        }

        // comprobamos si ya estaba verificado
        if ($user->hasVerifiedEmail()) {
            return redirect("{$frontendUrl}/login?already_verified=1");
        }

        // lo marcamos como verificado y disparamos el evento de Laravel
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));

            // enviamos el correo de bienvenida ahora que ya es cliente oficial
            Mail::to($user->email)->send(new BienvenidaMail($user));
        }

        // redirigimos al front
        return redirect("{$frontendUrl}/login?verified=1");
    }
}
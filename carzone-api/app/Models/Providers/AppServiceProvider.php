<?php

namespace App\Providers;

use App\Mail\VerificacionEmailMail;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->configurarVerificacionEmail();
        $this->configurarReglasPassword();
    }

    // Email de verificación — enviamos nuestro Mailable y devolvemos
    // un MailMessage vacío para que Laravel no falle internamente
    private function configurarVerificacionEmail(): void
    {
        VerifyEmail::toMailUsing(function ($usuario, string $urlVerificacion) {
            Mail::to($usuario->email)->send(
                new VerificacionEmailMail($usuario->name ?? '', $urlVerificacion)
            );

            return (new MailMessage)->subject('Verifica tu cuenta');
        });
    }

    // Reglas globales de contraseña
    private function configurarReglasPassword(): void
    {
        Password::defaults(function () {
            return Password::min(8)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised();
        });
    }
}
<?php

namespace App\Providers;

use App\Mail\RecuperacionPasswordMail;
use App\Mail\VerificacionEmailMail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->configurarVerificacionEmail();
        $this->configurarRecuperacionPassword();
        $this->configurarReglasPassword();
    }

    // Cuando Laravel necesita enviar el email de verificación,
    // usamos nuestra clase VerificacionEmailMail
    private function configurarVerificacionEmail(): void
    {
        VerifyEmail::toMailUsing(function ($usuario, string $urlVerificacion): MailMessage {
            $mailable = new VerificacionEmailMail($usuario->name ?? '', $urlVerificacion);

            return (new MailMessage)
                ->subject($mailable->envelope()->subject)
                ->html($mailable->content()->htmlString);
        });
    }

    // Cuando Laravel necesita enviar el email de recuperación de contraseña,
    // usamos nuestra clase RecuperacionPasswordMail
    private function configurarRecuperacionPassword(): void
    {
        // Personalizamos la URL de reset para que apunte a nuestro frontend
        ResetPassword::createUrlUsing(function ($usuario, string $token) {
            return config('app.frontend_url') . "/reset-password?token={$token}&email={$usuario->getEmailForPasswordReset()}";
        });

        // Personalizamos el email de recuperación de contraseña
        ResetPassword::toMailUsing(function ($usuario, string $url): MailMessage {
            $mailable = new RecuperacionPasswordMail($usuario->name ?? '', $url);

            return (new MailMessage)
                ->subject($mailable->envelope()->subject)
                ->html($mailable->content()->htmlString);
        });
    }

    // Reglas globales de contraseña aplicadas en toda la aplicacion
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
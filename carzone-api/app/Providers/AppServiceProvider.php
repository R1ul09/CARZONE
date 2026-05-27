<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/reset-password?token=$token&email={$notifiable->getEmailForPasswordReset()}";
        });

        // Personalización del email de verificación (temática tipo CARZONE)
        VerifyEmail::toMailUsing(function ($notifiable, string $verificationUrl): MailMessage {
            $frontendUrl = config('app.frontend_url');
            $name = method_exists($notifiable, 'name') ? ($notifiable->name ?? '') : '';

            return (new MailMessage)
                ->subject('¡Bienvenido a CARZONE! Verifica tu email')
                ->line($name ? "Hola $name 👋" : 'Hola 👋')
                ->line('Para empezar con tu aventura en CARZONE, verifica tu correo:')
                ->action('Verificar email', $verificationUrl)
                ->line('Si no fuiste tú, ignora este mensaje.');
        });

        Password::defaults(function () {
            return Password::min(8)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()
                // esto es para evitar que el password sea uno de los más comunes o que haya sido expuesto en una brecha de seguridad
                ->uncompromised();
        });
    }
}

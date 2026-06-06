<?php

namespace App\Models;

use App\Mail\RecuperacionPasswordMail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'google_id',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // Sobreescribimos el método de Laravel para enviar nuestro
    // propio correo de recuperación de contraseña en vez del de por defecto
    public function sendPasswordResetNotification($token): void
    {
        $url = config('app.frontend_url') . "/reset-password?token={$token}&email={$this->getEmailForPasswordReset()}";

        Mail::to($this->email)->send(
            new RecuperacionPasswordMail($this->name ?? '', $url)
        );
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'role_id');
    }

    public function citas()
    {
        return $this->hasMany(Cita::class);
    }

    public function financiaciones()
    {
        return $this->hasMany(Financiacion::class);
    }
}
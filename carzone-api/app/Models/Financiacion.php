<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Financiacion extends Model
{
    protected $table = 'financiaciones';

    protected $fillable = [
        'user_id',
        'coche_id',
        'meses',
        'cuota_mensual',
        'entrada',
        'interes'
    ];

    // La financiación pertenece a un coche
    public function coche()
    {
        return $this->belongsTo(Coche::class);
    }

    // La financiación pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImagenVehiculo extends Model
{
    protected $table = 'imagenes_vehiculos';
    
    protected $fillable = [
        'coche_id', 
        'ruta', 
        'es_principal'
    ];

    // Una imagen pertenece a un coche
    public function coche()
    {
        return $this->belongsTo(Coche::class);
    }

    // Si la ruta ya es una URL completa (http/https), la devolvemos tal cual.
    // Si es una ruta local de storage, construimos la URL completa.
    public function getRutaAttribute($value): ?string
    {
        if (!$value) return null;

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        return asset('storage/' . $value);
    }
}

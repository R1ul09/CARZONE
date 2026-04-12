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

    public function getRutaAttribute($value)
    {
        // Si por algún motivo la ruta está vacía, evitamos devolver "storage/" solo
        if (!$value) {
            return null;
        }

        // Construimos la URL completa automáticamente
        return asset('storage/' . $value);
    }
}

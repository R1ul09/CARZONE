<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Marca extends Model
{
    protected $fillable = [
        'nombre',
        'anio_fundacion',
        'pais',
        'descripcion',
        'logo'
    ];

    // Una marca tiene muchos coches
    public function coches()
    {
        return $this->hasMany(Coche::class);
    }

    public function getLogoAttribute($value)
    {
        // Si no hay logo, evitamos errores
        if (!$value) {
            return null;
        }

        // Construimos la URL completa automáticamente
        return asset('storage/' . $value);
    }
}

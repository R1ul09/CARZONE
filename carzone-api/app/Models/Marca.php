<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Marca extends Model
{
    protected $fillable = [
        'nombre', 'anio_fundacion', 'pais',
        'descripcion', 'logo', 'imagen_hero', 'slogan',
    ];

    public function coches()
    {
        return $this->hasMany(Coche::class);
    }

    // Devuelve URLs externas tal cual; rutas locales las construye con asset()
    private function resolverUrl(?string $value): ?string
    {
        if (!$value) return null;

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        return asset('storage/' . $value);
    }

    public function getLogoAttribute($value): ?string
    {
        return $this->resolverUrl($value);
    }

    public function getImagenHeroAttribute($value): ?string
    {
        return $this->resolverUrl($value);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coche extends Model
{
    protected $fillable = [
        'modelo',
        'anio',
        'precio',
        'descripcion',
        'imagen',
        'marca_id'
    ];

    // Un coche pertenece a una marca
    public function marca()
    {
        return $this->belongsTo(Marca::class);
    }

    // Un coche tiene un único plan de financiación asociado.
    public function financiacion()
    {
        return $this->hasOne(Financiacion::class);
    }

    // Un coche puede tener muchas citas
    public function citas()
    {
        return $this->hasMany(Cita::class);
    }
}

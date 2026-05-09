<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coche extends Model
{
    use HasFactory;

    protected $fillable = [
        'modelo', 'anio', 'precio', 'descripcion', 'marca_id',
        'potencia', 'par_motor', 'velocidad_max', 'aceleracion',
        'combustible', 'transmision', 'traccion', 'num_plazas',
        'num_puertas', 'tipo_carroceria', 'color', 'disponible', 'destacado'
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

    // Un coche puede tener muchas imágenes
    public function imagenes()
    {
        return $this->hasMany(ImagenVehiculo::class, 'coche_id');
    }

    // Para obtener la imagen principal de un coche
    public function imagenPrincipal()
    {
        return $this->hasOne(ImagenVehiculo::class, 'coche_id')->where('es_principal', true);
    }
}

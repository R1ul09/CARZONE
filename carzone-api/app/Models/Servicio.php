<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    protected $fillable = [
        'nombre', 
        'descripcion', 
        'precio'];

    public function citas()
    {
        return $this->hasMany(Cita::class);
    }
}

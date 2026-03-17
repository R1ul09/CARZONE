<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion'
    ];

    // Un rol tiene muchos usuarios
    public function users()
    {
        return $this->hasMany(User::class);
    }
}

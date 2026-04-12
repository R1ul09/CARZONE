<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('imagenes_vehiculos', function (Blueprint $table) {
            $table->id();

            // creamos la relacion con la tabla coches
            // constrained() asegura que si el coche no existe, no se pueda añadir la imagen
            // onDelete('cascade') es vital: si borras un coche, se borran sus rutas de imagen automaticamente
            $table->foreignId('coche_id')->constrained('coches')->onDelete('cascade');
            
            // Aquí guardaremos algo como "vehiculos/1/foto1.jpg", mas o menos
            $table->string('ruta');

            // Para saber cuál sale en la portada sin entrar en detalles del propio coche
            $table->boolean('es_principal')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imagenes_vehiculos');
    }
};

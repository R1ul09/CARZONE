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
        Schema::create('coches', function (Blueprint $table) {
            $table->id();
            $table->string('modelo');
            $table->integer('anio');
            $table->decimal('precio', 15, 2); 
            $table->text('descripcion')->nullable();
            $table->foreignId('marca_id')->constrained('marcas')->onDelete('cascade');

            // Especificaciones técnicas
            $table->integer('potencia')->nullable();
            $table->integer('par_motor')->nullable();
            $table->integer('velocidad_max')->nullable();
            $table->decimal('aceleracion', 3, 1)->nullable();

            // Configuración
            $table->string('combustible')->nullable();
            $table->string('transmision')->nullable();
            $table->string('traccion')->nullable();
            $table->integer('num_plazas')->nullable();
            $table->integer('num_puertas')->nullable();

            // Estética y Estado
            $table->string('tipo_carroceria')->nullable();
            $table->string('color')->nullable();
            $table->boolean('disponible')->default(true);
            $table->boolean('destacado')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coches');
    }
};

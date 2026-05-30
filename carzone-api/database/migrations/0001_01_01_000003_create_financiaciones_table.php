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
        Schema::create('financiaciones', function (Blueprint $table) {
            $table->id();

            $table->foreignId('coche_id')->constrained('coches')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->integer('meses');
            $table->decimal('cuota_mensual', 8, 2);
            $table->decimal('entrada', 8, 2)->nullable();
            $table->decimal('interes', 5, 2)->nullable();
            $table->string('estado')->default('pendiente');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financiaciones');
    }
};

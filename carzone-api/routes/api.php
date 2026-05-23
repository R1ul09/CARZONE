<?php

use App\Http\Controllers\Api\CocheController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\FinanciacionController;
use App\Http\Controllers\Api\MarcaController;
use App\Http\Controllers\Api\RolController;
use App\Http\Controllers\Api\ServicioController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\ImagenVehiculoController;
use Illuminate\Support\Facades\Route;

// Incluir rutas de autenticación
require __DIR__.'/auth.php';

// RUTAS PÚBLICAS (No requieren autenticación)
Route::get('/marcas', [MarcaController::class, 'index']);
Route::get('/marcas/{id}', [MarcaController::class, 'show']);
Route::get('/coches', [CocheController::class, 'index']);
Route::get('/coches/{id}', [CocheController::class, 'show']);
Route::get('/servicios', [ServicioController::class, 'index']);
Route::post('/chatbot', [ChatbotController::class, 'procesarMensaje']);
Route::get('/citas/horas-ocupadas', [CitaController::class, 'horasOcupadas']);

// RUTAS PROTEGIDAS (Requieren Token/Estar logueado)
Route::middleware(['auth:sanctum'])->group(function () {

    // Rutas de Citas
    Route::get('/citas/todas', [CitaController::class, 'todas'])
        ->middleware('role:empleado,admin');

    Route::get('/citas', [CitaController::class, 'index']);
    Route::post('/citas', [CitaController::class, 'store']);
    Route::get('/citas/{id}', [CitaController::class, 'show']);
    Route::put('/citas/{id}', [CitaController::class, 'update']);
    Route::delete('/citas/{id}', [CitaController::class, 'destroy']);

    // Rutas para Financiaciones
    Route::apiResource('financiaciones', FinanciacionController::class);

    // Rutas para Imagenes de Vehiculos
    Route::get('imagenes-vehiculos', [ImagenVehiculoController::class, 'index']);
    Route::post('imagenes-vehiculos', [ImagenVehiculoController::class, 'store']);
    Route::delete('imagenes-vehiculos/{id}', [ImagenVehiculoController::class, 'destroy']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('roles', RolController::class);

        Route::post('/marcas', [MarcaController::class, 'store']);
        Route::put('/marcas/{id}', [MarcaController::class, 'update']);
        Route::delete('/marcas/{id}', [MarcaController::class, 'destroy']);

        Route::post('/servicios', [ServicioController::class, 'store']);
        Route::put('/servicios/{id}', [ServicioController::class, 'update']);
        Route::delete('/servicios/{id}', [ServicioController::class, 'destroy']);

        Route::post('/coches', [CocheController::class, 'store']);
        Route::put('/coches/{id}', [CocheController::class, 'update']);
        Route::delete('/coches/{id}', [CocheController::class, 'destroy']);
    });

    Route::put('/coches/{id}/disponibilidad', [CocheController::class, 'cambiarDisponibilidad'])
        ->middleware('role:empleado,admin');
});

require __DIR__.'/auth.php';
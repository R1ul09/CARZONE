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

// RUTAS PÚBLICAS (No requieren autenticación)
Route::get('/marcas', [MarcaController::class, 'index']);
Route::get('/marcas/{id}', [MarcaController::class, 'show']);
Route::get('/coches', [CocheController::class, 'index']);
Route::get('/coches/{id}', [CocheController::class, 'show']);
Route::get('/servicios', [ServicioController::class, 'index']);
Route::post('/chatbot', [ChatbotController::class, 'procesarMensaje']);

// RUTAS PROTEGIDAS (Requieren Token/Estar logueado)
Route::middleware(['auth:sanctum'])->group(function () {

    // Rutas de Citas
    Route::get('/citas', [CitaController::class, 'index']);
    Route::post('/citas', [CitaController::class, 'store']);
    Route::get('/citas/{id}', [CitaController::class, 'show']);
    Route::put('/citas/{id}', [CitaController::class, 'update']);
    Route::delete('/citas/{id}', [CitaController::class, 'destroy']);
    // El update y delete los dejamos para cuando definamos quién puede cancelar

    // modificar marca
    Route::post('/marcas', [MarcaController::class, 'store']);
    Route::put('/marcas/{id}', [MarcaController::class, 'update']);
    Route::delete('/marcas/{id}', [MarcaController::class, 'destroy']);

    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::post('/coches', [CocheController::class, 'store']);
        Route::put('/coches/{id}', [CocheController::class, 'update']);
        Route::delete('/coches/{id}', [CocheController::class, 'destroy']);
    });

    // Rutas para Roles
    Route::apiResource('roles', RolController::class);

    // Rutas para Financiaciones
    Route::apiResource('financiaciones', FinanciacionController::class);

    // Rutas para Users
    Route::apiResource('users', UserController::class);

    // Rutas para Imagenes de Vehiculos
    Route::get('imagenes-vehiculos', [ImagenVehiculoController::class, 'index']);
    Route::post('imagenes-vehiculos', [ImagenVehiculoController::class, 'store']);

});

require __DIR__.'/auth.php';
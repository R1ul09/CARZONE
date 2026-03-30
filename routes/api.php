<?php

use App\Http\Controllers\Api\CocheController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\FinanciacionController;
use App\Http\Controllers\Api\MarcaController;
use App\Http\Controllers\Api\RolController;
use App\Http\Controllers\Api\ServicioController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// RUTAS PROTEGIDAS (Requieren Token/Estar logueado)
Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::get('/coches', [CocheController::class, 'index']);
    Route::get('/coches/{id}', [CocheController::class, 'show']);

    // Rutas de Citas
    Route::get('/citas', [CitaController::class, 'index']);
    Route::post('/citas', [CitaController::class, 'store']);
    Route::get('/citas/{id}', [CitaController::class, 'show']);
    Route::put('/citas/{id}', [CitaController::class, 'update']);
    Route::delete('/citas/{id}', [CitaController::class, 'destroy']);
    // El update y delete los dejamos para cuando definamos quién puede cancelar

    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::post('/coches', [CocheController::class, 'store']);
        Route::put('/coches/{id}', [CocheController::class, 'update']);
        Route::delete('/coches/{id}', [CocheController::class, 'destroy']);
    });

    // Rutas para Marcas
    Route::apiResource('marcas', MarcaController::class);

    // Rutas para Servicios
    Route::apiResource('servicios', ServicioController::class);

    // Rutas para Roles
    Route::apiResource('roles', RolController::class);

    // Rutas para Financiaciones
    Route::apiResource('financiaciones', FinanciacionController::class);

    // Rutas para Users
    Route::apiResource('users', UserController::class);

});

<?php

use App\Http\Controllers\Api\CocheController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// RUTAS PROTEGIDAS (Requieren Token/Estar logueado)
Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::get('/coches', [CocheController::class, 'index']);
    Route::get('/coches/{id}', [CocheController::class, 'show']);

    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::post('/coches', [CocheController::class, 'store']);
        Route::put('/coches/{id}', [CocheController::class, 'update']); // Esto llama a update()
        Route::delete('/coches/{id}', [CocheController::class, 'destroy']); // Esto llama a destroy()
    });

});

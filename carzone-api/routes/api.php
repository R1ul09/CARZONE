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
use Illuminate\Http\Request;

require __DIR__.'/auth.php';

// RUTAS PÚBLICAS
Route::get('/marcas', [MarcaController::class, 'index']);
Route::get('/marcas/{id}', [MarcaController::class, 'show']);
Route::get('/coches', [CocheController::class, 'index']);
Route::get('/coches/{id}', [CocheController::class, 'show']);
Route::get('/servicios', [ServicioController::class, 'index']);
Route::post('/chatbot', [ChatbotController::class, 'procesarMensaje']);
Route::get('/citas/horas-ocupadas', [CitaController::class, 'horasOcupadas']);

// RUTAS PROTEGIDAS
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
            'email_verified' => $request->user()->email_verified_at !== null,
            'message' => 'Sesión activa',
        ]);
    });

    // Citas
    Route::get('/citas/todas', [CitaController::class, 'todas'])
        ->middleware('role:empleado,admin');

    Route::get('/citas', [CitaController::class, 'index']);
    Route::post('/citas', [CitaController::class, 'store']);
    Route::get('/citas/{id}', [CitaController::class, 'show']);
    Route::put('/citas/{id}', [CitaController::class, 'update']);
    Route::delete('/citas/{id}', [CitaController::class, 'destroy']);

    Route::get('/financiaciones/todas', [FinanciacionController::class, 'todas'])
        ->middleware('role:empleado,admin');
    Route::patch('/financiaciones/{id}/responder', [FinanciacionController::class, 'responder'])
        ->middleware('role:empleado,admin');

    Route::apiResource('financiaciones', FinanciacionController::class);

    // Ruta para que cualquier usuario autenticado edite su propio perfil
    Route::put('/perfil', [UserController::class, 'updatePerfil']);

    // Imágenes de vehículos
    Route::get('imagenes-vehiculos', [ImagenVehiculoController::class, 'index']);
    Route::post('imagenes-vehiculos', [ImagenVehiculoController::class, 'store']);
    Route::delete('imagenes-vehiculos/{id}', [ImagenVehiculoController::class, 'destroy']);

    // Empleado y admin pueden ver clientes
    Route::get('/empleado/clientes', [UserController::class, 'clientes'])
        ->middleware('role:empleado,admin');

    // Solo admin
    Route::middleware('role:admin')->group(function () {
        Route::post('/users/empleado', [UserController::class, 'crearEmpleado']);
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
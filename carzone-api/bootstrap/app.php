<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->statefulApi();

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            '/api/register',
            '/api/login',
            '/api/logout',
            'api/*',
        ]);

        // Añade esto para que no intente encriptar cookies en las pruebas de Postman
        $middleware->encryptCookies(except: [
            'XSRF-TOKEN',
        ]);

        $middleware->trustProxies(at: '*');

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        // Sanctum kasıtlı olarak kurulmadı: Next.js frontend'i API'ye yalnızca
        // Server Component'lerden (sunucudan sunucuya) erişir, tarayıcı oturumu
        // taşımaz. İleride veli/yönetici SPA'i eklenirse `install:api` ile
        // Sanctum devreye alınır (bkz. docs/architecture.md §3).
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();

<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        // Halk açık içerik uç noktaları oturumsuzdur; yalnızca yönetim paneli
        // (routes/api.php `admin/*`) Sanctum kişisel erişim token'ıyla
        // korunur — panel de Next.js sunucusundan sunucudan sunucuya
        // çağrıldığı için tarayıcı SPA çerez akışına (stateful) ihtiyaç
        // yoktur (bkz. docs/architecture.md §3).
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'ability' => CheckForAnyAbility::class,
        ]);

        // Next.js sunucusu API'yi kendi arka ucundan çağırır (bkz.
        // docs/architecture.md §3) — gerçek ziyaretçi IP'si yalnızca Next'in
        // ilettiği `X-Forwarded-For` başlığından okunabilir (bkz.
        // frontend `iletisim/actions.ts` ve `admin/actions/auth.ts`). Bu
        // başlık yalnızca `services.trusted_proxies`te listelenen bilinen
        // adres(ler)den gelen bağlantılar için güvenilir sayılır — `'*'`
        // KULLANILMAZ, aksi halde API'ye doğrudan istek atan herkes bu
        // başlığı taklit ederek `throttle:*` hız sınırlamasını atlatabilirdi.
        // `config()` bu aşamada henüz kullanılamaz (konsol çekirdeği config
        // servis sağlayıcısından önce bu callback'i çalıştırır) — `env()`
        // burada güvenlidir çünkü `bootstrap/app.php` `config:cache` ile asla
        // önbelleklenmez, her istekte yeniden çalışır.
        $trustedProxies = array_filter(array_map(
            'trim',
            explode(',', (string) env('TRUSTED_PROXIES', '127.0.0.1,::1')),
        ));
        $middleware->trustProxies(at: $trustedProxies);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();

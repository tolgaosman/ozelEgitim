<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Bu API'ye normalde yalnızca Next.js frontend'i sunucudan sunucuya erişir
    | (bkz. docs/architecture.md §3), yani tarayıcıdan doğrudan çapraz-origin
    | istek beklenmez. Yine de savunma derinliği için origin listesi
    | CORS_ALLOWED_ORIGINS env değişkeninden okunur; wildcard yerine yalnızca
    | bilinen frontend origin'lerine izin verilir.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', env('CORS_ALLOWED_ORIGINS', ''))
    ))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];

<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Next.js Frontend
    |--------------------------------------------------------------------------
    |
    | Icerik panelden kaydedildiginde Next.js ISR onbellegini tazeleyen uc
    | nokta. Gizli anahtar frontend/.env.local icindeki REVALIDATE_SECRET ile
    | birebir ayni olmalidir. Bos birakilirsa tazeleme sessizce atlanir.
    |
    */

    'frontend' => [
        'revalidate_url' => env('FRONTEND_REVALIDATE_URL'),
        'revalidate_secret' => env('FRONTEND_REVALIDATE_SECRET'),
        // Yönetim paneli Next.js'te barındığı için e-posta bağlantıları gibi
        // panele işaret eden mutlak URL'ler bu adresten kurulur.
        'url' => env('FRONTEND_URL', 'http://localhost:3000'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Güvenilen Vekiller (Trusted Proxies)
    |--------------------------------------------------------------------------
    |
    | Next.js sunucusu API'yi kendi arka ucundan çağırır ve gerçek ziyaretçi
    | IP'sini `X-Forwarded-For` başlığıyla iletir (bkz. bootstrap/app.php).
    | Bu başlık YALNIZCA burada listelenen adreslerden gelen bağlantılar için
    | güvenilir sayılır — aksi halde herkese açık `/api/inquiries` veya
    | `/admin/login`'e DOĞRUDAN istek atan biri bu başlığı taklit ederek hız
    | sınırlamasını (`throttle:*`) tamamen atlatabilirdi. Üretimde Next.js
    | sunucusu farklı bir sunucuda çalışıyorsa bu değer onun gerçek adresine
    | (veya CIDR blokuna) göre ayarlanmalıdır.
    |
    */

    'trusted_proxies' => array_filter(array_map(
        'trim',
        explode(',', (string) env('TRUSTED_PROXIES', '127.0.0.1,::1')),
    )),

];

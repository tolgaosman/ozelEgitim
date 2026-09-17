<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tek satırlık ayar tablosu (singleton). Frontend'de bugüne kadar
 * `frontend/src/lib/seo/constants.ts` içinde sabit olan iletişim bilgileri
 * buraya taşınır; o dosya yedek (fallback) kaynak olarak yerinde kalır.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('phone_display');
            $table->string('phone_tel');
            $table->string('whatsapp_url');
            $table->string('email');
            $table->string('address');
            $table->string('maps_url');
            $table->string('instagram_url')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('weekday_hours');
            $table->string('saturday_hours');
            $table->string('sunday_hours');
            $table->json('kvkk_body');             // string[] paragraf listesi
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};

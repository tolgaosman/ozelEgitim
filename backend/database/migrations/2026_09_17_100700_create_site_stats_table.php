<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Anasayfa ve Hakkımızda sayfasındaki sayaç kartları (18+ yıl, 620+ öğrenci
 * gibi). Daha önce iki ayrı bileşende kopyalanmış olan bu liste tek kaynağa
 * indirilir.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_stats', function (Blueprint $table): void {
            $table->id();
            $table->unsignedInteger('target_value');
            $table->string('suffix', 8)->default('');
            $table->string('label');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_stats');
    }
};

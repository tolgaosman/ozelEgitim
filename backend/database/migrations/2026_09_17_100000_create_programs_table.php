<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Kategori ve ikon alanları bilinçli olarak `enum()` yerine `string` olarak
 * tutulur: SQLite (geliştirme) ile MySQL (üretim) arasında şema kayması
 * oluşmasın diye. Kısıtlama Eloquent cast'i, Form Request ve Filament
 * formundaki `Rule::enum()` ile üç katmanda birden uygulanır.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('short_description');
            $table->json('description');           // string[] paragraf listesi
            $table->string('icon');                // App\Enums\ProgramIcon
            $table->string('age_range_label');
            $table->string('session_format_label');
            $table->json('highlights');            // string[], 1-6 öğe
            $table->string('image_path')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['published_at', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};

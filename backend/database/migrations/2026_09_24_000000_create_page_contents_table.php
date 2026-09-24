<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ana sayfa bölümleri, sayfa hero'ları, KVKK başlığı gibi bugüne kadar
 * frontend TSX dosyalarına gömülü olan metinlerin panelden düzenlenebilmesi
 * için tek bir anahtar-değer tablosu. Her satır bir "blok"a (ör.
 * `home.hero`, `about.story`) karşılık gelir; şekli ve varsayılan değeri
 * `App\Support\PageContentBlueprint` içinde tanımlıdır.
 *
 * Satır DB'de yoksa (henüz hiç düzenlenmemiş) API varsayılan değeri döner —
 * bu yüzden burada seed gerekmez.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table): void {
            $table->id();
            $table->string('key')->unique();
            $table->json('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};

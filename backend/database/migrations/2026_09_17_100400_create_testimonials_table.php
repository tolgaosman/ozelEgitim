<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `is_published` bilinçli olarak `false` varsayılanıyla gelir: veli görüşü
 * yalnızca yazılı onay alındıktan sonra yayına alınır (KVKK). `parent_name`
 * alanına gerçek ad yerine "Bir Veli" gibi kısaltılmış bir ifade girilebilir.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table): void {
            $table->id();
            $table->string('parent_name');
            $table->string('relation_label');
            $table->text('quote');
            $table->foreignId('program_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_published')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};

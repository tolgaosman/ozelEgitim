<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('excerpt');
            $table->json('body');                  // string[] paragraf listesi
            $table->string('image_path')->nullable();
            $table->string('category');            // App\Enums\AnnouncementCategory
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['published_at', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};

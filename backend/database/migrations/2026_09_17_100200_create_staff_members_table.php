<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_members', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('full_name');
            $table->string('title');
            $table->json('specialties');           // string[], 1-5 öğe
            $table->text('bio');
            $table->string('photo_path')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();

            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_members');
    }
};

<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Ham IP adresi saklanmaz (KVKK veri minimizasyonu); yalnızca uygulama
 * anahtarıyla tuzlanmış geri döndürülemez bir özet tutulur. Bu, aynı
 * kaynaktan gelen spam yığınlarını IP'yi hiç bilmeden gruplamaya yeter.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table): void {
            $table->id();
            $table->string('parent_full_name');
            $table->string('child_age_label');
            $table->string('phone_number');
            $table->string('email');
            $table->string('program_of_interest')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('yeni');   // App\Enums\InquiryStatus
            $table->text('internal_note')->nullable();
            $table->string('ip_hash', 64)->nullable();
            $table->timestamp('handled_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};

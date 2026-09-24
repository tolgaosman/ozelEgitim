<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Yönetim paneli API'sine erişim yalnızca bu bayrağa sahip kullanıcılara açıktır
 * (bkz. AdminAuthController::login). Varsayılan `false` — yeni bir kullanıcı
 * kaydı kazara yönetici yetkisi kazanamaz.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->boolean('is_admin')->default(false)->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('is_admin');
        });
    }
};

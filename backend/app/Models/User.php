<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * `is_admin` kasıtlı olarak `$fillable` dışında bırakılmıştır: kütle atamayla
 * yetki yükseltmesi (privilege escalation) mümkün olmasın diye yalnızca
 * açık atamayla — seeder veya konsol üzerinden — verilebilir (Rule 03).
 *
 * @property bool $is_admin
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    /** Yönetim paneline yalnızca açıkça yetkilendirilmiş hesaplar girebilir. */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin;
    }
}

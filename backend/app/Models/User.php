<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * `is_admin` kasıtlı olarak `$fillable` dışında bırakılmıştır: kütle atamayla
 * yetki yükseltmesi (privilege escalation) mümkün olmasın diye yalnızca
 * açık atamayla — seeder veya konsol üzerinden — verilebilir (Rule 03).
 *
 * Yönetim paneli girişi `App\Http\Controllers\Api\Admin\AdminAuthController`
 * üzerinden Sanctum kişisel erişim token'ı ile yapılır; token'a yalnızca
 * `admin` yeteneği verilir ve `auth:sanctum` + `ability:admin` middleware
 * çifti bunu her istekte doğrular (bkz. routes/api.php).
 *
 * @property bool $is_admin
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

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
}

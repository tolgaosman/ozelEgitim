<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\ProvidesFrontendCacheTags;
use App\Models\Concerns\NotifiesFrontendCache;
use Database\Factories\StaffMemberFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class StaffMember extends Model implements ProvidesFrontendCacheTags
{
    /** @use HasFactory<StaffMemberFactory> */
    use HasFactory, NotifiesFrontendCache, SoftDeletes;

    /** frontend/src/lib/repositories içindeki ISR etiketleriyle birebir aynı. */
    public const FRONTEND_COLLECTION_TAG = 'staff-members';

    public const FRONTEND_RECORD_TAG_PREFIX = null;

    protected $fillable = [
        'slug',
        'full_name',
        'title',
        'specialties',
        'education',
        'bio',
        'photo_path',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'specialties' => 'array',
            'education' => 'array',
            'sort_order' => 'integer',
        ];
    }
}

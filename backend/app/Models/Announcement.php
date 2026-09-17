<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\ProvidesFrontendCacheTags;
use App\Enums\AnnouncementCategory;
use App\Models\Concerns\NotifiesFrontendCache;
use Database\Factories\AnnouncementFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Announcement extends Model implements ProvidesFrontendCacheTags
{
    /** @use HasFactory<AnnouncementFactory> */
    use HasFactory, NotifiesFrontendCache, SoftDeletes;

    /** frontend/src/lib/repositories içindeki ISR etiketleriyle birebir aynı. */
    public const FRONTEND_COLLECTION_TAG = 'announcements';

    public const FRONTEND_RECORD_TAG_PREFIX = 'announcement';

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'body',
        'image_path',
        'category',
        'sort_order',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'body' => 'array',
            'category' => AnnouncementCategory::class,
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}

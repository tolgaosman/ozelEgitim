<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\ProvidesFrontendCacheTags;
use App\Enums\ProgramIcon;
use App\Models\Concerns\NotifiesFrontendCache;
use Database\Factories\ProgramFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property-read string $slug
 * @property-read ?string $image_path
 */
final class Program extends Model implements ProvidesFrontendCacheTags
{
    /** @use HasFactory<ProgramFactory> */
    use HasFactory, NotifiesFrontendCache, SoftDeletes;

    /** frontend/src/lib/repositories içindeki ISR etiketleriyle birebir aynı. */
    public const FRONTEND_COLLECTION_TAG = 'programs';

    public const FRONTEND_RECORD_TAG_PREFIX = 'program';

    /** Kütle atama yalnızca bu listeyle sınırlıdır (Rule 03). */
    protected $fillable = [
        'slug',
        'name',
        'short_description',
        'description',
        'icon',
        'age_range_label',
        'session_format_label',
        'highlights',
        'image_path',
        'sort_order',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'description' => 'array',
            'highlights' => 'array',
            'icon' => ProgramIcon::class,
            'sort_order' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /** Yayın tarihi geçmiş olan programlar — taslaklar API'den hiç görünmez. */
    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /** @return HasMany<Testimonial, $this> */
    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }
}

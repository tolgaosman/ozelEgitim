<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\ProvidesFrontendCacheTags;
use App\Models\Concerns\NotifiesFrontendCache;
use Database\Factories\TestimonialFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Testimonial extends Model implements ProvidesFrontendCacheTags
{
    /** @use HasFactory<TestimonialFactory> */
    use HasFactory, NotifiesFrontendCache;

    /** frontend/src/lib/repositories içindeki ISR etiketleriyle birebir aynı. */
    public const FRONTEND_COLLECTION_TAG = 'testimonials';

    public const FRONTEND_RECORD_TAG_PREFIX = null;

    protected $fillable = [
        'parent_name',
        'relation_label',
        'quote',
        'program_id',
        'is_published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** Yayın için velinin yazılı onayı şarttır — varsayılan `false`. */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /** @return BelongsTo<Program, $this> */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}

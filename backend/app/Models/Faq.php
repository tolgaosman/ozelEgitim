<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\ProvidesFrontendCacheTags;
use App\Enums\FaqCategory;
use App\Models\Concerns\NotifiesFrontendCache;
use Database\Factories\FaqFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Faq extends Model implements ProvidesFrontendCacheTags
{
    /** @use HasFactory<FaqFactory> */
    use HasFactory, NotifiesFrontendCache, SoftDeletes;

    /** frontend/src/lib/repositories içindeki ISR etiketleriyle birebir aynı. */
    public const FRONTEND_COLLECTION_TAG = 'faqs';

    public const FRONTEND_RECORD_TAG_PREFIX = null;

    /** Laravel çoğul tahmini "faqs" yerine "faqs" üretir; yine de açıkça belirtiyoruz. */
    protected $table = 'faqs';

    protected $fillable = [
        'category',
        'question',
        'answer',
        'is_published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'category' => FaqCategory::class,
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}

<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\ProvidesFrontendCacheTags;
use App\Models\Concerns\NotifiesFrontendCache;
use Illuminate\Database\Eloquent\Model;

final class SiteStat extends Model implements ProvidesFrontendCacheTags
{
    use NotifiesFrontendCache;

    /** frontend/src/lib/repositories içindeki ISR etiketleriyle birebir aynı. */
    public const FRONTEND_COLLECTION_TAG = 'site-settings';

    public const FRONTEND_RECORD_TAG_PREFIX = null;

    protected $fillable = [
        'target_value',
        'suffix',
        'label',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'target_value' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}

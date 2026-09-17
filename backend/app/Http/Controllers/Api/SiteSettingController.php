<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use App\Models\SiteStat;

final class SiteSettingController extends Controller
{
    public function show(): SiteSettingResource
    {
        $orderedStats = SiteStat::query()
            ->orderBy('sort_order')
            ->get();

        return SiteSettingResource::make(SiteSetting::current(), $orderedStats);
    }
}

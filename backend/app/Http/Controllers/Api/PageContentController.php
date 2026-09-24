<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use App\Support\PageContentBlueprint;
use Illuminate\Http\JsonResponse;

/**
 * Sitedeki tüm sayfa metinlerini tek bir istekte döner. Panelde hiç
 * düzenlenmemiş bloklar `PageContentBlueprint`'teki varsayılan değerle
 * doldurulur — bu yüzden bu uç nokta hiçbir zaman eksik bir anahtar
 * döndürmez ve frontend'in yer tutucuya düşmesi gerekmez.
 */
final class PageContentController extends Controller
{
    public function index(): JsonResponse
    {
        $overrides = PageContent::query()
            ->pluck('content', 'key')
            ->all();

        $blocks = array_replace(PageContentBlueprint::defaults(), $overrides);
        $blocks = PageContentBlueprint::resolveImageUrls($blocks);

        return response()->json(['data' => $blocks]);
    }
}

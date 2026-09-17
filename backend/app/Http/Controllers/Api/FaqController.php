<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class FaqController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $publishedFaqs = Faq::query()
            ->published()
            ->orderBy('sort_order')
            ->get();

        return FaqResource::collection($publishedFaqs)
            ->additional(['meta' => ['total' => $publishedFaqs->count()]]);
    }
}

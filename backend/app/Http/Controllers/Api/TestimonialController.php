<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class TestimonialController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        // `program` ilişkisi önden yüklenir: Resource her kayıt için slug
        // okuyor, aksi halde koleksiyon boyunca N+1 sorgu oluşurdu (Rule 01).
        $publishedTestimonials = Testimonial::query()
            ->published()
            ->with('program:id,slug')
            ->orderBy('sort_order')
            ->get();

        return TestimonialResource::collection($publishedTestimonials)
            ->additional(['meta' => ['total' => $publishedTestimonials->count()]]);
    }
}

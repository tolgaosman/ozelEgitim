<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderRequest;
use App\Http\Requests\Admin\TestimonialRequest;
use App\Http\Resources\Admin\AdminTestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class TestimonialController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $testimonials = Testimonial::query()
            ->with('program:id,name')
            ->orderBy('sort_order')
            ->get();

        return AdminTestimonialResource::collection($testimonials);
    }

    public function store(TestimonialRequest $request): AdminTestimonialResource
    {
        $testimonial = Testimonial::create($request->toDatabaseAttributes());

        return AdminTestimonialResource::make($testimonial->load('program:id,name'));
    }

    public function show(Testimonial $testimonial): AdminTestimonialResource
    {
        return AdminTestimonialResource::make($testimonial->load('program:id,name'));
    }

    public function update(TestimonialRequest $request, Testimonial $testimonial): AdminTestimonialResource
    {
        $testimonial->update($request->toDatabaseAttributes());

        return AdminTestimonialResource::make($testimonial->load('program:id,name'));
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return response()->json(['message' => 'Veli görüşü silindi.']);
    }

    public function reorder(ReorderRequest $request): JsonResponse
    {
        $orderedIds = $request->validated('ids');

        // Modeller tek tek `save()` ile güncellenir (toplu `update()` değil):
        // yalnızca model olayları `FrontendCacheObserver`ı tetikler ve
        // sıralama değişikliği de tazeleme gerektirir (bkz. NotifiesFrontendCache).
        Testimonial::query()->whereKey($orderedIds)->get()->each(
            fn (Testimonial $testimonial) => $testimonial->update(['sort_order' => array_search($testimonial->id, $orderedIds, true)]),
        );

        return response()->json(['message' => 'Sıralama güncellendi.']);
    }
}

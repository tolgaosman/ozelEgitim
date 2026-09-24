<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Enums\InquiryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateInquiryRequest;
use App\Http\Resources\Admin\AdminInquiryResource;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class InquiryController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $inquiries = Inquiry::query()
            ->when(
                $request->string('status')->isNotEmpty() && $request->string('status')->value() !== 'all',
                fn ($query) => $query->where('status', $request->string('status')->value()),
            )
            ->when(
                $request->string('search')->isNotEmpty(),
                function ($query) use ($request) {
                    $search = "%{$request->string('search')->value()}%";
                    $query->where(function ($inner) use ($search) {
                        $inner->where('parent_full_name', 'like', $search)
                            ->orWhere('phone_number', 'like', $search)
                            ->orWhere('email', 'like', $search);
                    });
                },
            )
            ->latest('created_at')
            ->get();

        return AdminInquiryResource::collection($inquiries);
    }

    public function show(Inquiry $inquiry): AdminInquiryResource
    {
        return AdminInquiryResource::make($inquiry);
    }

    public function update(UpdateInquiryRequest $request, Inquiry $inquiry): AdminInquiryResource
    {
        $attributes = $request->toDatabaseAttributes();

        // İlk kez "yeni" dışına taşındığında iletişime geçilen an otomatik
        // damgalanır; sonraki düzenlemelerde (ör. yalnızca not güncellemede)
        // bu tarih ezilmez.
        if ($attributes['status'] !== InquiryStatus::Yeni->value && $inquiry->handled_at === null) {
            $attributes['handled_at'] = now();
        } elseif ($attributes['status'] === InquiryStatus::Yeni->value) {
            $attributes['handled_at'] = null;
        }

        $inquiry->update($attributes);

        return AdminInquiryResource::make($inquiry);
    }

    public function destroy(Inquiry $inquiry): JsonResponse
    {
        $inquiry->delete();

        return response()->json(['message' => 'Talep silindi.']);
    }
}

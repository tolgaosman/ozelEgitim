<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderRequest;
use App\Http\Requests\Admin\StaffMemberRequest;
use App\Http\Resources\Admin\AdminStaffMemberResource;
use App\Models\StaffMember;
use App\Support\MediaCleanup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class StaffMemberController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $staffMembers = StaffMember::query()
            ->withTrashed()
            ->orderBy('sort_order')
            ->get();

        return AdminStaffMemberResource::collection($staffMembers);
    }

    public function store(StaffMemberRequest $request): AdminStaffMemberResource
    {
        $staffMember = StaffMember::create($request->toDatabaseAttributes());

        return AdminStaffMemberResource::make($staffMember);
    }

    public function show(StaffMember $staffMember): AdminStaffMemberResource
    {
        return AdminStaffMemberResource::make($staffMember);
    }

    public function update(StaffMemberRequest $request, StaffMember $staffMember): AdminStaffMemberResource
    {
        $previousPhotoPath = $staffMember->photo_path;

        $staffMember->update($request->toDatabaseAttributes());

        if ($staffMember->photo_path !== $previousPhotoPath) {
            MediaCleanup::deleteIfOwned($previousPhotoPath);
        }

        return AdminStaffMemberResource::make($staffMember);
    }

    public function destroy(StaffMember $staffMember): JsonResponse
    {
        $staffMember->delete();

        return response()->json(['message' => 'Kadro üyesi çöp kutusuna taşındı.']);
    }

    public function restore(int $id): AdminStaffMemberResource
    {
        $staffMember = StaffMember::withTrashed()->findOrFail($id);
        $staffMember->restore();

        return AdminStaffMemberResource::make($staffMember);
    }

    public function reorder(ReorderRequest $request): JsonResponse
    {
        $orderedIds = $request->validated('ids');

        // Modeller tek tek `save()` ile güncellenir (toplu `update()` değil):
        // yalnızca model olayları `FrontendCacheObserver`ı tetikler ve
        // sıralama değişikliği de tazeleme gerektirir (bkz. NotifiesFrontendCache).
        StaffMember::query()->whereKey($orderedIds)->get()->each(
            fn (StaffMember $staffMember) => $staffMember->update(['sort_order' => array_search($staffMember->id, $orderedIds, true)]),
        );

        return response()->json(['message' => 'Sıralama güncellendi.']);
    }
}

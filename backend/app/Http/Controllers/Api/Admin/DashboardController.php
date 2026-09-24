<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Enums\InquiryStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminInquiryResource;
use App\Models\Announcement;
use App\Models\Inquiry;
use App\Models\Program;
use App\Models\StaffMember;
use Illuminate\Http\JsonResponse;

final class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $recentInquiries = Inquiry::query()
            ->latest('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'data' => [
                'counts' => [
                    'newInquiries' => Inquiry::query()->where('status', InquiryStatus::Yeni)->count(),
                    'programs' => Program::query()->count(),
                    'announcements' => Announcement::query()->count(),
                    'staffMembers' => StaffMember::query()->count(),
                ],
                'recentInquiries' => AdminInquiryResource::collection($recentInquiries)->resolve(),
            ],
        ]);
    }
}

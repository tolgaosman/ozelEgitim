<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Enums\AnnouncementCategory;
use App\Enums\FaqCategory;
use App\Enums\InquiryStatus;
use App\Enums\ProgramIcon;
use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\JsonResponse;

/**
 * Panelin açılır listelerindeki seçenekler (program ikonu, duyuru/SSS
 * kategorisi, talep durumu) tek kaynaktan gelir — enum'ların kendisinden.
 * Böylece yeni bir değer eklendiğinde panel ve backend hiçbir zaman
 * birbirinden sapmaz.
 */
final class MetaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'programIcons' => array_map(
                    static fn (ProgramIcon $icon): array => ['value' => $icon->value, 'label' => $icon->label()],
                    ProgramIcon::cases(),
                ),
                'announcementCategories' => array_map(
                    static fn (AnnouncementCategory $category): array => ['value' => $category->value, 'label' => $category->label()],
                    AnnouncementCategory::cases(),
                ),
                'faqCategories' => array_map(
                    static fn (FaqCategory $category): array => ['value' => $category->value, 'label' => $category->label()],
                    FaqCategory::cases(),
                ),
                'inquiryStatuses' => array_map(
                    static fn (InquiryStatus $status): array => ['value' => $status->value, 'label' => $status->label(), 'color' => $status->color()],
                    InquiryStatus::cases(),
                ),
                'programs' => Program::query()
                    ->orderBy('name')
                    ->get(['id', 'name', 'slug'])
                    ->map(static fn (Program $program): array => ['value' => $program->id, 'label' => $program->name, 'slug' => $program->slug])
                    ->all(),
            ],
        ]);
    }
}

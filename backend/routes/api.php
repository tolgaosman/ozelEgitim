<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Api\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Api\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Api\Admin\MetaController as AdminMetaController;
use App\Http\Controllers\Api\Admin\PageContentController as AdminPageContentController;
use App\Http\Controllers\Api\Admin\ProgramController as AdminProgramController;
use App\Http\Controllers\Api\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Api\Admin\SiteStatController as AdminSiteStatController;
use App\Http\Controllers\Api\Admin\StaffMemberController as AdminStaffMemberController;
use App\Http\Controllers\Api\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\PageContentController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\StaffMemberController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
 * Herkese açık kurumsal site içeriği — kimlik doğrulaması gerektirmez
 * (bkz. docs/architecture.md §3). Uç nokta adları ve yanıt zarfları
 * frontend/src/lib/repositories/*.ts ile birebir eşleşir; buradaki bir
 * değişiklik o dosyalarda ve ilgili Zod şemasında da yapılmalıdır.
 */
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{slug}', [ProgramController::class, 'show']);

Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/announcements/{slug}', [AnnouncementController::class, 'show']);

Route::get('/staff-members', [StaffMemberController::class, 'index']);
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/site-settings', [SiteSettingController::class, 'show']);
Route::get('/page-contents', [PageContentController::class, 'index']);

// Tek yazma uç noktası. Dakikada 6 istekle sınırlanır (Rule 03 §3) —
// frontend'deki bal küpü ve Zod doğrulamasının üstüne üçüncü savunma katmanı.
Route::post('/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:6,1');

/*
 * Yönetim paneli (siteadresi/admin, Next.js). Next.js sunucusu bu uç
 * noktaları kendi sunucusundan çağırır ve dönen Sanctum token'ını
 * tarayıcıya hiç göndermeden `HttpOnly` bir çerezde saklar — bkz.
 * frontend/src/lib/admin/client.ts.
 */
Route::prefix('admin')->group(function (): void {
    // Tek işletme hesabı olduğu için 5/dk'lık genel bir sınır brute-force'a
    // karşı yeterlidir (Rule 03 §3, mevcut `throttle:6,1` deseniyle aynı yaklaşım).
    Route::post('/login', [AdminAuthController::class, 'login'])
        ->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', 'ability:admin'])->group(function (): void {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::put('/password', [AdminAuthController::class, 'updatePassword']);

        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/meta', [AdminMetaController::class, 'index']);
        Route::post('/media', [AdminMediaController::class, 'store']);

        Route::post('programs/reorder', [AdminProgramController::class, 'reorder']);
        Route::post('programs/{id}/restore', [AdminProgramController::class, 'restore'])->whereNumber('id');
        // `withTrashed()`: çöp kutusundaki bir kaydı açmak/düzenlemek/kalıcı
        // silmek de bu bağlamayı kullanır — aksi halde bu üçü 404 döner.
        Route::apiResource('programs', AdminProgramController::class)->withTrashed();

        Route::post('announcements/reorder', [AdminAnnouncementController::class, 'reorder']);
        Route::post('announcements/{id}/restore', [AdminAnnouncementController::class, 'restore'])->whereNumber('id');
        Route::apiResource('announcements', AdminAnnouncementController::class)->withTrashed();

        Route::post('staff-members/reorder', [AdminStaffMemberController::class, 'reorder']);
        Route::post('staff-members/{id}/restore', [AdminStaffMemberController::class, 'restore'])->whereNumber('id');
        Route::apiResource('staff-members', AdminStaffMemberController::class)->withTrashed();

        Route::post('faqs/reorder', [AdminFaqController::class, 'reorder']);
        Route::post('faqs/{id}/restore', [AdminFaqController::class, 'restore'])->whereNumber('id');
        Route::apiResource('faqs', AdminFaqController::class)->withTrashed();

        Route::post('testimonials/reorder', [AdminTestimonialController::class, 'reorder']);
        Route::apiResource('testimonials', AdminTestimonialController::class);

        Route::post('site-stats/reorder', [AdminSiteStatController::class, 'reorder']);
        Route::apiResource('site-stats', AdminSiteStatController::class)->except(['show']);

        Route::get('inquiries', [AdminInquiryController::class, 'index']);
        Route::get('inquiries/{inquiry}', [AdminInquiryController::class, 'show']);
        Route::put('inquiries/{inquiry}', [AdminInquiryController::class, 'update']);
        Route::delete('inquiries/{inquiry}', [AdminInquiryController::class, 'destroy']);

        Route::get('site-settings', [AdminSiteSettingController::class, 'show']);
        Route::put('site-settings', [AdminSiteSettingController::class, 'update']);

        Route::get('page-contents', [AdminPageContentController::class, 'index']);
        Route::put('page-contents/{key}', [AdminPageContentController::class, 'update'])->where('key', '.*');
        Route::delete('page-contents/{key}', [AdminPageContentController::class, 'destroy'])->where('key', '.*');
    });
});

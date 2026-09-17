<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\InquiryController;
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

// Tek yazma uç noktası. Dakikada 6 istekle sınırlanır (Rule 03 §3) —
// frontend'deki bal küpü ve Zod doğrulamasının üstüne üçüncü savunma katmanı.
Route::post('/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:6,1');

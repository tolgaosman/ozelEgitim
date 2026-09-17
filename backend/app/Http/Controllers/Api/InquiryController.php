<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInquiryRequest;
use App\Mail\InquiryReceivedMail;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;

final class InquiryController extends Controller
{
    /**
     * Bal küpü dolu geldiğinde kayıt oluşturulmaz ama yanıt başarılı bir
     * gönderimden ayırt edilemez — bota formun engellendiği belli edilmez
     * (Rule 03). Frontend'deki aynı davranışın sunucu tarafı ikizidir.
     */
    public function store(StoreInquiryRequest $request): JsonResponse
    {
        if (filled($request->validated('honeypot'))) {
            return response()->json(
                ['message' => 'Talebiniz alındı.'],
                Response::HTTP_CREATED,
            );
        }

        $inquiry = Inquiry::create([
            ...$request->toDatabaseAttributes(),
            'ip_hash' => $this->hashRequestIp($request->ip()),
        ]);

        // Kuyruğa alınır: SMTP yavaşlığı ziyaretçinin form yanıtını bekletmez.
        // Kuyruk işçisi çalışmasa bile talep veritabanına çoktan yazılmıştır.
        Mail::to(config('mail.inquiry_recipient'))
            ->queue(new InquiryReceivedMail($inquiry));

        return response()->json(
            ['message' => 'Talebiniz alındı.'],
            Response::HTTP_CREATED,
        );
    }

    /**
     * Ham IP adresi saklanmaz (KVKK veri minimizasyonu). Uygulama anahtarıyla
     * tuzlanmış özet, aynı kaynaktan gelen spam yığınlarını IP'yi hiç bilmeden
     * gruplamaya yeter ve geri döndürülemez.
     */
    private function hashRequestIp(?string $requestIp): ?string
    {
        if (blank($requestIp)) {
            return null;
        }

        return hash_hmac('sha256', $requestIp, (string) config('app.key'));
    }
}

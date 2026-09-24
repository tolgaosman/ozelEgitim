<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Http\Requests\Admin\UpdatePasswordRequest;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

/**
 * Giriş ekranında yalnızca bir şifre alanı vardır (bkz. frontend
 * `src/app/admin/giris`) — hesap, sitedeki işletme e-postasına
 * (`SiteSetting::current()->email`) bağlıdır. Böylece "hangi e-posta"
 * sorusu hiç sorulmaz: panel her zaman sitede gösterilen işletme
 * hesabına aittir.
 *
 * Token tarayıcıya hiç ulaşmaz: Next.js sunucusu bu uç noktayı
 * server-to-server çağırır ve dönen token'ı `HttpOnly` bir çerezde saklar.
 */
final class AdminAuthController extends Controller
{
    private const TOKEN_NAME = 'admin-panel';

    private const TOKEN_TTL_DAYS = 7;

    /** Hesap bulunamadığında `Hash::check`i yine de çalıştırmak için kullanılan sahte bcrypt özeti. */
    private const DUMMY_PASSWORD_HASH = '$2y$12$7ImQhY3Q6oGZ8sScGnU9UOe1as1d1MfLoYSjrTP0MU3n4dLnBb9gG';

    public function login(LoginRequest $request): JsonResponse
    {
        $businessEmail = SiteSetting::current()->email;

        $adminUser = User::query()
            ->where('email', $businessEmail)
            ->where('is_admin', true)
            ->first();

        // Hesap yoksa da `Hash::check` yine de çalıştırılır (sahte bir özete
        // karşı): aksi halde yanıt süresindeki fark, geçerli bir hesabın var
        // olup olmadığını sızdırabilirdi (timing side-channel).
        $passwordMatches = Hash::check($request->validated('password'), $adminUser->password ?? self::DUMMY_PASSWORD_HASH)
            && $adminUser !== null;

        if (! $passwordMatches) {
            return response()->json(
                ['message' => 'Şifre hatalı.'],
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        /** @var User $adminUser */
        $token = $adminUser->createToken(
            self::TOKEN_NAME,
            ['admin'],
            now()->addDays(self::TOKEN_TTL_DAYS),
        );

        return response()->json([
            'data' => [
                'token' => $token->plainTextToken,
                'expiresAt' => now()->addDays(self::TOKEN_TTL_DAYS)->toIso8601String(),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Çıkış yapıldı.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /** Şifre değiştirilince diğer tüm oturumlar (token'lar) iptal edilir. */
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! Hash::check($request->validated('currentPassword'), $user->password)) {
            return response()->json(
                ['message' => 'Mevcut şifre hatalı.'],
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        $user->password = $request->validated('newPassword');
        $user->save();

        $currentTokenId = $request->user()?->currentAccessToken()?->id;
        $user->tokens()->where('id', '!=', $currentTokenId)->delete();

        return response()->json(['message' => 'Şifre güncellendi.']);
    }
}

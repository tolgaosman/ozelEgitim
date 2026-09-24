<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/**
 * Bir görsel alanı değiştirildiğinde veya kaldırıldığında eski dosyayı
 * `storage/app/public`'ten siler — aksi halde her değişiklik diskte kalıcı
 * bir artık (orphan) bırakır. Yalnızca panelin kendi yüklediği değerlere
 * dokunur: göreli storage yolları (`programs/xxx.jpg`, `imagePath`/`photoPath`
 * sütunlarında) ve kendi `public` disk'imizin mutlak URL'leri (sayfa içeriği
 * bloklarında, bkz. `MediaUrl::resolvePageContentValue`). Site kökünden gelen
 * varsayılan görseller (`/images/...`) ve dış URL'ler asla silinmez.
 */
final class MediaCleanup
{
    /** `StoreMediaRequest`teki `directory` alanının izin verdiği tek dizinler — bkz. `isOwnedUploadPath()`. */
    private const UPLOAD_DIRECTORIES = ['programs', 'announcements', 'staff', 'page-content'];

    public static function deleteIfOwned(?string $value): void
    {
        $relativePath = self::toOwnedRelativePath($value);

        if ($relativePath !== null) {
            Storage::disk('public')->delete($relativePath);
        }
    }

    /**
     * Eski değer(ler)den, yeni değer(ler)de artık bulunmayanları siler.
     * Sayfa içeriği görsel listeleri (hero slaytları, galeri) için kullanılır.
     *
     * @param  list<string>  $oldValues
     * @param  list<string>  $newValues
     */
    public static function deleteRemoved(array $oldValues, array $newValues): void
    {
        foreach (array_diff($oldValues, $newValues) as $removedValue) {
            self::deleteIfOwned($removedValue);
        }
    }

    /** Değeri, bizim `public` disk'imize ait göreli bir storage yoluna çevirir; aksi halde `null`. */
    private static function toOwnedRelativePath(?string $value): ?string
    {
        if (blank($value) || str_starts_with($value, '/')) {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            $storageBaseUrl = rtrim(Storage::disk('public')->url(''), '/');

            if (! str_starts_with($value, $storageBaseUrl.'/')) {
                return null;
            }

            $value = substr($value, strlen($storageBaseUrl) + 1);
        }

        return self::isOwnedUploadPath($value) ? $value : null;
    }

    /**
     * Sayfa içeriği alanları serbest metin olarak doğrulanır (bkz.
     * `PageContentBlueprint::rulesFor()`, yalnızca `string|max:500`) — bu
     * yüzden bir yol geleneksel bir yükleme yolu gibi GÖRÜNMÜYORSA
     * (`MediaController::store()`'un ürettiği `<izinli-dizin>/dosya` biçimi)
     * silinmez. Bu, `"../../../.env"` gibi bir değerin `public` disk'in
     * dışına çıkmasını (path traversal) veya izin verilmeyen bir dizindeki
     * bir dosyayı silmeyi engeller.
     */
    private static function isOwnedUploadPath(string $relativePath): bool
    {
        if (str_contains($relativePath, '..') || str_starts_with($relativePath, '/')) {
            return false;
        }

        foreach (self::UPLOAD_DIRECTORIES as $directory) {
            if (str_starts_with($relativePath, $directory.'/')) {
                return true;
            }
        }

        return false;
    }
}

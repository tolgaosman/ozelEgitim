<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Ön görüşme talebinin merkez tarafındaki takip durumu. Yalnızca yönetim
 * panelinde kullanılır — hiçbir API yanıtında dışarı verilmez.
 */
enum InquiryStatus: string
{
    case Yeni = 'yeni';
    case Iletisimde = 'iletisimde';
    case Tamamlandi = 'tamamlandi';

    public function label(): string
    {
        return match ($this) {
            self::Yeni => 'Yeni',
            self::Iletisimde => 'İletişimde',
            self::Tamamlandi => 'Tamamlandı',
        };
    }

    /** Filament tablosundaki durum rozetinin rengi. */
    public function color(): string
    {
        return match ($this) {
            self::Yeni => 'warning',
            self::Iletisimde => 'info',
            self::Tamamlandi => 'success',
        };
    }
}

<?php

declare(strict_types=1);

namespace App\Enums;

/** `AnnouncementCategorySchema` (frontend/src/lib/schemas/announcement.ts) karşılığı. */
enum AnnouncementCategory: string
{
    case Etkinlik = 'etkinlik';
    case Duyuru = 'duyuru';
    case BasariHikayesi = 'basari-hikayesi';

    /** Frontend'deki `announcementCategoryLabels` ile aynı Türkçe karşılıklar. */
    public function label(): string
    {
        return match ($this) {
            self::Etkinlik => 'Etkinlik',
            self::Duyuru => 'Duyuru',
            self::BasariHikayesi => 'Başarı Hikayesi',
        };
    }
}

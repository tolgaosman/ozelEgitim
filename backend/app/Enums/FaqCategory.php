<?php

declare(strict_types=1);

namespace App\Enums;

/** `FaqCategorySchema` (frontend/src/lib/schemas/faq.ts) karşılığı. */
enum FaqCategory: string
{
    case Kayit = 'kayit';
    case Programlar = 'programlar';
    case GunlukYasam = 'gunluk-yasam';
    case MaliDestek = 'mali-destek';

    /** Frontend'deki `faqCategoryLabels` ile aynı Türkçe karşılıklar. */
    public function label(): string
    {
        return match ($this) {
            self::Kayit => 'Kayıt Süreci',
            self::Programlar => 'Programlar',
            self::GunlukYasam => 'Günlük Yaşam',
            self::MaliDestek => 'Mali Destek',
        };
    }
}

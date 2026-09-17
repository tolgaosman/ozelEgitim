<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Frontend'deki `ProgramIconSchema` (frontend/src/lib/schemas/program.ts) ile
 * birebir aynı sekiz değeri taşır. Buraya yeni bir değer eklenirse Zod şeması
 * ve `frontend/src/lib/icon-map.ts` de güncellenmeli — aksi halde frontend
 * yanıtı doğrulayamaz ve `ApiError` fırlatır.
 */
enum ProgramIcon: string
{
    case Puzzle = 'puzzle';
    case MessageCircle = 'message-circle';
    case Brain = 'brain';
    case Activity = 'activity';
    case Sprout = 'sprout';
    case Ear = 'ear';
    case HandHeart = 'hand-heart';
    case Users = 'users';

    /** Filament formlarındaki açılır listede gösterilecek Türkçe etiket. */
    public function label(): string
    {
        return match ($this) {
            self::Puzzle => 'Yapboz — öğrenme güçlüğü',
            self::MessageCircle => 'Konuşma balonu — dil ve iletişim',
            self::Brain => 'Beyin — bilişsel gelişim',
            self::Activity => 'Hareket — fizyoterapi',
            self::Sprout => 'Filiz — erken çocukluk',
            self::Ear => 'Kulak — işitme ve duyu',
            self::HandHeart => 'Kalp ve el — aile danışmanlığı',
            self::Users => 'Grup — grup çalışmaları',
        };
    }
}

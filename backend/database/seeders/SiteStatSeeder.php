<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SiteStat;
use Illuminate\Database\Seeder;

/**
 * Bu dört sayaç daha önce `src/app/hakkimizda/page.tsx` ve
 * `src/components/sections/trajectories-module.tsx` içinde ayrı ayrı
 * kopyalanmıştı; artık tek kaynak burasıdır.
 */
final class SiteStatSeeder extends Seeder
{
    /** @var list<array{targetValue: int, suffix: string, label: string}> */
    private const STAT_RECORDS = [
        ['targetValue' => 18, 'suffix' => '+', 'label' => 'Yıllık Deneyim'],
        ['targetValue' => 620, 'suffix' => '+', 'label' => 'Desteklenen Çocuk'],
        ['targetValue' => 8, 'suffix' => '', 'label' => 'Uzmanlık Alanında Program'],
        ['targetValue' => 94, 'suffix' => '%', 'label' => 'Ailelerin Memnuniyet Oranı'],
    ];

    public function run(): void
    {
        foreach (self::STAT_RECORDS as $sortIndex => $statRecord) {
            SiteStat::query()->updateOrCreate(
                ['label' => $statRecord['label']],
                [
                    'target_value' => $statRecord['targetValue'],
                    'suffix' => $statRecord['suffix'],
                    'sort_order' => $sortIndex,
                ],
            );
        }
    }
}

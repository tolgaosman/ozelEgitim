<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Announcement;
use App\Models\Faq;
use App\Models\Program;
use App\Models\SiteSetting;
use App\Models\SiteStat;
use App\Models\StaffMember;
use App\Models\Testimonial;
use App\Observers\FrontendCacheObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * İçerik değiştiğinde Next.js ISR önbelleğini tazeleyen gözlemci bu
     * modellere bağlanır. Yeni bir içerik modeli eklendiğinde listeye de
     * eklenmelidir — aksi halde değişiklik sitede 5 dakikaya kadar gecikir.
     *
     * @var list<class-string<Model>>
     */
    private const FRONTEND_CACHED_MODELS = [
        Program::class,
        Announcement::class,
        StaffMember::class,
        Faq::class,
        Testimonial::class,
        SiteSetting::class,
        SiteStat::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        foreach (self::FRONTEND_CACHED_MODELS as $modelClass) {
            $modelClass::observe(FrontendCacheObserver::class);
        }
    }
}

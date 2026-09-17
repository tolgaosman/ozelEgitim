<?php

declare(strict_types=1);

namespace App\Filament\Resources\Inquiries;

use App\Enums\InquiryStatus;
use App\Filament\Resources\Inquiries\Pages\EditInquiry;
use App\Filament\Resources\Inquiries\Pages\ListInquiries;
use App\Filament\Resources\Inquiries\Schemas\InquiryForm;
use App\Filament\Resources\Inquiries\Tables\InquiriesTable;
use App\Models\Inquiry;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

/**
 * Talepler yalnızca sitedeki iletişim formundan oluşur; panelden elle kayıt
 * açılamaz (`create` sayfası kasıtlı olarak tanımlanmamıştır). Gezinmedeki
 * rozet, henüz ele alınmamış talep sayısını gösterir.
 */
class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInbox;

    protected static string|UnitEnum|null $navigationGroup = 'Talepler';

    protected static ?string $navigationLabel = 'Ön Görüşme Talepleri';

    protected static ?string $modelLabel = 'talep';

    protected static ?string $pluralModelLabel = 'talepler';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return InquiryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return InquiriesTable::configure($table);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getNavigationBadge(): ?string
    {
        $newInquiryCount = static::getModel()::query()
            ->where('status', InquiryStatus::Yeni)
            ->count();

        return $newInquiryCount > 0 ? (string) $newInquiryCount : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function getPages(): array
    {
        return [
            'index' => ListInquiries::route('/'),
            'edit' => EditInquiry::route('/{record}/edit'),
        ];
    }
}

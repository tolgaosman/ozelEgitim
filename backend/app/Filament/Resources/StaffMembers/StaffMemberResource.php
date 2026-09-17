<?php

declare(strict_types=1);

namespace App\Filament\Resources\StaffMembers;

use App\Filament\Resources\StaffMembers\Pages\CreateStaffMember;
use App\Filament\Resources\StaffMembers\Pages\EditStaffMember;
use App\Filament\Resources\StaffMembers\Pages\ListStaffMembers;
use App\Filament\Resources\StaffMembers\Schemas\StaffMemberForm;
use App\Filament\Resources\StaffMembers\Tables\StaffMembersTable;
use App\Models\StaffMember;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class StaffMemberResource extends Resource
{
    protected static ?string $model = StaffMember::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;

    protected static string|UnitEnum|null $navigationGroup = 'İçerik';

    protected static ?string $navigationLabel = 'Kadro';

    protected static ?string $modelLabel = 'ekip üyesi';

    protected static ?string $pluralModelLabel = 'ekip üyeleri';

    protected static ?string $recordTitleAttribute = 'full_name';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return StaffMemberForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return StaffMembersTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListStaffMembers::route('/'),
            'create' => CreateStaffMember::route('/create'),
            'edit' => EditStaffMember::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}

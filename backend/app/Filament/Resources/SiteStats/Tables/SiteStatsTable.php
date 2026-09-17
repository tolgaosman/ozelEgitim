<?php

declare(strict_types=1);

namespace App\Filament\Resources\SiteStats\Tables;

use App\Models\SiteStat;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SiteStatsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('label')
                    ->label('Etiket')
                    ->searchable(),
                TextColumn::make('target_value')
                    ->label('Değer')
                    // Sitedeki görünümün aynısı: sayı ve son ek bitişik.
                    ->formatStateUsing(
                        fn (int $state, SiteStat $record): string => $state.$record->suffix,
                    ),
                TextColumn::make('sort_order')
                    ->label('Sıra')
                    ->numeric()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}

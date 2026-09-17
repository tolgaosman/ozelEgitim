<?php

declare(strict_types=1);

namespace App\Filament\Resources\Programs\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProgramsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            // Sıra sütunu sürükle-bırak ile değiştirilebilir; sitedeki
            // program kartlarının dizilimi doğrudan bunu yansıtır.
            ->reorderable('sort_order')
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Görsel')
                    ->disk('public')
                    ->defaultImageUrl(null),
                TextColumn::make('name')
                    ->label('Program')
                    ->searchable()
                    ->sortable()
                    ->wrap(),
                TextColumn::make('age_range_label')
                    ->label('Yaş aralığı')
                    ->toggleable(),
                TextColumn::make('icon')
                    ->label('İkon')
                    ->badge()
                    ->formatStateUsing(fn ($state): string => $state->label())
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('published_at')
                    ->label('Yayın')
                    ->dateTime('d.m.Y H:i')
                    ->placeholder('Taslak')
                    ->sortable(),
                TextColumn::make('sort_order')
                    ->label('Sıra')
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([
                TernaryFilter::make('published_at')
                    ->label('Yayın durumu')
                    ->placeholder('Tümü')
                    ->trueLabel('Yayında')
                    ->falseLabel('Taslak')
                    ->queries(
                        true: fn (Builder $query): Builder => $query
                            ->whereNotNull('published_at')
                            ->where('published_at', '<=', now()),
                        false: fn (Builder $query): Builder => $query
                            ->whereNull('published_at')
                            ->orWhere('published_at', '>', now()),
                    ),
                TrashedFilter::make()
                    ->label('Silinmişler'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}

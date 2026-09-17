<?php

declare(strict_types=1);

namespace App\Filament\Resources\Faqs\Tables;

use App\Enums\FaqCategory;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class FaqsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->groups(['category'])
            ->columns([
                TextColumn::make('question')
                    ->label('Soru')
                    ->searchable()
                    ->wrap(),
                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->formatStateUsing(fn ($state): string => $state->label()),
                IconColumn::make('is_published')
                    ->label('Yayında')
                    ->boolean(),
                TextColumn::make('sort_order')
                    ->label('Sıra')
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->label('Kategori')
                    ->options(FaqCategory::class),
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

<?php

declare(strict_types=1);

namespace App\Filament\Resources\Announcements\Tables;

use App\Enums\AnnouncementCategory;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class AnnouncementsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            // Sitedeki sıralamayla aynı: en yeni duyuru en üstte.
            ->defaultSort('published_at', 'desc')
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Görsel')
                    ->disk('public'),
                TextColumn::make('title')
                    ->label('Başlık')
                    ->searchable()
                    ->sortable()
                    ->wrap(),
                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->formatStateUsing(fn ($state): string => $state->label()),
                TextColumn::make('published_at')
                    ->label('Yayın')
                    ->dateTime('d.m.Y H:i')
                    ->placeholder('Taslak')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->label('Kategori')
                    ->options(AnnouncementCategory::class),
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

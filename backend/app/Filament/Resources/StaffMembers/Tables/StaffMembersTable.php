<?php

declare(strict_types=1);

namespace App\Filament\Resources\StaffMembers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class StaffMembersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                ImageColumn::make('photo_path')
                    ->label('Fotoğraf')
                    ->disk('public')
                    ->circular(),
                TextColumn::make('full_name')
                    ->label('Ad soyad')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('title')
                    ->label('Unvan')
                    ->searchable()
                    ->wrap(),
                TextColumn::make('sort_order')
                    ->label('Sıra')
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([
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

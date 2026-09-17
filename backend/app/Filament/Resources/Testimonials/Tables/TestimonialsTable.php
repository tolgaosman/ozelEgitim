<?php

declare(strict_types=1);

namespace App\Filament\Resources\Testimonials\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class TestimonialsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('parent_name')
                    ->label('Veli')
                    ->searchable(),
                TextColumn::make('relation_label')
                    ->label('Yakınlık')
                    ->toggleable(),
                TextColumn::make('quote')
                    ->label('Görüş')
                    ->limit(80)
                    ->wrap(),
                TextColumn::make('program.name')
                    ->label('Program')
                    ->placeholder('—')
                    ->toggleable(),
                IconColumn::make('is_published')
                    ->label('Yayında')
                    ->boolean(),
            ])
            ->filters([
                TernaryFilter::make('is_published')
                    ->label('Yayın durumu')
                    ->placeholder('Tümü')
                    ->trueLabel('Yayında')
                    ->falseLabel('Onay bekliyor'),
                SelectFilter::make('program')
                    ->label('Program')
                    ->relationship('program', 'name')
                    ->searchable()
                    ->preload(),
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

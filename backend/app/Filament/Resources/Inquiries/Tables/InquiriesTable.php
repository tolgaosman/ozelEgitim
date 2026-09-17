<?php

declare(strict_types=1);

namespace App\Filament\Resources\Inquiries\Tables;

use App\Enums\InquiryStatus;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class InquiriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            // En yeni talep en üstte: ekip listeyi yukarıdan aşağı işler.
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('created_at')
                    ->label('Geliş')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
                TextColumn::make('parent_full_name')
                    ->label('Veli')
                    ->searchable(),
                TextColumn::make('child_age_label')
                    ->label('Yaş')
                    ->toggleable(),
                TextColumn::make('phone_number')
                    ->label('Telefon')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Telefon kopyalandı'),
                TextColumn::make('email')
                    ->label('E-posta')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('E-posta kopyalandı')
                    ->toggleable(),
                TextColumn::make('program_of_interest')
                    ->label('Program')
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('status')
                    ->label('Durum')
                    ->badge()
                    ->formatStateUsing(fn (InquiryStatus $state): string => $state->label())
                    ->color(fn (InquiryStatus $state): string => $state->color()),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Durum')
                    ->options(InquiryStatus::class),
            ])
            ->recordActions([
                EditAction::make()
                    ->label('Aç'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}

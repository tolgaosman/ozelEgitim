<?php

declare(strict_types=1);

namespace App\Filament\Resources\Inquiries\Schemas;

use App\Enums\InquiryStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/**
 * Velinin gönderdiği alanlar salt okunurdur — panelden düzenlenmeleri
 * kaydı velinin yazdığından farklı hale getirir ve takibi yanıltır.
 * Yalnızca merkezin kendi takip alanları (durum, not) yazılabilir.
 */
class InquiryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Velinin gönderdiği bilgiler')
                    ->columns(2)
                    ->schema([
                        TextInput::make('parent_full_name')
                            ->label('Ad soyad')
                            ->disabled(),
                        TextInput::make('child_age_label')
                            ->label('Çocuğun yaşı')
                            ->disabled(),
                        TextInput::make('phone_number')
                            ->label('Telefon')
                            ->tel()
                            ->disabled(),
                        TextInput::make('email')
                            ->label('E-posta')
                            ->email()
                            ->disabled(),
                        TextInput::make('program_of_interest')
                            ->label('İlgilenilen program')
                            ->placeholder('Belirtilmemiş')
                            ->disabled(),
                        DateTimePicker::make('created_at')
                            ->label('Geliş tarihi')
                            ->disabled(),
                        Textarea::make('message')
                            ->label('Veli notu')
                            ->placeholder('Not bırakılmamış')
                            ->rows(4)
                            ->disabled()
                            ->columnSpanFull(),
                    ]),

                Section::make('Merkez takibi')
                    ->columns(2)
                    ->schema([
                        Select::make('status')
                            ->label('Durum')
                            ->options(InquiryStatus::class)
                            ->required()
                            ->native(false),
                        DateTimePicker::make('handled_at')
                            ->label('İletişime geçilen tarih')
                            ->seconds(false),
                        Textarea::make('internal_note')
                            ->label('İç not')
                            ->helperText('Yalnızca ekip görür; veliye hiçbir şekilde gösterilmez.')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}

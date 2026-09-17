<?php

declare(strict_types=1);

namespace App\Filament\Resources\SiteStats\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SiteStatForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Sayaç kartı')
                    ->description('Anasayfa ve Hakkımızda sayfasındaki animasyonlu sayaçlar.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('label')
                            ->label('Etiket')
                            ->placeholder('Yıllık Deneyim')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        TextInput::make('target_value')
                            ->label('Değer')
                            ->helperText('Sayaç sıfırdan bu sayıya kadar animasyonla sayar.')
                            ->required()
                            ->numeric()
                            ->minValue(0),
                        TextInput::make('suffix')
                            ->label('Son ek')
                            ->helperText('Sayının hemen ardına eklenir. Boş bırakılabilir.')
                            ->maxLength(8),
                        TextInput::make('sort_order')
                            ->label('Sıra')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                    ]),
            ]);
    }
}

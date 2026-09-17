<?php

declare(strict_types=1);

namespace App\Filament\Resources\Faqs\Schemas;

use App\Enums\FaqCategory;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/** Alan kısıtları frontend'deki `FaqSchema` ile birebir aynıdır. */
class FaqForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Soru')
                    ->columns(2)
                    ->schema([
                        Select::make('category')
                            ->label('Kategori')
                            ->helperText('SSS sayfasında sorular bu kategoriye göre gruplanır.')
                            ->options(FaqCategory::class)
                            ->required()
                            ->native(false),
                        TextInput::make('sort_order')
                            ->label('Sıra')
                            ->helperText('Kategori içindeki sıra. Küçük sayı önce gösterilir.')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                        TextInput::make('question')
                            ->label('Soru')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Textarea::make('answer')
                            ->label('Cevap')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                        Toggle::make('is_published')
                            ->label('Yayında')
                            ->helperText('Kapatılırsa soru sitede görünmez.')
                            ->default(true),
                    ]),
            ]);
    }
}

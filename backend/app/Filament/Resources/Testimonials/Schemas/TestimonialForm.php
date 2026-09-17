<?php

declare(strict_types=1);

namespace App\Filament\Resources\Testimonials\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/** Alan kısıtları frontend'deki `TestimonialSchema` ile birebir aynıdır. */
class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Veli görüşü')
                    ->columns(2)
                    ->schema([
                        TextInput::make('parent_name')
                            ->label('Veli adı')
                            ->helperText('KVKK gereği gerçek ad yerine kısaltılmış bir ifade tercih edilmelidir.')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('relation_label')
                            ->label('Yakınlık')
                            ->placeholder('8 yaşındaki oğlunun annesi')
                            ->required()
                            ->maxLength(255),
                        Textarea::make('quote')
                            ->label('Görüş metni')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                        Select::make('program_id')
                            ->label('İlgili program')
                            ->helperText('İsteğe bağlı. Görüşün hangi programa ait olduğunu belirtir.')
                            ->relationship('program', 'name')
                            ->searchable()
                            ->preload()
                            ->native(false),
                        TextInput::make('sort_order')
                            ->label('Sıra')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                        Toggle::make('is_published')
                            ->label('Yayında')
                            ->helperText('Bir veli görüşü yalnızca yazılı onay alındıktan sonra yayına alınmalıdır (KVKK).')
                            ->default(false)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Filament\Resources\Announcements\Schemas;

use App\Enums\AnnouncementCategory;
use App\Models\Announcement;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

/** Alan kısıtları frontend'deki `AnnouncementSchema` ile birebir aynıdır. */
class AnnouncementForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Duyuru')
                    ->columns(2)
                    ->schema([
                        TextInput::make('title')
                            ->label('Başlık')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, Set $set, ?Announcement $record): void {
                                if ($record !== null) {
                                    return;
                                }

                                $set('slug', Str::slug((string) $state));
                            }),
                        TextInput::make('slug')
                            ->label('URL kısaltması')
                            ->helperText('Sitedeki adres: /duyurular/<kısaltma>.')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->rule('alpha_dash'),
                        Select::make('category')
                            ->label('Kategori')
                            ->options(AnnouncementCategory::class)
                            ->required()
                            ->native(false),
                        FileUpload::make('image_path')
                            ->label('Kapak görseli')
                            ->image()
                            ->disk('public')
                            ->directory('announcements')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->maxSize(2048)
                            ->imageEditor(),
                        Textarea::make('excerpt')
                            ->label('Özet')
                            ->helperText('Duyuru listesinde görünen kısa tanıtım metni.')
                            ->required()
                            ->maxLength(255)
                            ->rows(2)
                            ->columnSpanFull(),
                    ]),

                Section::make('Metin')
                    ->description('Her paragraf duyuru sayfasında ayrı bir metin bloğu olarak görünür.')
                    ->schema([
                        Repeater::make('body')
                            ->label('Paragraflar')
                            ->hiddenLabel()
                            ->simple(
                                Textarea::make('paragraph')
                                    ->label('Paragraf')
                                    ->required()
                                    ->rows(3),
                            )
                            ->minItems(1)
                            ->addActionLabel('Paragraf ekle')
                            ->reorderable(),
                    ]),

                Section::make('Yayın')
                    ->columns(2)
                    ->schema([
                        DateTimePicker::make('published_at')
                            ->label('Yayın tarihi')
                            ->helperText('Duyurular sitede bu tarihe göre yeniden eskiye sıralanır. Boş bırakılırsa taslakta kalır.')
                            ->seconds(false)
                            ->default(now()),
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

<?php

declare(strict_types=1);

namespace App\Filament\Resources\Programs\Schemas;

use App\Enums\ProgramIcon;
use App\Models\Program;
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

/**
 * Alan kısıtları frontend'deki `ProgramSchema` ile birebir aynıdır. Panelden
 * şemaya uymayan bir kayıt girilemezse, API yanıtı da Zod doğrulamasından
 * hiçbir zaman düşmez — `ApiError` kaynağında engellenmiş olur.
 */
class ProgramForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Tanım')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->label('Program adı')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            // Kısaltma yalnızca YENİ kayıtta ada göre türetilir.
                            // Yayındaki bir programın kısaltmasını ad değişince
                            // sessizce değiştirmek mevcut bağlantıları kırardı.
                            ->afterStateUpdated(function (?string $state, Set $set, ?Program $record): void {
                                if ($record !== null) {
                                    return;
                                }

                                $set('slug', Str::slug((string) $state));
                            }),
                        TextInput::make('slug')
                            ->label('URL kısaltması')
                            ->helperText('Sitedeki adres: /programlar/<kısaltma>. Yayındaki bir programda değiştirmek eski bağlantıları kırar.')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->rule('alpha_dash'),
                        TextInput::make('short_description')
                            ->label('Kısa açıklama')
                            ->helperText('Program kartlarında görünen tek cümlelik özet.')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Select::make('icon')
                            ->label('Kart ikonu')
                            ->options(ProgramIcon::class)
                            ->required()
                            ->native(false),
                        FileUpload::make('image_path')
                            ->label('Program görseli')
                            ->helperText('Boş bırakılırsa site kendi yer tutucu görselini kullanır.')
                            ->image()
                            ->disk('public')
                            ->directory('programs')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->maxSize(2048)
                            ->imageEditor(),
                        TextInput::make('age_range_label')
                            ->label('Yaş aralığı')
                            ->placeholder('6-14 yaş')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('session_format_label')
                            ->label('Seans biçimi')
                            ->placeholder('Bire bir, haftada 2-3 seans')
                            ->required()
                            ->maxLength(255),
                    ]),

                Section::make('Detay metni')
                    ->description('Her paragraf program sayfasında ayrı bir metin bloğu olarak görünür.')
                    ->schema([
                        Repeater::make('description')
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

                Section::make('Öne çıkanlar')
                    ->description('Program sayfasındaki maddeler. En az 1, en fazla 6 madde girilebilir.')
                    ->schema([
                        Repeater::make('highlights')
                            ->label('Maddeler')
                            ->hiddenLabel()
                            ->schema([
                                TextInput::make('title')
                                    ->label('Başlık')
                                    ->required()
                                    ->maxLength(255),
                                Textarea::make('description')
                                    ->label('Açıklama')
                                    ->required()
                                    ->rows(2),
                            ])
                            ->minItems(1)
                            // Üst sınır frontend'deki ProgramSchema ile aynıdır:
                            // 6'dan fazlası Zod doğrulamasından düşerdi.
                            ->maxItems(6)
                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                            ->collapsible()
                            ->addActionLabel('Madde ekle')
                            ->reorderable(),
                    ]),

                Section::make('Yayın')
                    ->columns(2)
                    ->schema([
                        DateTimePicker::make('published_at')
                            ->label('Yayın tarihi')
                            ->helperText('Boş bırakılırsa program taslakta kalır ve sitede hiç görünmez.')
                            ->seconds(false)
                            ->default(now()),
                        TextInput::make('sort_order')
                            ->label('Sıra')
                            ->helperText('Küçük sayı önce gösterilir.')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                    ]),
            ]);
    }
}

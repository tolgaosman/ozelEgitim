<?php

declare(strict_types=1);

namespace App\Filament\Resources\StaffMembers\Schemas;

use App\Models\StaffMember;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

/** Alan kısıtları frontend'deki `StaffMemberSchema` ile birebir aynıdır. */
class StaffMemberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Ekip üyesi')
                    ->columns(2)
                    ->schema([
                        TextInput::make('full_name')
                            ->label('Ad soyad')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, Set $set, ?StaffMember $record): void {
                                if ($record !== null) {
                                    return;
                                }

                                $set('slug', Str::slug((string) $state));
                            }),
                        TextInput::make('slug')
                            ->label('URL kısaltması')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->rule('alpha_dash'),
                        TextInput::make('title')
                            ->label('Unvan')
                            ->placeholder('Dil ve Konuşma Terapisti, Klinik Koordinatör')
                            ->required()
                            ->maxLength(255),
                        FileUpload::make('photo_path')
                            ->label('Fotoğraf')
                            ->helperText('Boş bırakılırsa sitede ad-soyad baş harflerinden oluşan avatar gösterilir.')
                            ->image()
                            ->avatar()
                            ->disk('public')
                            ->directory('staff')
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->maxSize(2048)
                            ->imageEditor(),
                        Textarea::make('bio')
                            ->label('Kısa biyografi')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                Section::make('Uzmanlık alanları')
                    ->description('Kadro kartında etiket olarak görünür. En az 1, en fazla 5 alan girilebilir.')
                    ->schema([
                        Repeater::make('specialties')
                            ->label('Alanlar')
                            ->hiddenLabel()
                            ->simple(
                                TextInput::make('specialty')
                                    ->label('Uzmanlık alanı')
                                    ->required()
                                    ->maxLength(255),
                            )
                            ->minItems(1)
                            // Üst sınır frontend'deki StaffMemberSchema ile aynıdır.
                            ->maxItems(5)
                            ->addActionLabel('Alan ekle')
                            ->reorderable(),
                    ]),

                Section::make('Sıralama')
                    ->schema([
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

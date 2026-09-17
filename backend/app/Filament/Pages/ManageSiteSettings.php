<?php

declare(strict_types=1);

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

/**
 * `site_settings` tablosu tek satırlıdır, bu yüzden liste/oluştur/düzenle
 * üçlüsü yerine tek bir düzenleme sayfası sunulur. Kaydedilen değerler
 * doğrudan `GET /api/site-settings` yanıtını besler.
 *
 * @property-read Schema $form
 */
class ManageSiteSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|UnitEnum|null $navigationGroup = 'Site Ayarları';

    protected static ?string $navigationLabel = 'İletişim ve Genel';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Site Ayarları';

    protected string $view = 'filament.pages.manage-site-settings';

    /** @var array<string, mixed> */
    public array $settingsData = [];

    public function mount(): void
    {
        $this->form->fill(SiteSetting::current()->attributesToArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('settingsData')
            ->components([
                Section::make('İletişim bilgileri')
                    ->description('Sitenin alt bilgisinde, iletişim sayfasında ve arama motoru verisinde kullanılır.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('phone_display')
                            ->label('Telefon (görünen)')
                            ->helperText('Ziyaretçiye gösterilen biçim. Örnek: +90 533 888 14 05')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('phone_tel')
                            ->label('Telefon (tel: bağlantısı)')
                            ->helperText('Boşluksuz, uluslararası biçim. Örnek: +905338881405')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('email')
                            ->label('E-posta')
                            ->email()
                            ->required()
                            ->maxLength(255),
                        TextInput::make('whatsapp_url')
                            ->label('WhatsApp bağlantısı')
                            ->url()
                            ->required()
                            ->maxLength(255),
                        TextInput::make('address')
                            ->label('Adres')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        TextInput::make('maps_url')
                            ->label('Harita bağlantısı')
                            ->url()
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ]),

                Section::make('Çalışma saatleri')
                    ->columns(3)
                    ->schema([
                        TextInput::make('weekday_hours')
                            ->label('Hafta içi')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('saturday_hours')
                            ->label('Cumartesi')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('sunday_hours')
                            ->label('Pazar')
                            ->helperText('Kapalıysa "Kapalı" yazın.')
                            ->required()
                            ->maxLength(255),
                    ]),

                Section::make('Sosyal medya')
                    ->description('Boş bırakılan bağlantı sitede hiç gösterilmez.')
                    ->columns(3)
                    ->schema([
                        TextInput::make('instagram_url')
                            ->label('Instagram')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('facebook_url')
                            ->label('Facebook')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('youtube_url')
                            ->label('YouTube')
                            ->url()
                            ->maxLength(255),
                    ]),

                Section::make('KVKK aydınlatma metni')
                    ->description('Her paragraf /kvkk sayfasında ayrı bir metin bloğu olarak görünür. Metin merkezin hukuk danışmanı tarafından onaylanmalıdır.')
                    ->collapsed()
                    ->schema([
                        Repeater::make('kvkk_body')
                            ->label('Paragraflar')
                            ->hiddenLabel()
                            ->simple(
                                Textarea::make('paragraph')
                                    ->label('Paragraf')
                                    ->required()
                                    ->rows(4),
                            )
                            ->minItems(1)
                            ->addActionLabel('Paragraf ekle')
                            ->reorderable(),
                    ]),
            ]);
    }

    /** @return array<int, Action> */
    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Kaydet')
                ->submit('save'),
        ];
    }

    public function save(): void
    {
        $validatedSettings = $this->form->getState();

        SiteSetting::current()->update($validatedSettings);

        Notification::make()
            ->title('Site ayarları kaydedildi')
            ->body('Değişiklikler sitede birkaç saniye içinde görünür.')
            ->success()
            ->send();
    }
}

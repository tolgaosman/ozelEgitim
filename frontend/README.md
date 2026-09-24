# İz Özel Eğitim Merkezi — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui ile
geliştirilmiş kurumsal site. İçerik ve yönetim paneli Laravel backend'inden
gelir; `src/mocks/` altındaki tipli yer tutucu veri yalnızca `API_BASE_URL`
tanımsızken veya backend geçici olarak erişilemezken devreye girer (bkz.
`../docs/architecture.md`).

## Geliştirme

```bash
npm install
npm run dev
```

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi (tip kontrolü dahil) |
| `npm run start` | Üretim sunucusu |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Yalnızca tip kontrolü |

## Backend entegrasyonu

`.env.local` içine `API_BASE_URL` tanımlandığında `src/lib/repositories/*`
otomatik olarak Laravel API'sine geçer; tanımsızken mock veri kullanılır.
Ayrıntılar için `../docs/architecture.md` ve `../docs/backend-blueprint.md`.

## Yönetim paneli

`/admin` (giriş: `/admin/giris`) sitenin kendi Next.js ağacında yaşayan
yönetim panelidir — `backend/app/Http/Controllers/Api/Admin/*` uç
noktalarına Sanctum token'ıyla, sunucudan sunucuya bağlanır; token tarayıcıya
hiç ulaşmaz, `HttpOnly` bir çerezde saklanır (bkz. `src/lib/admin/client.ts`).
Girişte yalnızca şifre alanı vardır — hesap her zaman Ayarlar'da gösterilen
işletme e-postasına bağlıdır.

## Erişilebilirlik notları

- Sağ üstteki "Erişilebilirlik" menüsünden yazı boyutu, kontrast, disleksi
  dostu yazı tipi ve hareket azaltma tercihleri değiştirilebilir; tercihler
  `localStorage`'da saklanır.
- Tüm animasyonlar `prefers-reduced-motion` ve kullanıcı tercihine göre
  otomatik devre dışı kalır.
- Marka adı her yerde `İz Özel Eğitim Merkezi` şeklinde, büyük noktalı `İ`
  ile yazılır; `text-transform: uppercase` bilinçli olarak kullanılmaz.

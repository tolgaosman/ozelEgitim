# İz Özel Eğitim Merkezi — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui ile
geliştirilmiş kurumsal site. Laravel backend'i henüz devrede değil; tüm
içerik `src/mocks/` altındaki tipli yer tutucu veriden gelir (bkz.
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

## Erişilebilirlik notları

- Sağ üstteki "Erişilebilirlik" menüsünden yazı boyutu, kontrast, disleksi
  dostu yazı tipi ve hareket azaltma tercihleri değiştirilebilir; tercihler
  `localStorage`'da saklanır.
- Tüm animasyonlar `prefers-reduced-motion` ve kullanıcı tercihine göre
  otomatik devre dışı kalır.
- Marka adı her yerde `İz Özel Eğitim Merkezi` şeklinde, büyük noktalı `İ`
  ile yazılır; `text-transform: uppercase` bilinçli olarak kullanılmaz.

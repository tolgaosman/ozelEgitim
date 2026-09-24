#!/bin/sh
# Veritabanını yalnızca ilk açılışta seed'ler. İçerik seeder'ları idempotent
# olmadığından her deploy'da çalışırsa kayıtlar çoğalır; işaret dosyası
# SQLite volume'unda tutulduğu için redeploy'larda korunur.
#
# Not: serversideup entrypoint bu script'i source edebilir — `exit` kullanma.

SEED_MARKER="/var/www/html/database/sqlite/.seeded"

if [ ! -f "$SEED_MARKER" ]; then
    echo "🌱 İlk açılış: php artisan db:seed --force çalıştırılıyor..."
    if php /var/www/html/artisan db:seed --force; then
        touch "$SEED_MARKER"
        echo "✅ Seed tamamlandı."
    else
        echo "❌ Seed başarısız oldu (ADMIN_SEED_PASSWORD tanımlı mı?). Bir sonraki açılışta tekrar denenecek."
    fi
else
    echo "ℹ️ Veritabanı daha önce seed'lenmiş, atlanıyor."
fi

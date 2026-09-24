# Aşama 1: Vite ile frontend asset derlemesi (Tailwind vb.)
FROM node:20-alpine AS node_builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Aşama 2: PHP 8.4 + Nginx sunucusu (composer.lock Symfony 8.1 → PHP >= 8.4.1 ister)
FROM serversideup/php:8.4-fpm-nginx

# Uygulama ayarları (APP_KEY, ADMIN_SEED_PASSWORD vb.) build sırasında gerekmez;
# runtime'da docker-compose `environment` ile verilir — gizli değerler imaj
# katmanlarına yazılmaz.

# serversideup v3 otomasyonları: her açılışta storage:link, migrate --force ve
# config/route/view cache çalışır (/etc/entrypoint.d/50-laravel-automations.sh).
ENV AUTORUN_ENABLED=true \
    AUTORUN_LARAVEL_STORAGE_LINK=true \
    AUTORUN_LARAVEL_MIGRATION=true

USER root
WORKDIR /var/www/html

# Proje dosyalarını kopyala (serversideup v3 kullanıcısı www-data'dır)
COPY --chown=www-data:www-data . .

# Vite derleme çıktılarını kopyala
COPY --from=node_builder --chown=www-data:www-data /app/public/build ./public/build

# Composer bağımlılıklarını kur
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Yetkileri ayarla
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# SQLite veritabanı ayrı klasörde tutulur; volume yalnızca bu klasörü bağlar,
# böylece database/migrations ve seeders her deploy'da güncel kalır.
RUN mkdir -p database/sqlite \
    && touch database/sqlite/database.sqlite \
    && chmod 775 database/sqlite \
    && chmod 664 database/sqlite/database.sqlite \
    && chown -R www-data:www-data database/sqlite

# İlk açılışta bir kez seed çalıştıran script (migration'lardan sonra, 60)
COPY docker/entrypoint.d/ /etc/entrypoint.d/
RUN sed -i 's/\r$//' /etc/entrypoint.d/60-seed-once.sh \
    && chmod 755 /etc/entrypoint.d/60-seed-once.sh

USER www-data

EXPOSE 8080

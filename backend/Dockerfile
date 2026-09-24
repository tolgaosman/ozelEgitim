# Aşama 1: Vite ile frontend asset derlemesi (Tailwind vb.)
FROM node:20-alpine AS node_builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Aşama 2: PHP 8.4 + Nginx sunucusu
FROM serversideup/php:8.4-fpm-nginx

# Root kullanıcısı olarak composer çalıştırırken sorun çıkmasını önle
ENV COMPOSER_ALLOW_SUPERUSER=1

# Build-arg olarak Coolify'dan gelen değişkenleri al
ARG APP_KEY
ARG APP_ENV=production
ARG APP_DEBUG=false
ARG DB_CONNECTION=sqlite
ARG ADMIN_SEED_NAME=Admin
ARG ADMIN_SEED_PASSWORD

# Ortam değişkenlerine aktar
ENV APP_KEY=${APP_KEY}
ENV APP_ENV=${APP_ENV}
ENV APP_DEBUG=${APP_DEBUG}
ENV DB_CONNECTION=${DB_CONNECTION}
ENV ADMIN_SEED_NAME=${ADMIN_SEED_NAME}
ENV ADMIN_SEED_PASSWORD=${ADMIN_SEED_PASSWORD}

USER root
WORKDIR /var/www/html

# Proje dosyalarını kopyala
COPY --chown=www-data:www-data . .

# Vite derleme çıktılarını kopyala
COPY --from=node_builder --chown=www-data:www-data /app/public/build ./public/build

# Composer bağımlılıklarını kur (Platform gereksinimlerini göz ardı et seçeneği eklendi)
RUN composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs

# Yetkileri ayarla
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# SQLite veritabanı dosyasını oluştur ve yetkilendir
RUN mkdir -p database \
    && touch database/database.sqlite \
    && chmod 775 database \
    && chmod 664 database/database.sqlite \
    && chown -R www-data:www-data database

# serversideup v3 için www-data geçişi
USER www-data

EXPOSE 8080

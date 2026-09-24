# Aşama 1: Vite ile frontend asset derlemesi (Tailwind vb.)
FROM node:20-alpine AS node_builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Aşama 2: PHP 8.4 + Nginx sunucusu (local PHP ile aynı versiyon)
FROM serversideup/php:8.4-fpm-nginx

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
COPY . .

# Vite derleme çıktılarını kopyala
COPY --from=node_builder /app/public/build ./public/build

# Composer bağımlılıklarını kur
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Yetkileri ayarla
RUN chown -R webuser:webgroup /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# SQLite veritabanı dosyasını oluştur ve yetkilendir
RUN mkdir -p database \
    && touch database/database.sqlite \
    && chmod 775 database \
    && chmod 664 database/database.sqlite \
    && chown -R webuser:webgroup database

USER webuser

EXPOSE 8080

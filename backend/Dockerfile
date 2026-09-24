# Aşama 1: Vite ile frontend (Tailwind vb.) derlemesi
FROM node:20-alpine AS node_builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Aşama 2: PHP ve Nginx içeren sunucu kurulumu
FROM serversideup/php:8.3-fpm-nginx-alpine

# Dosya yetkilerini ayarlamak için root'a geçiyoruz
USER root
WORKDIR /var/www/html

# Proje dosyalarını kopyalıyoruz
COPY . .
# Vite derleme çıktılarını kopyalıyoruz
COPY --from=node_builder /app/public/build ./public/build

# Sunucu kullanıcısına yetki veriyoruz
RUN chown -R webuser:webgroup /var/www/html

# Geri dönüp composer kurulumunu yapıyoruz
USER webuser
RUN composer install --no-dev --optimize-autoloader

# Opsiyonel: SQLite kullanılacaksa database klasörüne ek yetki gerekebilir
USER root
RUN chmod -R 775 storage bootstrap/cache database
USER webuser

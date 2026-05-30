# nos descargamos la imagen oficial de PHP con Apache
FROM php:8.4-apache

# instalamos las dependencias necesarias para Laravel y sus extensiones
# sed es para convertir saltos de línea de Windows a Unix en los scripts
RUN apt-get update && apt-get install -y \
    libpng-dev zlib1g-dev libxml2-dev libzip-dev default-mysql-client sed \
    && docker-php-ext-install pdo_mysql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# habilitamos el módulo de reescritura de Apache para las rutas amigables de Laravel
RUN a2enmod rewrite

# instalamos Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# establecemos el directorio de trabajo
WORKDIR /var/www/html

# copiamos primero SOLO los archivos de composer para aprovechar la caché de Docker
# si no añadimos librerías nuevas, Docker no tendrá que reinstalar las dependencias
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts --no-autoloader --prefer-dist

# luego copiamos el resto del código
COPY . .

# optimizamos el autoload de Composer para producción
RUN composer dump-autoload --optimize

# configuramos el DocumentRoot de Apache para que apunte a public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# ajustamos la configuración de Apache para que use esta nueva raíz
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# medidas de seguridad básicas para ocultar la versión de Apache
RUN echo "ServerTokens ProductOnly\nServerSignature Off" >> /etc/apache2/apache2.conf

# permisos adecuados a las carpetas de almacenamiento y caché de Laravel
RUN php artisan storage:link || true \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage

# IMPORTANTE: convertimos los saltos de línea de Windows (CRLF) a Unix (LF)
# en los scripts de arranque, para que funcionen en cualquier sistema operativo
RUN sed -i 's/\r//' /var/www/html/entrypoint-api.sh 2>/dev/null || true
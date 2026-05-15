# nos descargamos la imagen oficial de PHP con Apache
FROM php:8.4-apache

# instalamos las dependencias necesarias para Laravel y sus extensiones
RUN apt-get update && apt-get install -y \
    libpng-dev zlib1g-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# habilitamos el módulo de reescritura de Apache para las rutas amigables de Laravel
RUN a2enmod rewrite

# instalamos Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# establecemos el directorio de trabajo
WORKDIR /var/www/html

# esto son mejoras de velocidad,
# primero copiamos primero SOLO los archivos de composer
# asi, si no añadimos librerías nuevas, docker cacheará esta parte y no tendrá que volver a instalar las dependencias
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts --no-autoloader --prefer-dist

# luego copiamos el resto del código
COPY . .

# optimizamos el autoload de Composer para producción
RUN composer dump-autoload --optimize

# primero configuramos el DocumentRoot de Apache para que apunte a public, que es donde Laravel expone su index.php
# esto lo hacemos antes de los permisos para que no haya problemas con los archivos de configuración de Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# después, ajustamos la configuración de Apache para que use esta nueva raíz
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# añadimos medidas de seguridad básicas para ocultar la versión de Apache y PHP
RUN echo "ServerTokens ProductOnly\nServerSignature Off" >> /etc/apache2/apache2.conf

# finalemente, damos permisos adecuados a las carpetas de almacenamiento y cache de Laravel
# por seguridad, evitamos dar permisos 777 y en su lugar damos permisos 775 y asignamos la propiedad a www-data, 
# que es el usuario con el que corre Apache
RUN php artisan storage:link || true \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    zip unzip curl libpq-dev git \
    && docker-php-ext-install pdo pdo_pgsql

WORKDIR /var/www

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

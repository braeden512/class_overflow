FROM php:8.2-cli

WORKDIR /app

COPY . .

EXPOSE 10000

RUN docker-php-ext-install mysqli

CMD ["php", "-S", "0.0.0.0:10000", "-t", "."]
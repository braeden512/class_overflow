FROM php:8.2-cli

WORKDIR /app

COPY . .

# Install mysqli extension
RUN docker-php-ext-install mysqli

# Expose the port your PHP built-in server will listen on
EXPOSE 10000

# Start PHP built-in server listening on 0.0.0.0:10000, serving current directory
CMD ["php", "-S", "0.0.0.0:10000", "-t", "."]
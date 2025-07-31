FROM php:8.2-cli

WORKDIR /app

# Copy your app source code
COPY . .

# Copy the CA cert into the container (choose any accessible path)
COPY isrgrootx1.pem /app/isrgrootx1.pem

# Install mysqli extension
RUN docker-php-ext-install mysqli

EXPOSE 10000

CMD ["php", "-S", "0.0.0.0:10000", "-t", "."]
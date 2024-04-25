# Use the official NGINX image as a base
FROM nginx:latest

# Copy SSL/TLS certificates directory
# COPY ./src/ssl_certs/* /etc/nginx/ssl/
COPY ./src/ssl_certs/key.pem /etc/nginx/ssl/private/
COPY ./src/ssl_certs/cert.pem /etc/nginx/ssl/certs/

# Copy the custom NGINX configuration file
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
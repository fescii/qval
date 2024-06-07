# Use the official NGINX image as a base
FROM nginx:latest

# Create a directory for the SSL/TLS certificates
# RUN mkdir -p /etc/nginx/ssl
RUN mkdir -p /etc/nginx/ssl

# Copy SSL/TLS certificates directory
COPY ./src/ssl_certs/* /etc/nginx/ssl/

# Copy the custom NGINX configuration file
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Use the official NGINX image as a base
FROM nginx:mainline

# Create directory for SSL/TLS certificates
RUN mkdir -p /etc/nginx/ssl_certs

# Copy SSL/TLS certificates directory
COPY ./ssl_certs/* /etc/nginx/ssl_certs

# Copy the custom NGINX configuration file
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
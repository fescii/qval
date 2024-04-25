# Use the official NGINX image as a base
FROM nginx:mainline

# Copy the custom NGINX configuration file
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
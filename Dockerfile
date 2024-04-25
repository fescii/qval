# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY ./src/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY ./src/**/* .

# Create a directory for the SSL/TLS certificates
RUN mkdir -p /usr/src/app/ssl_certs

# Copy SSL/TLS certificates from one level up (project_root/ssl_certs/) into the container
COPY ./ssl_certs/* /usr/src/app/ssl_certs/

# Expose the port on which the Express.js application will run
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]

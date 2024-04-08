# Open platform

A platform built with Node.js, Express.js, and Postgres for robust database and AWS for file storage capabilities.

[https://github.com/fescii/avalq.git](https://github.com/fescii/qval.git)

## Features

* **Dynamic Content:** Create and easily manage engaging stories/posts.
* **Secure User Authentication:** JWT ensures secure login and authentication.
* **Media Storage:** Upload and integrate images or other media for enhanced articles (powered by AWS Storage).
* **Modern Frontend Design:**  todo(current).

## Technologies

* **Node.js:** Server-side runtime environment.
* **Express.js:**  Web application framework.
* **S3:** An Amazon web service providing scalable storage capabilities.

## Getting Started

**Prerequisites**

* Node.js and npm (or another package manager) installed on your system

**Installation**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/fescii/qval.git

2. **Install Dependencies**

   ```bash
   cd qval
   npm install

3. **Environment Variables**
   Create a ```.env``` file in the project's root directory.

   Add the following variables, replacing placeholders with your Supabase credentials:

   ```
   #PORT
   PORT=3000

   # Database Configs
   POSTGRES_DB_HOST=YOUR_DATABASE_HOST
   POSTGRES_DB_USER=YOUR_DATABASE_USER
   POSTGRES_DB_PASSWORD=YOUR_DATABASE_PASSWORD
   POSTGRES_DB_NAME=YOUR_DATABASE_NAME
   POSTGRES_DB_PORT=YOUR_DATABASE_PORT

   # AUTH JWT & HASH
   AUTH_SECRET=YOUR_AUTH_SECRET
   HASH_SECRET=YOUR_HASH_SECRET
   JWT_EXPIRY=86400


   # Generating development-only key & cert (use this in Linux)
   # - openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365 -subj '/CN=localhost'

4. **Running the project**
    ```bash
    npm start

**Notes**

  Please take a look at the express, Sequelize, and Postgres  documentation for setting up your project.

**Contributing**

This project welcomes contributions! Feel free to:

    Open issues to report bugs or suggest features.
    Fork the repository and create pull requests to propose changes and improvements.

Let's build a fantastic platform experience together!
  

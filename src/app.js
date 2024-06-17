const express = require("express");
// const http2 = require("http2");
const spdy = require('spdy');
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const app = express();

app.use(cookieParser())

app.use('/static', express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

let corsOptions = {
  origin: [`http://localhost:${process.env['PORT']}`, "https://192.168.68.24:${process.env['PORT']}"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Require method for a syncing database
const { syncDb } = require("./models");

// SyncDb - take true or false for when altering the database or not
syncDb({alter: false}).then(() => {
  console.log('Database Synchronized!')
})

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Require and start all routes
require('./routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

const credentials = {
  key: fs.readFileSync(path.join(__dirname, 'ssl_certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname,'ssl_certs',  'cert.pem')),
  allowHTTP1: true
}

// Create a secure server
// const server = http2.createSecureServer(credentials, app);
const server = spdy.createServer(credentials, app);

// app listen port
server.listen(PORT, ()=> {
  console.log(`Server is listening on port https://localhost:${PORT}`);
  }
);
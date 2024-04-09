const express = require("express");
const http2 = require("http2");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const app = express();

app.use(cookieParser())

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

let corsOptions = {
  origin: "http://localhost:${process.env.PORT}"
};

const db = require("./models");

//SyncDb
db.syncDb(false).then(() => {
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
const PORT = process.env.PORT || 3000;

const credentials = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
  allowHTTP1: true
}
// app listen port
const server = http2.createSecureServer(credentials, app);

server.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}.`);
  }
);
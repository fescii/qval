const express = require("express");
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


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Require and start all routes
require('./routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 3000;

// app listen port
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
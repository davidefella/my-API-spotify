require("dotenv").config(); // for reading environment variables from .env file

const { authorize, callback } = require("./server/auth");
const { topArtists } = require("./server/spotify-endpoints");
const logger = require("./utils/logger");

const express = require("express");
const cookieParser = require("cookie-parser");

//Express initialization
let app = express();

//Middlewares
app.use(express.static(__dirname + "/public")).use(cookieParser());

// Routes setup
app.get("/login", function (req, res) {
  logger.http('/login');

  authorize(res);
});

app.get("/callback", function (req, res) {
  logger.http('/callback');

  callback(req, res);
});

app.get("/topartists", function (req, res) {
  logger.http('/topartists');

  topArtists(req, res, "long_term", 3);
});

logger.info('Listening on 8888');
app.listen(8888);

// https://github.com/Kickblip/spotify-auth-code-example
require("dotenv").config();

const { authorize, callback } = require("./server/auth");
const { topArtists } = require("./server/spotify-endpoints");
const logger = require("./utils/logger");

const express = require("express");
const cookieParser = require("cookie-parser");


let app = express();

app.use(express.static(__dirname + "/public")).use(cookieParser());

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

  topArtists(req, res, "short_term", 3);
});

logger.info('Listening on 8888');
app.listen(8888);

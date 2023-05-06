// https://github.com/Kickblip/spotify-auth-code-example
require("dotenv").config();

const { authorize, callback } = require("./server/auth");
const { topArtists } = require("./server/spotify-endpoints");

const express = require("express");
const cookieParser = require("cookie-parser");

let app = express();

app.use(express.static(__dirname + "/public")).use(cookieParser());

app.get("/login", function (req, res) {
  authorize(res);
});

app.get("/callback", function (req, res) {
  callback(req, res);
});

app.get("/topartists", function (req, res) {
  topArtists(req, res, "medium_term", 3);
});

console.log("Listening on 8888");
app.listen(8888);

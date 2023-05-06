// https://github.com/Kickblip/spotify-auth-code-example
require("dotenv").config();

const { authorize, callback } = require("./server/auth");

const express = require("express");

const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const { COOKIE_AUTH_TOKEN } = require("./utils/constants");

let app = express();

app.use(express.static(__dirname + "/public")).use(cookieParser());

app.get("/login", function (req, res) {
  authorize(res);
});

app.get("/callback", function (req, res) {
  callback(req, res);
});

app.get("/topartists", function (req, res) {
  let access_token = req.cookies ? req.cookies[COOKIE_AUTH_TOKEN] : null;

  console.log("Access token: " + access_token);

  if (access_token === null) {
    const query = querystring.stringify({ request_error: "state_mismatch" });

    res.redirect("/error?" + query);
  } else {
    axios({
      url: "https://api.spotify.com/v1/me/top/artists",
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
        "Content-Type": "application/json",
      },
      params: { time_range: "short_term", limit: 3 },
    })
      .then(function (response) {
        let artists = [];

        response.data.items.forEach((element) => {
          artists.push(element.name);
        });

        res.json(artists);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

console.log("Listening on 8888");
app.listen(8888);

// https://github.com/Kickblip/spotify-auth-code-example
require("dotenv").config();

const { authorize } = require('./server/auth');


const express = require("express");

const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const client_secret_base64 = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')

let app = express();

let stateKey = "spotify_auth_state"; 
let access_token = null; 
let refresh_token = null; 

app.use(express.static(__dirname + "/public")).use(cookieParser());

app.get("/login", function (req, res) {

  authorize(res, stateKey); 
});

app.get("/callback", function (req, res) {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    const query = querystring.stringify({ request_error: "state_mismatch" });

    res.redirect("/error?" + query);
  } else {
    res.clearCookie(stateKey); 

    axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'post',
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + client_secret_base64
      }
    })
    .then(response => {
      if (response.status === 200) {
        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;
  
        res.redirect('/#' + querystring.stringify({ access_token: access_token, refresh_token: refresh_token }));

      } else {
        console.log("Errore gestione status");
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
});

app.get("/topartists", function (req, res) {
  console.log("Access token: " + access_token); 

  if (access_token === null) {
    const query = querystring.stringify({ request_error: "state_mismatch" });

    res.redirect("/error?" + query);
  } else {

    axios({
      url: 'https://api.spotify.com/v1/me/top/artists',
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json'},
      params: {'time_range': 'short_term', 'limit': 3}
    })
    .then(function (response) {
      let artists = []; 

      response.data.items.forEach(element => {
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

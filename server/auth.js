const querystring = require("querystring");
const axios = require("axios");

const { generateRandomString } = require('../utils/state-generator');
const { COOKIE_SPOTIFY_AUTH_STATE, COOKIE_AUTH_TOKEN, COOKIE_REFRESH_TOKEN } = require('../utils/constants');

const client_secret_base64 = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'); 

function authorize(res){

    for (const cookie in res.cookies) {
        res.clearCookie(cookie);
      }

    let spotifyAuthState = generateRandomString(16);

    res.cookie(COOKIE_SPOTIFY_AUTH_STATE, spotifyAuthState);

    const scope = "user-read-private user-read-email user-top-read";

    res.redirect(
    "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: spotifyAuthState,
        })
    );
}

function callback(req, res ){
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[COOKIE_SPOTIFY_AUTH_STATE] : null;
    
    if (state === null || state !== storedState) {
      const query = querystring.stringify({ request_error: "state_mismatch" });
  
      res.redirect("/error?" + query);
    } else {
      res.clearCookie(COOKIE_SPOTIFY_AUTH_STATE); 
  
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
          res.cookie(COOKIE_AUTH_TOKEN, response.data.access_token);
          res.cookie(COOKIE_REFRESH_TOKEN, response.data.refresh_token);
    
          res.redirect('/#' + querystring.stringify({ access_token: response.data.access_token, refresh_token: response.data.refresh_token }));
  
        } else {
          console.log("Errore gestione status");
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
}

module.exports = { authorize, callback };

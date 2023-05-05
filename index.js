// https://github.com/Kickblip/spotify-auth-code-example
require("dotenv").config();

const express = require("express");

/* querystring può essere sostituito utilizzando il metodo encodeURIComponent, ad esempio 
* 'access_token=' + encodeURIComponent(access_token) + '&refresh_token=' + encodeURIComponent(refresh_token);
*
* L'encoding mi serve se nella mia URL ho caratteri che possono crearmi problemi come &
*/
const querystring = require("querystring");
const cors = require("cors");
const cookieParser = require("cookie-parser");

let app = express();
let stateKey = "spotify_auth_state"; // name of the cookie





/** Il cookie mi serve perchè devo memorizzare il mio state (random string) */
app.use(express.static(__dirname + "/public")).use(cookieParser());

app.get("/login", function (req, res) {

  console.log("***** ENV DATA *****");
  console.log(process.env.CLIENT_ID); 
  console.log(process.env.CLIENT_SECRET); 
  console.log(process.env.REDIRECT_URI);

  let state = generateRandomString(16);

  res.cookie(stateKey, state); // set cookie to travel with request

  const scope = "user-read-private user-read-email user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: state,
      })
  );
 });

app.get("/callback", function (req, res) {
  console.log("Ciao");

  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  console.log("code: " + code);
  console.log("state: " + state);

  // TODO: Implementare un meccanismo di gestione dell'errore
  if (state === null || state !== storedState) {
    const query = querystring.stringify({ request_error: "state_mismatch" });

    res.redirect("/error?" + query);
  } else {
    //Resetto il cookie per il prossimo giro
    res.clearCookie(stateKey); // eat (clear) cookie

    const authOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")},
        body: `code=${code}&redirect_uri=${process.env.REDIRECT_URI}&grant_type=authorization_code`,
        json: true,
    };

    fetch("https://accounts.spotify.com/api/token", authOptions).then(
      (response) => {
        response.json().then((data) => {
          if (response.status === 200) {
            let access_token = data.access_token;
            let refresh_token = data.refresh_token;

            res.redirect('/#' +
            querystring.stringify({access_token: access_token, refresh_token: refresh_token}));

            console.log(access_token);
            console.log(refresh_token);
          } else {
            console.log("Errore gestione status");
          }
})
        .catch(error => {
            console.error(error);
        });;
      }
    );
  }
});

// AUX methods
function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

console.log("Listening on 8888");
app.listen(8888);

const querystring = require("querystring");

const { generateRandomString } = require('../utils/state-generator');

function authorize(res, stateKey){
    let spotifyAuthState = generateRandomString(16);

    res.cookie(stateKey, spotifyAuthState);

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

module.exports = { authorize };

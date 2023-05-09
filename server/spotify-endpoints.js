const axios = require("axios");
const querystring = require("querystring");

const { COOKIE_AUTH_TOKEN } = require('../utils/constants');
const logger = require("../utils/logger");

function topArtists(req, res, search_time_range, search_limit) {
  let access_token = req.cookies ? req.cookies[COOKIE_AUTH_TOKEN] : null;

  logger.debug(`topArtists, access_token: ${access_token}`); 

  if (access_token === null) {
    logger.error(`Error in callback - access_token: ${access_token}`); 
  
    res.redirect("/error?" + querystring.stringify({ request_error: "null access token" }));

  } else {
    axios({
      url: "https://api.spotify.com/v1/me/top/artists",
      method: "GET",
      headers: {Authorization: "Bearer " + access_token, "Content-Type": "application/json",},
      params: { time_range: search_time_range, limit: search_limit },
    })
    .then(function (response) {
      let artists = [];

      response.data.items.forEach((element) => {
        artists.push(element.name);
      });

      res.json(artists);

      logger.debug(`artists: ${artists}`); 

    })
    .catch(function (error) {
        logger.error(`Error token request: ${error}`); 

        res.redirect("/error?" + querystring.stringify({ request_error: "error" }));
    });
  }
}

module.exports = { topArtists };
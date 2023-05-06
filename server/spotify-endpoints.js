const axios = require("axios");

const { COOKIE_AUTH_TOKEN } = require('../utils/constants');

function topArtists(req, res, search_time_range, search_limit) {
  let access_token = req.cookies ? req.cookies[COOKIE_AUTH_TOKEN] : null;

  console.log("Access token: " + access_token);

  if (access_token === null) {
    const query = querystring.stringify({ request_error: "state_mismatch" });

    res.redirect("/error?" + query);
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
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

module.exports = { topArtists };
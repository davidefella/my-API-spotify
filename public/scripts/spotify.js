function getHashParams() {
  let hashParams = {};
  let e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

let params = getHashParams();

let access_token = params.access_token;
let refresh_token = params.refresh_token;
let error = params.error;

if (error) {
  alert("There was an error during the authentication");
} else {

  fetch("/topartists", {})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let artists = data.map(function (artist) {
        return artist;
      });

      let artistsList = document.createElement("ul");
      artistsList.classList.add("list-unstyled");

      artists.forEach(function (artist) {
        let artistItem = document.createElement("li");
        artistItem.appendChild(document.createTextNode(artist));
        artistsList.appendChild(artistItem);
      });

      document.getElementById("topArtists").appendChild(artistsList);
    })
    .catch(function (error) {
      console.log(error);
    });
}

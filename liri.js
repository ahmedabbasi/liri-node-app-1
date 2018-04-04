require("dotenv").config();
var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var client = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
});

var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

var arg = process.argv.slice(2);

if (arg[0] === "my-tweets") {
  var params = {
    screen_name: "oscar_bootcamp"
  };

  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log(tweets);
    } else {
      console.log(error);
    }
  });
}

if (arg[0] === "spotify-this-song") {
  var song = arg.slice(1);
  spotify.search({ type: "track", query: "All the Small Things" }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    console.log(data);
  });
}

if (arg[0] === "movie-this") {
  var song = arg.slice(1);
  console.log("omdb it");
}

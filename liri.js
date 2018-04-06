require("dotenv").config();

//  Set up the dependencies
var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//  Set up the keys
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

//  Set up the input
var arg = process.argv.slice(2);

//  Process the input
function getCommand(arg) {
  if (arg[0] === "my-tweets") {
    getTweets();
  } else if (arg[0] === "spotify-this-song") {
    var songArray = arg.slice(1);
    var song = songArray.join(" ");
    if (!song) {
      song = "the sign";
    }
    spotifySong(song);
  } else if (arg[0] === "movie-this") {
    var movieArray = arg.slice(1);
    var movie = movieArray.join("+");
    if (!movie) {
      movie = "Mr. Nobody";
    }
    findMovie(movie);
  } else if (arg[0] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        console.log(error);
      }
      var dataArr = data.split(",");
      getCommand(dataArr);
    });
  } else {
    console.log("I have no clue what you just said...");
  }
}

//  Get Tweets?
function getTweets() {
  var params = {
    screen_name: "oscar_bootcamp"
  };

  client.get("statuses/user_timeline", { count: 20 }, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log("========================");
      console.log("These are the last 20 tweets!.");
      console.log("========================");
      for (var i = 0; i < tweets.length; i++) {
        console.log("------------------------");
        console.log(
          tweets[i].user.name + " created this tweet on " + tweets[i].created_at
        );
        console.log("Tweet: " + tweets[i].text);
      }
      console.log("------------------------");
      console.log("========================");
      console.log("These are the last 20 tweets!.");
      console.log("========================");
    } else {
      console.log("Error occurred: " + error);
    }
  });
}

//  Must be to find a song in spotify...
function spotifySong(song) {
  var previewUrl = "https://open.spotify.com/embed/track/";
  spotify.search({ type: "track", limit: 20, query: song }, function(
    err,
    data
  ) {
    if (err) {
      console.log("Error occurred: " + err);
    }
    var result = data.tracks.items;
    result.forEach(function(element) {
      console.log("=============");
      console.log("Artist Name: " + element.artists[0].name);
      console.log("Song Name: " + element.name);
      console.log("Album: " + element.album.name);
      console.log("Release Date: " + element.album.release_date);
      console.log("Preview URL: " + previewUrl + element.id);
    });
    console.log("=============");
  });
}

//  Only finds one movie... not sure if I could make it find more than one of the same name yet
function findMovie(movie) {
  request(
    "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy",
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var result = JSON.parse(body);
        var ratings = result.Ratings;
        var rtRating = "not rated";
        for (var key in ratings) {
          var obj = ratings[key];
          if (obj.Source === "Rotten Tomatoes") {
            rtRating = obj.Value;
          }
        }
        console.log("=============");
        console.log("Title: " + result.Title);
        console.log("Year: " + result.Year);
        console.log("IMDB Rating: " + result.imdbRating);
        console.log("Rotten Tomatoes Rating: " + rtRating);
        console.log("Country(s): " + result.Country);
        console.log("Language(s): " + result.Language);
        console.log("Plot: " + result.Plot);
        console.log("Actors: " + result.Actors);
        console.log("=============");
      }
    }
  );
}

//  Start the show
getCommand(arg);

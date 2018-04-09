require("dotenv").config();

//  Set up the dependencies
var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var separatorThick = "========================" + "\n";
var separatorThin = "------------------------" + "\n";


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

      var userResponse = [];

      userResponse.push(separatorThick);
      for (var i = 0; i < tweets.length; i++) {
        var nameLine = tweets[i].user.name + " created this tweet on " + tweets[i].created_at + "\n";
        var tweetLine = "Tweet: " + tweets[i].text + "\n";

        userResponse.push(separatorThin);
        userResponse.push(nameLine);
        userResponse.push(tweetLine);
        userResponse.push(separatorThin);
      }
      userResponse.push(separatorThick);

      appendLog(userResponse);
      console.log(userResponse);

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
      var userResponse = [];

      var artistLine = "Artist Name: " + element.artists[0].name + "\n";
      var songLine = "Song Name: " + element.name + "\n";
      var albumLine = "Album: " + element.album.name + "\n";
      var releaseLine = "Release Date: " + element.album.release_date + "\n";
      var previewLine = "Preview URL: " + previewUrl + element.id + "\n";

      userResponse.push(separatorThick);
      userResponse.push(artistLine);
      userResponse.push(songLine);
      userResponse.push(albumLine);
      userResponse.push(releaseLine);
      userResponse.push(previewLine);
      userResponse.push(separatorThick);

      appendLog(userResponse);
      console.log(userResponse);

    });
  });
}

//  Only finds one movie... not sure if I could make it find more than one of the same name yet
function findMovie(movie) {
  request(
    "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy",
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var userResponse = [];
        var result = JSON.parse(body);
        var ratings = result.Ratings;
        var rtRating = "not rated";
        var titleLine = "Title: " + result.Title;
        var yearLine = "Year: " + result.Year;
        var imdbLine = "IMDB Rating: " + result.imdbRating;
        var rottenRating = "Rotten Tomatoes Rating: " + rtRating;
        var countryLine = "Country(s): " + result.Country;
        var languageLine = "Language(s): " + result.Language;
        var plotLine = "Plot: " + result.Plot;
        var actorLine = "Actors: " + result.Actors;
        for (var key in ratings) {
          var obj = ratings[key];
          if (obj.Source === "Rotten Tomatoes") {
            rtRating = obj.Value;
          }
        }

        userResponse.push(separatorThick);
        userResponse.push(titleLine);
        userResponse.push(yearLine);
        userResponse.push(imdbLine);
        userResponse.push(rottenRating);
        userResponse.push(countryLine);
        userResponse.push(languageLine);
        userResponse.push(plotLine);
        userResponse.push(actorLine);
        userResponse.push(separatorThick);

        for (var i = 0; i<userResponse.length; i++){
          appendLog(userResponse[i])
          console.log(userResponse[i]);

        }
      }
    });
}


function appendLog(response){
  fs.appendFile("log.txt", response + "\n" , function(err) {
    if (err) {
      return console.log(err);
    }
  });
}

//  Start the show
getCommand(arg);


 // have to clean up something.. there are commas and there are \n's on each line
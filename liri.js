require("dotenv").config();
var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

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

  client.get("statuses/user_timeline", {count: 20}, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log("========================");
      console.log("These are the last 20 tweets!.");
      console.log("========================");
      for (var i = 0 ; i < tweets.length; i++){
        console.log("------------------------");
        console.log(tweets[i].user.name + " created this tweet on " + tweets[i].created_at);
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

if (arg[0] === "spotify-this-song") {
  var songArray = arg.slice(1);
  var song = songArray.join(" ");
  var previewUrl = "https://open.spotify.com/embed/track/";
  if (!song){
    song = "the sign";
  }
  spotify.search({ type: "track", limit: 20, query: song }, function(
    err,
    data
  ) {
    if (err) {
      console.log("Error occurred: " + err);
    }
    var result = data.tracks.items;
    result.forEach(function(element){
      console.log("=============");
      console.log("Artist Name: " + element.artists[0].name);
      console.log("Song Name: " + element.name);
      console.log("Album: " + element.album.name);
      console.log("Release Date: " + element.album.release_date);
      console.log("Preview URL: " + previewUrl + element.id);
      
    })
    console.log("=============");
  });
}

if (arg[0] === "movie-this") {
  var movieArray = arg.slice(1);
  var movie = movieArray.join("+");
  request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
  if (!error && response.statusCode === 200) {
    //console.log(JSON.parse(body));
    var result = JSON.parse(body);
    var ratings = result.Ratings[0];
    var rtRating = ratings.filter(function(obj){
      return obj.Source == "Rotten Tomatoes";
    });
    console.log(result.Title);
    console.log(result.Year);
    console.log(result.imdbRating);
    console.log(rtRating);
    console.log(result.Country);
    console.log(result.Language);
    console.log(result.Plot);
    console.log(result.Actors);
    
  }
});
}

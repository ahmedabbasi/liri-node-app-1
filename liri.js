require("dotenv").config();
var keys = require("./keys");


var spotifyId = keys.spotify.id;
var spotifySecret = keys.spotify.secret;

var twitterKey = keys.twitter.consumer_key;
var twitterSecret = keys.twitter.consumer_secret;
var twitterAccKey = keys.twitter.access_token_key;
var twitterAccSecret = keys.twitter.access_token_secret;

var arg = process.argv.slice(2);

if(arg[0] === "my-tweets"){
    //show my tweets
    console.log("use twitter");
}

if(arg[0] === "spotify-this-song"){
    var song = arg.slice(1);
    //spotify song
    console.log("spotify");
}

if(arg[0] ==="movie-this"){
    var song = arg.slice(1);
    console.log("omdb it");
}
require("dotenv").config();

//  Set up the dependencies
var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var separatorThick = "========================";
var separatorThin = "------------------------";


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
        console.log("I have no clue what you just said... please try again.");
    }
}

//  Get Tweets?
function getTweets() {

    client.get("statuses/user_timeline", { count: 20 }, function(
        error,
        tweets
    ) {
        if (!error) {

            var userResponse = [];

            userResponse.push("!!!!!!!!!!!!Tweets!!!!!!!!!!!!");
            userResponse.push(separatorThick);
            for (var i = 0; i < tweets.length; i++) {
                var nameLine = tweets[i].user.name + " created this tweet on " + tweets[i].created_at;
                var tweetLine = "Tweet: " + tweets[i].text;

                userResponse.push(separatorThin);
                userResponse.push(nameLine);
                userResponse.push(tweetLine);
                userResponse.push(separatorThin);
            }
            userResponse.push(separatorThick);

            appendLog(userResponse);
            console.log(userResponse.join("\n"));

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

        var userResponse = [];
        userResponse.push("!!!!!!!!!!!!Songs!!!!!!!!!!!!");
        userResponse.push(separatorThick);

        result.forEach(function(element) {
            var artistLine = "Artist Name: " + element.artists[0].name;
            var songLine = "Song Name: " + element.name;
            var albumLine = "Album: " + element.album.name;
            var releaseLine = "Release Date: " + element.album.release_date;
            var previewLine = "Preview URL: " + previewUrl + element.id;

            userResponse.push(separatorThin);
            userResponse.push(artistLine);
            userResponse.push(songLine);
            userResponse.push(albumLine);
            userResponse.push(releaseLine);
            userResponse.push(previewLine);

        });
        appendLog(userResponse);
        console.log(userResponse.join("\n"));
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

                userResponse.push("!!!!!!!!!!!!Movie!!!!!!!!!!!!");
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

                appendLog(userResponse);
                console.log(userResponse.join("\n"));
            }
        });
}


function appendLog(response){
    var logText = response.join("\n");
    fs.appendFile("log.txt", logText, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

//  Start the show
getCommand(arg);

// spotify this song is doing something weird where it logs everything multiple times... the loop is probably in the wrong spot 
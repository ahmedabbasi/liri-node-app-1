Assignment: 

In this assignment, you will make LIRI. LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

Set up:

- Clone this repo
- run npm install
- make a .env file and set it up to look like the following:

# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

# Twitter API keys

TWITTER_CONSUMER_KEY=your-twitter-consumer-key

TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret

TWITTER_ACCESS_TOKEN_KEY=your-access-token-key

TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

* Note: do not use quotation marks around ids, keys, or secrets

This should set up the app to work.

Commands: 

****all of these commands will log/append the results in the log.txt file within this folder as well as display the results on screen****

=====================================================================

"node liri mytweets"


- "node liri mytweets" will return your last 20 tweets

---------------------------------------------------------------------

"node liri spotify-this-song [song name]"


- "node liri spotify-this-song [song name]" will return up to 20 songs that match your query.  If a query is not provided, it will default the search to The Sign.

---------------------------------------------------------------------

"node liri movie-this [movie name]"

"node liri movie-this [movie name]" will return a movie matching the query provided.  If a query is not provided, it will default search to Mr. Nobody which could be a good movie, but not as good as True Romance.

---------------------------------------------------------------------

"node do-what-it-says"

"node do-what-it-says" will take one command that is on the random.txt file and execute it.

---------------------------------------------------------------------




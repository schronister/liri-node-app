var request = require("request");
var Twitter = require("twitter");
var spotify = require("spotify");
var fs = require("fs");
var keys = require("./keys.js");


//saving the twitter authentication info:
var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

//get the command line arguments
var argArray = []
for (var i = 2; i < process.argv.length; i++){
	argArray.push(process.argv[i]);
};

//wrap the whole program in this function so it can be recursively called if needed.
function processArgs(argArray){
    //switch statement for the first argument to determine command
    switch (argArray[0]){
        case "my-tweets":
                showTweets();
            break;
        case "spotify-this-song":
            spotifySong(argArray);
            break;
        case "movie-this":
            movieSearch(argArray);
            break;
        case "do-what-it-says":
                fs.readFile("./random.txt","utf8",function(err,data){
                    var commands = data.split(",");
                    processArgs(commands);
                })
            break;
        default:
            console.log("Hmm... I don't recognize that command. Please try again!")
            break;
    }
}


//function to show tweets
function showTweets(){
    client.get('statuses/user_timeline', {screen_name: 'elonmusk'}, function(error, tweets, response) {
        if (!error){
            console.log("\nHere are the most recent tweets from Elon Musk:\n")
            for (var i = 0; i < tweets.length; i++){
                console.log(tweets[i].text + "\n");
            }
       
        }
    });
}

//function for spotify search
function spotifySong(argArray){
    if (argArray.length < 2){
        //default case
        spotify.lookup({type: "track", id: "0hrBpAOgrt8RXigk83LLNE"}, function(err, data){
            if (err){
                console.log(err);
            } else{
                console.log("Artist: " + data.artists[0].name);
                console.log("Song title: " + data.name);
                console.log("Album: " + data.album.name);
                console.log("Preview link: " + data.preview_url);
            }
        })
    } else{
        //get the song query out of the second arg
        argArray.splice(0,1);
        var song = argArray.join(" ");
        spotify.search({type: "track", query: song}, function(err, data){
            if (err){
                console.log(err);
            } else{
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song title: " + data.tracks.items[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("Preview link: " + data.tracks.items[0].preview_url);

            }
        })
    }
}

//function to search movies
function movieSearch(argArray){
    if (argArray.length < 2){
        //omdb api request
        request('http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&r=json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //convert to JSON
                body = JSON.parse(body);
                console.log("Title: "+body.Title);
                console.log("Released: "+body.Year);
                console.log("IMDB Rating: "+body.imdbRating);
                console.log("Country: "+body.Country);
                console.log("Language: "+body.Language);
                console.log("Plot: "+body.Plot);
                console.log("Actors: "+body.Actors);
                console.log("Rotten Tomatoes Rating: "+body.tomatoRating);
                console.log("Rotten Tomatoes URL: "+body.tomatoURL);
            }
        })
    } else{
        //get the title out of the args
        argArray.splice(0,1);
        var title = argArray.join(" ");
        //ombd request
        request('http://www.omdbapi.com/?t='+title+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                console.log("Title: "+body.Title);
                console.log("Released: "+body.Year);
                console.log("IMDB Rating: "+body.imdbRating);
                console.log("Country: "+body.Country);
                console.log("Language: "+body.Language);
                console.log("Plot: "+body.Plot);
                console.log("Actors: "+body.Actors);
                console.log("Rotten Tomatoes Rating: "+body.tomatoRating);
                console.log("Rotten Tomatoes URL: "+body.tomatoURL);
            }
        })
    }
}

//run the program
processArgs(argArray);
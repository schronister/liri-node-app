var request = require("request");
var twitter = require("twitter");
var spotify = require("spotify");
var keys = require("./keys.js");

//saving the twitter authentication info:
var client = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

//get the command line arguments
var argArray = []
for (var i = 2; i < process.argv.length; i++){
	argArray.push(process.argv[i]);
};

//switch statement for the first argument
switch (argArray[0]){
	case "my-tweets":
		client.get('statuses/user_timeline', {screen_name: 'chr0nes'}, function(error, tweets, response) {
		   	if (!error){
		   	console.log(tweets);		   
			}
		});
		break;
	case "spotify-this-song":

		break;
	case "movie-this":

		break;
	case "do-what-it-says":

		break;
}

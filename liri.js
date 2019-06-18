require("dotenv").config();

/*
    Packages
*/
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api")
/*
    Global Variables
*/

var keys = require("./keys.js")

var spotify = new Spotify(keys.spotify)

/*
    Functions
*/

/**
 * 
 * @param {Array} unedited is the unedited process.argv list used to gather user input.
 * 
 * The function takes in the array, slices out the node-location and file-executed-location
 * and converts all inputted numbers into floats, then returns the final array.
 * 
 * The purpose of the function is to easily parse through the process.argv to use user inputs.
 */
function convertProcess(unedited) { 
    var args = unedited.slice(2); 
    for (var i = 0; i < args.length; i++) { 
        if (!isNaN(args[i])) { 
            args[i] = parseFloat(args[i]); 
            /*console.log(args[i])*/ 
        }
    }; 
    return args; 
}


/**
 * 
 * @param {String} artist is the artist or bad the user inputs.
 * 
 */
function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then((response) => {
        
        console.log("Venues: \n\n");
        for (resp of response.data) {
            var theLocation = "";
            var theVenue = resp.venue.name;
            var theDate = moment(resp.datetime).format("LLLL");

            //If one of these exist, add it to the location string
            resp.venue.region ? theLocation += `Region: ${resp.venue.region}` : null
            resp.venue.country ? theLocation += `Country: ${resp.venue.country}` : null
            resp.venue.region ? theLocation += `City: ${resp.venue.city}` : null
            
            console.log(`Venue: ${theVenue}`)
            console.log(`Location: ${theLocation}`)
            console.log(`Date: ${theDate}`)
            console.log();//Spacer
        }
    })
}

/*
    Usage: node liri.js spotify-this-song '<song name here>'
    
    Return:
        Artist(s)
        The Song's Name
        A preview link of the song from Spotify
        The Album that the song is from

    
If no song is provided then your program will default to "The Sign" by Ace of Base.


You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.


The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a client id and client secret:


Step One: Visit https://developer.spotify.com/my-applications/#!/


Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.


Step Three: Once logged in, navigate to https://developer.spotify.com/my-applications/#!/applications/create to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.


Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the node-spotify-api package.
*/
function spotifyThis(song) {
    song ? null : song = "The Sign" //"The Sign" by Ace of Base
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) console.log(err);
        console.log();
        
        for (var i = 0; i < data.tracks.items.length; i++) {
            var name = data.tracks.items[i].name
            var preview = data.tracks.items[i].preview_url;
            var album = data.tracks.items[i].album.name;
            //If any of these exist, add it to the response;
            var resp = "";
            name ? resp+=`Song: ${name}\n`:null;
            album ? resp+=`Album: ${album}\n`:null;
            preview ? resp+=`Link: ${preview}\n`:null;
            console.log(resp,"\n");
            
        }
    });
}


/*
    Usage: node liri.js movie-this '<movie name here>'
    
    Return:
        * Title of the movie.
        * Year the movie came out.
        * IMDB Rating of the movie.
        * Rotten Tomatoes Rating of the movie.
        * Country where the movie was produced.
        * Language of the movie.
        * Plot of the movie.
        * Actors in the movie.
     
        
If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'


If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/


It's on Netflix!




You'll use the axios package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.

*/
function movieThis() {

}


/*
    Usage: node liri.js do-what-it-says
    
    Return:
        Artist(s)
        The Song's Name
        A preview link of the song from Spotify
        The Album that the song is from

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.


It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.


Edit the text in random.txt to test out the feature for movie-this and concert-this.
*/
function dwis() {

}

var args = convertProcess(process.argv);
if (!args[0]) return console.log("You need to specify an action!");



switch(args[0]) {

    case "concert-this":
        if (!args[1]) return console.log("You need to specify a band!");
        else concertThis(args.slice(1, args.length).join(" "))
    break;

    case "spotify-this-song":
        //if no args => default to 'The Sign'
        spotifyThis(args.slice(1, args.length).join(" "))
    break;

    case "movie-this": 
        movieThis()
    break;

    case "do-what-it-says":
        dwis()
    break;

    default: console.log("Could not understand the action.");
    
}
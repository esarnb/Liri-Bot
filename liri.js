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
            console.log();//Spacer
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

function spotifyThis(song) {
    song ? null : song = "The Sign" //"The Sign" by Ace of Base
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) console.log(err);
        console.log();//Spacer
        for (var i = 0; i < data.tracks.items.length; i++) {
            var name = data.tracks.items[i].name
            var album = data.tracks.items[i].album.name;
            var preview = data.tracks.items[i].preview_url;
            var artists = data.tracks.items[i].album.artists
            //If any of these exist, add it to the response;
            var resp = "";
            name ? resp+=`Song: ${name}\n`:null;
            artists ? resp += `Artist(s): ${artists}`:null;
            album ? resp+=`Album: ${album}\n`:null;
            preview ? resp+=`Link: ${preview}\n`:null;
            console.log(resp,"\n");
        }
    });
}

function movieThis(title) {
    title ? null : title = "Mr. Nobody" //If no title, use "Mr. Nobody"
    var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    axios.get(queryURL).then(function(response) {
        var resp = "";
        console.log(queryURL);
        
        var plot = response.data.Plot;
        var title = response.data.Title;
        var actors = response.data.Actors;
        var country = response.data.Country;
        var language = response.data.Language;
        var released = response.data.Released;
        var imdbRating = response.data.imdbRating
        var rating = response.data.Ratings.find(obj => obj.Source === "Rotten Tomatoes").Value;

        //Conditionals to check for validity on each property asked for; concat all available info.
        title ? resp+= `Title: ${title}\n` : null;
        released ? resp+= `Released: ${released}\n` : null;
        imdbRating ? resp+= `IMDB Rating: ${imdbRating}\n` : null;
        rating ? resp+= `Rotten Tomato Rating: ${rating}\n` : null;
        country ? resp+= `Country: ${country}\n` : null;
        language ? resp+= `Language: ${language}\n` : null;
        actors ? resp+= `Actors: ${actors}\n` : null;
        plot ? resp+= `\nPlot: ${plot}\n` : null;
        console.log();//Spacer        
        console.log(resp);
    })
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

// console.clear(); //Clears console for better readability

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
        //if no args => default to "Mr.Nobody"
        movieThis(args.slice(1, args.length).join(" "))
    break;

    case "do-what-it-says":
        dwis()
    break;

    default: console.log("Could not understand the action.");
    
}
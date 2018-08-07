//ajax call of the youtube channel 
var muscleGroup = ['Shoulder', 'Bicep', 'Tricep', 'Forearms', 'Abs', 'Back muscles', 'Chest muscles', 'Leg muscles', 'Hamstrings', 'Quadriceps', 'Trapezius',]
var player;
function onYouTubeIframeAPIReady(idOfVideo) {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: `${idOfVideo}`,

    });
}

// findVideoByTitleContent :: ([video], String) -> video || null
function findVideoByTitleContent(videos, userSelectedVideoTitle) {
    if(videos != null) {
        let foundVideos = videos.filter(video => video.snippet.title.toLowerCase().indexOf(userSelectedVideoTitle.toLowerCase()) > -1);
        if(foundVideos !== []) {
            return foundVideos[0];
        } else {
            return null;
        }
    } else {
        return null;
    }
}


function displayMovieInfo() {

    var userSelectedVideoTitle = $(this).attr("data-name");
    var URL =
        'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCAWTgwekE8oAGTZP2mxpGnho9lCz-zUs0&part=snippet,id&order=date&maxResults=20&q=' + encodeURI(userSelectedVideoTitle);

    $.ajax({
        url: URL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        let video = findVideoByTitleContent(response.items, userSelectedVideoTitle);
        if(video != null) {
            // Creating a div to hold the movie
            var movieDiv = $("<div class='movie-view'>");

            // Retrieving the URL for the image
            var imgURL = video.snippet.thumbnails.default.url;

            var vidID = video.id.videoId
            console.log(vidID);

            player.loadVideoById(vidID);
            // Creating an element to hold the image
            var image = $("<img>").attr("src", imgURL);
    
            // Appending the image
            movieDiv.append(image);
    
            // Putting the entire movie above the previous movies
            $("#movies-view").prepend(movieDiv);    
        } else {
            console.log("video selected: " + userSelectedVideoTitle + " was not found");
        }
    });
};

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);




// Function for displaying movie data
function renderButtons(userInput) {



    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < muscleGroup.length; i++) {

        // Then dynamicaly generating buttons for each movie in the array
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class of movie-btn to our button
        a.addClass("movie-btn");
        // Adding a data-attribute
        a.attr("data-name", muscleGroup[i]);
        // Providing the initial button text
        a.text(muscleGroup[i]);
        // Adding the button to the buttons-view div
        $("#buttons-view").append(a);
    }
}
// This function handles events where a movie button is clicked
$("#add-movie").on("click", function (event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var muscleGroup = $("#movie-input").val().trim();

    // Adding movie from the textbox to our array
    movies.push(muscleGroup);

    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
});

// Adding a click event listener to all elements with a class of "movie-btn"
$(document).on("click", ".movie-btn", displayMovieInfo);

// Calling the renderButtons function to display the intial buttons
renderButtons();
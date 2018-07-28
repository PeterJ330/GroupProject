

function nutritionInfo() {
    var searchItem = "cheese";
    var limit = 10;
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL =  "https://api.nal.usda.gov/ndb/search/?format=json&q=" + searchItem + "&sort=n&max=" + limit + "&offset=0&api_key=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // Printing the entire object to console
        console.log(queryURL);
        console.log(response);
        
        $("#JSON").text(JSON.stringify(response));

        // Constructing HTML containing the nutrion info 


    });
}

nutritionInfo();
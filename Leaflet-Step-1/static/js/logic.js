// Create variable for API endpoint
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the set URL
d3.json(queryURL, function(data) {

    createFeatures(data.features);

});

// Define function 
function createFeatures(earthquakeData) {
    var circleArray = new Array();
    // Loop through each feature
    for (var i = 0; i < earthquakeData.length; i++) {

        console.log(earthquakeData[i])

        // Set coordinates of location of earthquakes
        coordinates = [earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]]

        // console.log(earthquakeData[i].properties.mag)
        
        // Set empty string to set color 
        var color = ""

        // Conditional statements color-coding magnitude of earthquake
        if (earthquakeData[i].properties.mag < 1) {
            color = "green";
        }
        else if (earthquakeData[i].properties.mag < 2) {
            color = "lightgreen"
        }
        else if (earthquakeData[i].properties.mag < 3) {
            color = "yellow"
        }
        else if (earthquakeData[i].properties.mag < 4) {
            color = "purple"
        }
        else if (earthquakeData[i].properties.mag < 5) {
            color = "orange"
        }
        else if (earthquakeData[i].properties.mag < 6) {
            color = "red"
        }

        // Create circle marker for coordinates
        var circle = L.circle(coordinates, {
            fillOpacity: 0.50,
            color: color,
            fillColor: color,
            radius: (earthquakeData[i].properties.mag * 10000)
        }).bindPopup("<h3>" + earthquakeData[i].properties.place + "</h3> <hr> <h3> Magnitude: " + earthquakeData[i].properties.mag + "<h3> <hr> <h3> Time: " + new Date(earthquakeData[i].properties.time) + "</h3>")

        // Push circle markers into Circle Array
        circleArray.push(circle);

    }

    // Create layer for the circle markers
    var earthquakes = L.layerGroup(circleArray)
    
    // Execute circle layer to createMap function
    createMap(earthquakes);
}

// Define Function to for map layers
function createMap(earthquakes) {

    // Define Light Map
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Define Street Map
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    // Define baseMaps to hold base layers with Light Map as default
    var baseMaps = {
        "Light Map": lightmap,
        "Street Map": streetmap
    };

    // Create overlayMaps 
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create myMap and set center coordinates and set layers
    var myMap = L.map("map", {
        center: [40.7608, -111.8910],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create layer for legend
    var legend = L.control({position: "bottomright"});

    // Define function for legend
    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "legend"),
            grades = [0, 1, 2, 3, 4, 5],
            colors = ["green", "lightgreen", "yellow", "purple", "orange", "red"]

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<li style=\"background-color: " + colors[i] + "\">" +"</li>" + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

        return div;
   
    };

    // Add legend layer to map
    legend.addTo(myMap);  
  
};
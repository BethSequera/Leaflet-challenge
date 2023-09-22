let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function (data) {
  
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }


  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });


  createMap(earthquakes);
}

function createMap(earthquakes) {

  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };


  let overlayMaps = {
    Earthquakes: earthquakes
  };


  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Define a color scale for earthquake depth.
const depthColors = ["#00FF00", "#FFFF00", "#FF0000"];

// Define depth categories and corresponding labels.
const depthLabels = ["< 10 km", "10 - 50 km", "> 50 km"];

// Create a function to generate the legend HTML.
function createLegend() {
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    div.innerHTML += "<h4>Depth Legend</h4>";

    // Loop through depth categories and create color boxes with labels.
    for (let i = 0; i < depthColors.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        depthColors[i] +
        '"></i> ' +
        depthLabels[i] +
        "<br>";
    }

    return div;
  };

  return legend;
}

// Add the legend to the map.
createLegend().addTo(myMap);
 
    
    
    
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

}
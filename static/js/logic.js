let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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

let earthquakes = new L.LayerGroup();

let overlayMaps = {
  Earthquakes: earthquakes
};

let myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 3
});
street.addTo(myMap);

L.control.layers(baseMaps, overlayMaps, {
  collapsed: true
}).addTo(myMap);

d3.json(queryUrl).then(function (data) {

  const depthColors = ["#00FF00", "#FFFF00", "#FF0000"];

  const depthLabels = ["< 10 km", "10 - 50 km", "> 50 km"];

  function getColor(feature) {
    if (depth < 10) {
      return "#00FF00"; // Green for depth < 10 km
    } else if (depth <= 50) {
      return "#FFFF00"; // Yellow for depth between 10 - 50 km
    } else {
      return "#FF0000"; // Red for depth > 50 km
    }
  }

  function getRadius(feature) {
    return magnitude * 5;
  }

  function mapStyle(feature) {
    return {
      color: "#0000ff",
      fillColor: "#ADD8E6",
      radius: 10
    };
  }

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: mapStyle,
    onEachFeature: onEachFeature
  }).addTo(earthquakes);
  
  function createLegend() {
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
      div.innerHTML += "<h4>Depth Legend</h4>";
      
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

  createLegend().addTo(myMap);


});

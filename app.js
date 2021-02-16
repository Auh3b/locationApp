L.mapquest.key = "Fyx8V6FkpICCAWMY83YKee1FRHQhXDjw";

let map = L.mapquest.map("map", {
  center: [-13.96692, 33.78725],
  layers: L.mapquest.tileLayer("map"),
  zoom: 12,
});

async function getData(data) {
  let response = await fetch(data);
  let responseData = await response.json();
  return responseData;
}

let disclaimer = L.control({ position: "bottomleft" });

disclaimer.onAdd = function (map) {
  let div = L.DomUtil.create("div", "info legend");
  div.innerHTML = `<i id="disclaimer-tag"class="fas fa-exclamation-circle"></i>
<span id="disclaimer-info" class="hide">Please note that the route might not be the most optimal however the location is</span>
  `;
  return div;
};

disclaimer.addTo(map);

document.getElementById("disclaimer-tag").addEventListener("click", () => {
  if (document.getElementById("disclaimer-info").className === "hide") {
    document.getElementById("disclaimer-info").className = "show";
  } else {
    document.getElementById("disclaimer-info").className = "hide";
  }
});

getData("testing_sites.json")
  .then((data) => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      var crd = pos.coords;
      var sLat = crd.latitude;
      var sLong = crd.longitude;
      var nearest = leafletKnn(L.geoJson(data)).nearest(
        L.latLng([sLat, sLong]),
        1
      );
      var eLat = nearest[0].lat;
      var eLong = nearest[0].lon;

      L.mapquest.directions().route(
        {
          start: [sLat, sLong],
          end: [eLat, eLong],
        },
        response
      );

      let destination = `<div id="destination">
      <i id="close" class="fas fa-window-close"></i>
      <p>Name : ${nearest[0].layer.feature.properties.NAME} ${nearest[0].layer.feature.properties.TYPE}</p>
      <p>Address: ${nearest[0].layer.feature.properties.ADDRESS}</p>
      <p>Estimated Distance: <span id="distance" ></span> KM</p>
      <p>Estimated Travel Time: <span id="time"></span></p>
      </div>`;

      document.getElementById("dest").innerHTML = destination;

      let close = document.getElementById("close");

      close.addEventListener("click", () => {
        document.getElementById("map").style.zIndex = 1;
        document.getElementById("dest").style.transform = "translateY(10px)";
      });
    }
    let travelTime, calDistance;
    function response(err, route) {
      travelTime = route.route.formattedTime;
      calDistance = route.route.distance;
      document.getElementById("time").textContent = `${travelTime}`;
      document.getElementById("distance").textContent = `${calDistance}`;

      // markers
      var redMarker = L.AwesomeMarkers.icon({
        icon: "coffee",
        markerColor: "red",
        extraClasses: "fas fa-user",
      });
      var greenMarker = L.AwesomeMarkers.icon({
        icon: "coffee",
        markerColor: "green",
        extraClasses: "fas fa-hospital-symbol",
      });

      var DirectionsLayerWithCustomMarkers = L.mapquest.DirectionsLayer.extend({
        createStartMarker: function (location, stopNumber) {
          return L.marker(location.latLng, { icon: redMarker })
            .bindPopup("Your Location")
            .openPopup();
        },

        createEndMarker: function (location, stopNumber) {
          return L.marker(location.latLng, { icon: greenMarker }).on(
            "click",
            showDetails
          );
        },
      });

      console.log(document.getElementsByTagName("i"));

      var directionsLayer = new DirectionsLayerWithCustomMarkers({
        directionsResponse: route,
      }).addTo(map);
    }

    // show
    function showDetails() {
      document.getElementById("map").style.zIndex = -1;
      document.getElementById("dest").style.transform = "translateY(-330px)";
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  })
  .catch((err) => console.log(err));

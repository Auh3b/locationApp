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

getData("testing_sites.json")
  .then((data) => {
    // var mayLayer = L.geoJSON().addTo(map);
    // mayLayer.addData(data);

    function success(pos) {
      var crd = pos.coords;
      // L.marker([crd.latitude, crd.longitude]).addTo(map);
      var sLat = crd.latitude;
      var sLong = crd.longitude;
      var nearest = leafletKnn(L.geoJson(data)).nearest(
        L.latLng([sLat, sLong]),
        1
      );
      var eLat = nearest[0].lat;
      var eLong = nearest[0].lon;
      console.log(crd, nearest);

      L.mapquest.directions().route({
        start: [sLat, sLong],
        end: [eLat, eLong],
      });
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

    // console.log(L.geoJSON(data));
    // nearest.forEach((d) => {
    //   console.log(d.layer.feature.properties.NAME);
    // });
  })
  .catch((err) => console.log(err));

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

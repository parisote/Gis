const map = L.map('map-template').setView([-34.618644,-58.4615551], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawPluginOptions = {
         draw: {
           polygon: {
             allowIntersection: false
           },
           polyline: false
         },
         edit: {
             featureGroup: drawnItems,
             remove: true,
             edit: false
         }
     };

var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);


map.on('draw:created', function(e) {
  var type = e.layerType,
  layer = e.layer;

  if(type === 'marker') {
    $("#markModal").modal("show");
    var cmplat = document.getElementById('lat').value = layer._latlng.lat;
    var cmplen = document.getElementById('lng').value = layer._latlng.lng;
  }

  if(type === 'rectangle'){
    $("#rectangleModal").modal("show");
    var point1 = document.getElementById('point_1').value = layer._latlngs[0][0].lng;
    var point2 = document.getElementById('point_2').value = layer._latlngs[0][0].lat;

    var point3 = document.getElementById('point_3').value = layer._latlngs[0][1].lng;
    var point4 = document.getElementById('point_4').value = layer._latlngs[0][1].lat;

    var point5 = document.getElementById('point_5').value = layer._latlngs[0][2].lat;
    var point6 = document.getElementById('point_6').value = layer._latlngs[0][2].lng;

    var point7 = document.getElementById('point_7').value = layer._latlngs[0][3].lat;
    var point8 = document.getElementById('point_8').value = layer._latlngs[0][3].lng;
  }

  if(type === 'polygon'){
    console.log(layer)
    console.log(layer._latlngs[0].length)
  }

  if(type === 'circle'){
    $("#circleModal").modal("show");
    var cmplat = document.getElementById('c_lat').value = layer._latlng.lat;
    var cmplen = document.getElementById('c_lng').value = layer._latlng.lng;
    var cmpradio = document.getElementById('radio').value = layer._mRadius;
  }

  drawnItems.addLayer(layer);
})

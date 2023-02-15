// console.log(campgrounds)
const map = L.map('map').setView([39, -104], 2)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const markers = L.markerClusterGroup({
  zoomToBoundsOnClick: true,
  iconCreateFunction: function (cluster) {
    // add function to add different color and size 
    let markers = cluster.getAllChildMarkers();
    let n = 0;
    for (let i = 0; i < markers.length; i++) {
      n += markers[i].__parent._childCount;
    }

    let small = n < 20;
    let medium = n < 100;
    // add className for applying different styles
    let className = small ? 'cluster small-cluster' :
      medium ? 'cluster medium-cluster' :
        'cluster large-cluster';
    // different sizes
    let size = small ? 35 : medium ? 50 : 65;
    return L.divIcon({
      html: n,
      className: className,
      iconSize: L.point(size, size)
    });
  }
});

for (let camp of campgrounds) {
  // current model coordinate structure [long, lat]
  const [long, lat] = camp.geometry.coordinates
  // leaflet follow [lat, long] structure
  const marker = L.marker([lat, long])
  marker.bindPopup(camp.popUpMarkup)
  markers.addLayer(marker)
}

map.addLayer(markers);

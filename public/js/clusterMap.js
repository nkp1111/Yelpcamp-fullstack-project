// console.log(campgrounds)
const map = L.map('map').setView([39, -104], 5)

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

    let small = n < 50;
    let medium = n < 200;
    // add className for applying different styles
    let className = small ? 'cluster small-cluster' :
      medium ? 'cluster medium-cluster' :
        'cluster large-cluster';
    // different sizes
    let size = small ? 35 : medium ? 50 : 65;
    return L.divIcon({
      html: cluster.getAllChildMarkers().length,
      className: className,
      iconSize: L.point(size, size)
    });
  }
});

for (let camp of campgrounds) {
  const coord = camp.geometry.coordinates
  const marker = L.marker(coord)
  marker.bindPopup(camp.popUpMarkup)
  markers.addLayer(marker)
}

map.addLayer(markers);

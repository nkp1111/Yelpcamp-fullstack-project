// console.log(campgrounds)
const map = L.map('map').setView([39, -104], 2)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const markers = L.markerClusterGroup();

for (let camp of campgrounds) {
  // current model coordinate structure [long, lat]
  const [long, lat] = camp.geometry.coordinates
  // leaflet follow [lat, long] structure
  const marker = L.marker([lat, long])
  marker.bindPopup(`${camp.title}`)
  markers.addLayer(marker)
}
map.addLayer(markers);

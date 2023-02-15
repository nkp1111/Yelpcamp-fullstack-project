const map = L.map('map').setView([38, -8], 7)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const markers = L.markerClusterGroup();

for (let i = 0; i < 1000; i++) {
  const marker = L.marker([
    getRandom(37, 39),
    getRandom(-9.5, -6.5)
  ])
  markers.addLayer(marker)
}
map.addLayer(markers);

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
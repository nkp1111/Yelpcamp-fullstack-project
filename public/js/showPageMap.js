// leaflet maps: https://leafletjs.com/

// console.log(campground)
// campground coordinates structure [long, lat] 
const cur_coord = campground.geometry.coordinates.reverse()
// leaflet follows [lat, long] schema for coordinates

const map = L.map('map').setView(cur_coord, 9);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker(cur_coord).addTo(map);

marker.bindPopup(`<strong>${campground.title}</strong>`).openPopup();

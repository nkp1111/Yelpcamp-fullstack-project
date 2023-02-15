// leaflet maps: https://leafletjs.com/

// console.log(campground)
const cur_coord = campground.geometry.coordinates.reverse()
// cur_coord [long, lat] 
// leaflet follows [lat, long] schema for coordinates

const map = L.map('map').setView(cur_coord, 9);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker(cur_coord).addTo(map);


const axios = require("axios")
require("dotenv").config()
const baseUrl = "https://api.unsplash.com/collections/483251?client_id="


const getImage = async () => {
  let imageUrl, description
  await axios.get(baseUrl + process.env["SPLASH_ACCESS_KEY"])
    .then(data => {
      description = data.data.description
      imageUrl = data.data.preview_photos[0].urls.regular
    })
  return { imageUrl, description }
}


module.exports = {
  getImage,
}

const axios = require("axios")
require("dotenv").config()
const baseUrl = "https://api.unsplash.com/collections/483251/photos?per_page=30&client_id="


const getImage = async () => {
  let imageUrls = []
  let descriptions = []
  await axios.get(baseUrl + process.env["SPLASH_ACCESS_KEY"])
    .then(data => {
      data.data.forEach(item => {
        descriptions.push(item.description || item.alt_description || "Good place to go")
        imageUrls.push(item.urls.regular);
      })
    })
  return { imageUrls, descriptions }
}


module.exports = {
  getImage,
}

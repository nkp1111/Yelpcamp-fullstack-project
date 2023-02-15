const mongoose = require("mongoose")
const { Campground } = require("../models/campground")
const cities = require("./cities")
require("dotenv").config()
const { places, descriptors } = require("./seedHelpers")
const { getImage } = require("./image")

// mongoose connection
mongoose.connect(process.env["MONGO_URI"])
  .then(() => {
    console.log("Mongoose connected")
  })
  .catch((err) => {
    console.log("error")
    console.log(err)
  })

// get a random item from array
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

// create 50 random starting campgrounds 
const seedDB = async () => {
  await Campground.deleteMany()
  // get random images and descriptions 
  const { imageUrls, descriptions } = await getImage()

  for (let i = 0; i < 400; i++) {
    const randomCity = sample(cities)
    const newCamp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${randomCity.city}, ${randomCity.state}`,
      description: descriptions[i % descriptions.length],
      images: [{
        url: imageUrls[i % imageUrls.length],
        filename: "."
      }],
      price: Math.floor(Math.random() * 20) + 10,
      geometry: {
        type: "Point",
        coordinates: [randomCity.longitude, randomCity.latitude]
      },
      // user id of user stored in database
      author: "63ea617c8e6734e1a379d4cd",
    })
    await newCamp.save()
  }
}

seedDB()
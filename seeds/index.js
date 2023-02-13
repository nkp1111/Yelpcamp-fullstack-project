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
  for (let i = 0; i < 50; i++) {
    const randomCity = sample(cities)
    const imageDescription = await getImage()
    const newCamp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${randomCity.city}, ${randomCity.state}`,
      description: imageDescription.description,
      image: imageDescription.imageUrl,
      price: Math.floor(Math.random() * 20) + 10,
      author: "63ea21a790684abc7fe09a06",
    })
    await newCamp.save()
  }
}

seedDB()
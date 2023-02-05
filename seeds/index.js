const mongoose = require("mongoose")
const { Campground } = require("../models/campground")
const cities = require("./cities")
require("dotenv").config()
const { places, descriptors } = require("./seedHelpers")

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
    const newCamp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${randomCity.city} ${randomCity.state}`,
    })
    await newCamp.save()
  }
}

seedDB()
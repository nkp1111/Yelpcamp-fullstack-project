const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()
const { Campground } = require("./models/campground")

// mongoose connection
mongoose.connect(process.env["MONGO_URI"])
  .then(() => {
    console.log("Mongoose connected")
  })
  .catch((err) => {
    console.log("error")
    console.log(err)
  })

// basic app configuration
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))


// app routes
app.get("/", (req, res) => {
  res.render("home")
})

// campground routes
// view all campgrounds
app.get("/campground", async (req, res) => {
  let campgrounds = await Campground.find({})
  res.render("campground/index", { campgrounds })
})

// create new campground
app.get("/campground/new", (req, res) => {
  res.render("campground/new")
})

app.post("/campground", async (req, res) => {
  const { title, location } = req.body
  console.log(title, location)
  let newCamp = Campground({
    title, location
  })
  newCamp = await newCamp.save()
  res.redirect(`/campground/${newCamp._id}`)
})

// view one campground detail
app.get("/campground/:id", async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render("campground/show", { campground })
})


app.listen("3000", () => {
  console.log("App is listening on port 3000");
})
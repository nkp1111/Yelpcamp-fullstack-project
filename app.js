const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()
const methodOverride = require("method-override")
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

// app middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))


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
  let newCamp = Campground({
    title, location
  })
  newCamp = await newCamp.save()
  res.redirect(`/campground/${newCamp._id}`)
})

// edit a campground
app.get("/campground/:id/edit", async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render("campground/edit", { campground })
})

app.put("/campground/:id", async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body })
  res.redirect(`/campground/${id}`)
})

// delete a campground
app.delete("/campground/:id", async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect("/campground")
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
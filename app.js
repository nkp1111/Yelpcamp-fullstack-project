const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
// wrapper function for async errors
const catchAsync = require("./utils/catchAsync")
// custom error class
const { ExpressError } = require("./utils/expressError")
// database models
const { Campground } = require("./models/campground")
const { Review } = require("./models/reviews")
// joi schemas for validation
const { campgroundSchema, reviewSchema } = require("./schemas")

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
app.engine("ejs", ejsMate)
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

// app middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
// custom middleware
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    let message = error.details.map(item => item.message).join(", ")
    throw new ExpressError(message, 400)
  } else {
    next()
  }
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    let message = error.details.map(item => item.message).join(", ")
    throw new ExpressError(message, 400)
  } else {
    next()
  }
}

// app routes
app.get("/", (req, res) => {
  res.render("home")
})

// campground routes
// view all campgrounds
app.get("/campground", catchAsync(async (req, res) => {
  let campgrounds = await Campground.find({})
  res.render("campground/index", { campgrounds })
}))

// create new campground
app.get("/campground/new", (req, res) => {
  res.render("campground/new")
})

app.post("/campground", validateCampground, catchAsync(async (req, res, next) => {

  let newCamp = Campground({
    ...req.body
  })
  newCamp = await newCamp.save()
  res.redirect(`/campground/${newCamp._id}`)
}))

// edit a campground
app.get("/campground/:id/edit", catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render("campground/edit", { campground })
}))

app.put("/campground/:id", validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body })
  res.redirect(`/campground/${id}`)
}))

// delete a campground
app.delete("/campground/:id", catchAsync(async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect("/campground")
}))

// view one campground detail
app.get("/campground/:id", catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id).populate("reviews")
  res.render("campground/show", { campground })
}))


// create a new review for a campground
app.post("/campground/:id/reviews", validateReview, catchAsync(async (req, res) => {
  const { id } = req.params
  const review = Review({ ...req.body })
  const campground = await Campground.findById(id)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  res.redirect(`/campground/${id}`)
}))

// delete a review from the campground
app.delete("/campground/:id/reviews/:reviewId", catchAsync(async (req, res) => {
  const { id, reviewId } = req.params
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/campground/${id}`)
}))


// unknown routes not defined in server
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404))
})

// custom error route
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) {
    err.message = "Something Went Wrong"
  }
  res.status(statusCode).render("error", { err })
})

app.listen("3000", () => {
  console.log("App is listening on port 3000");
})
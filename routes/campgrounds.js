const express = require("express")
const router = express.Router()
// joi schemas for validation
const { campgroundSchema } = require("../schemas")
// database models
const { Campground } = require("../models/campground")
// wrapper function for async errors
const catchAsync = require("../utils/catchAsync")
// custom error class
const { ExpressError } = require("../utils/expressError")

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

// view all campgrounds
router.get("/", catchAsync(async (req, res) => {
  let campgrounds = await Campground.find({})
  res.render("campground/index", { campgrounds })
}))

// create new campground
router.get("/new", (req, res) => {
  res.render("campground/new")
})

router.post("/", validateCampground, catchAsync(async (req, res, next) => {

  let newCamp = Campground({
    ...req.body
  })
  newCamp = await newCamp.save()
  req.flash("success", "Successfully made a new campground")
  res.redirect(`/campground/${newCamp._id}`)
}))

// edit a campground
router.get("/:id/edit", catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render("campground/edit", { campground })
}))

router.put("/:id", validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body })
  res.redirect(`/campground/${id}`)
}))

// delete a campground
router.delete("/:id", catchAsync(async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect("/campground")
}))

// view one campground detail
router.get("/:id", catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id).populate("reviews")
  res.render("campground/show", { campground })
}))

module.exports = router
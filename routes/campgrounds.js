const express = require("express")
const router = express.Router()
// database models
const { Campground } = require("../models/campground")
// wrapper function for async errors
const catchAsync = require("../utils/catchAsync")
// // custom error class
// const { ExpressError } = require("../utils/expressError")
// middleware for authentication
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")

// view all campgrounds
router.get("/", catchAsync(async (req, res) => {
  let campgrounds = await Campground.find({})
  res.render("campground/index", { campgrounds })
}))

// create new campground
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campground/new")
})

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  let newCamp = new Campground({
    ...req.body
  })
  newCamp.author = req.user._id
  newCamp = await newCamp.save()
  req.flash("success", "Successfully made a new campground")
  res.redirect(`/campground/${newCamp._id}`)
}))

// edit a campground
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash("error", "Campground cannot be found!")
    return res.redirect("/campground")
  }
  res.render("campground/edit", { campground })
}))

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body })
  req.flash("success", "Successfully updated campground")
  res.redirect(`/campground/${id}`)
}))

// delete a campground
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash("success", "Successfully deleted campground")
  res.redirect("/campground")
}))

// view one campground detail
router.get("/:id", catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  }).populate("author")
  if (!campground) {
    req.flash("error", "Campground cannot be found!")
    return res.redirect("/campground")
  }
  res.render("campground/show", { campground })
}))

module.exports = router
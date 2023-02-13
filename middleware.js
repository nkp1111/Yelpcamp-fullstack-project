// joi schemas for validation
const { campgroundSchema, reviewSchema } = require("./schemas")
// custom error class
const { ExpressError } = require("./utils/expressError")
// database models
const { Campground } = require("./models/campground")
const { Review } = require("./models/reviews")

// use joi library for campground form data validation
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    let message = error.details.map(item => item.message).join(", ")
    throw new ExpressError(message, 400)
  } else {
    next()
  }
}
// verify if the current user is logged in 
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be Signed in first!")
    return res.redirect("/login")
  }
  next()
}
// authorize current user for author permissions
const isAuthor = async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do this.")
    return res.redirect(`/campground/${id}`)
  }
  next()
}
// authorize current user for author permissions
const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do this.")
    return res.redirect(`/campground/${id}`)
  }
  next()
}
// use joi library for review form data validation
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    let message = error.details.map(item => item.message).join(", ")
    throw new ExpressError(message, 400)
  } else {
    next()
  }
}

module.exports = {
  validateCampground,
  isLoggedIn,
  isAuthor,
  validateReview,
  isReviewAuthor,
}
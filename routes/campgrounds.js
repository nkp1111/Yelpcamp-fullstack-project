const express = require("express")
const router = express.Router()

// wrapper function for async errors
const catchAsync = require("../utils/catchAsync")
// middleware for authentication
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")
// controller
const campground = require("../controllers/campground")


router.route("/")
  .get(catchAsync(campground.index))
  .post(isLoggedIn, validateCampground, catchAsync(campground.createNewCamp))

router.get("/new", isLoggedIn, campground.renderNewForm)

router.route("/:id")
  .get(catchAsync(campground.detailCampView))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campground.editCamp))
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCamp))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

module.exports = router
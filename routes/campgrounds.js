const express = require("express")
const router = express.Router()
// multer for handling file upload
const multer = require("multer")
const { storage } = require("../cloudinary")
const upload = multer({ storage })

// wrapper function for async errors
const catchAsync = require("../utils/catchAsync")
// middleware for authentication
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")
// controller
const campground = require("../controllers/campground")


router.route("/")
  .get(catchAsync(campground.index))
  .post(upload.array("image"), (req, res) => {
    // temp route for testing
    console.log(req.body, req.files)
    res.send(req.body)
  })
  .post(isLoggedIn, validateCampground, catchAsync(campground.createNewCamp))

router.get("/new", isLoggedIn, campground.renderNewForm)

router.route("/:id")
  .get(catchAsync(campground.detailCampView))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campground.editCamp))
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCamp))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

module.exports = router
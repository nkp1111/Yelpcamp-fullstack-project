const express = require("express")
const router = express.Router()
const { User } = require("../models/user")
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")


// to register a new user
router.get("/register", (req, res) => {
  res.render("user/register")
})

router.post("/register", catchAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, err => {
      if (err) {
        next(err)
      }
      req.flash("success", "Welcome to Yelp Camp!")
      res.redirect("/campground")
    })

  } catch (e) {
    req.flash("error", e.message)
    res.redirect("/register")
  }
}))

// to login an already registered user
router.get("/login", (req, res) => {
  res.render("user/login")
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
  req.flash("success", "Welcome Back!")
  res.redirect("/campground")
})

// to logout a user
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      req.flash("error", err.message)
    } else {
      req.flash("success", "Successfully logged out!")
    }
    res.redirect("/campground")
  })
})

module.exports = router
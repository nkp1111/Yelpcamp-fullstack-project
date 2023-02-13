const express = require("express")
const router = express.Router()
const { User } = require("../models/user")
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
// controller
const user = require("../controllers/user")


router.get("/register", user.renderRegisterForm)

router.post("/register", catchAsync(user.register))

router.get("/login", user.renderLoginForm)

router.post("/login",
  passport.authenticate("local",
    { failureFlash: true, failureRedirect: "/login" }),
  user.login)

router.get("/logout", user.logout)

module.exports = router
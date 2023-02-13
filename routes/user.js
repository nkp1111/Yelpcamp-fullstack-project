const express = require("express")
const router = express.Router()
const { User } = require("../models/user")
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
// controller
const user = require("../controllers/user")

router.route("/register")
  .get(user.renderRegisterForm)
  .post(catchAsync(user.register))

router.route("/login")
  .get(user.renderLoginForm)
  .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), user.login)

router.get("/logout", user.logout)

module.exports = router
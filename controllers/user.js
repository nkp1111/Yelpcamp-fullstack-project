const { User } = require("../models/user")

// render register form for new user 
const renderRegisterForm = (req, res) => {
  res.render("user/register")
}

// register new user
const register = async (req, res, next) => {
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
}

// render login form 
const renderLoginForm = (req, res) => {
  res.render("user/login")
}

// after login redirect
const login = (req, res) => {
  const returnUrl = req.session.returnTo || "/campground"
  req.flash("success", "Welcome Back!")
  delete req.session.returnTo
  res.redirect(returnUrl)
}

// to logout a user
const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      req.flash("error", err.message)
    } else {
      req.flash("success", "Successfully logged out!")
    }
    res.redirect("/campground")
  })
}

module.exports = {
  renderRegisterForm,
  register,
  renderLoginForm,
  login,
  logout,
}
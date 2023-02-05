const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()
const { Campground } = require("./models/campground")

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
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")


// app routes
app.get("/", (req, res) => {
  res.render("home")
})

app.get("/makeCamp", async (req, res) => {
  let camp = new Campground({
    title: "new one"
  })
  let newCamp = await camp.save()
  res.send(newCamp)
})

app.listen("3000", () => {
  console.log("App is listening on port 3000");
})
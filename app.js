const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()

app.set("views", __dirname + "/views")
app.set("view engine", "ejs")


app.get("/", (req, res) => {
  res.render("home")
})

app.listen("3000", () => {
  console.log("App is listening on port 3000");
})
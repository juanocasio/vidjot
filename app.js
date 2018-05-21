const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
require("./models/Idea");

const app = express();

const ideas = require("./routes/ideas");
const users = require("./routes/users");
const PORT = 5000;

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://localhost/vidjot-dev", {})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//ROUTES
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.use("/ideas", ideas);

app.use("/users", users);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

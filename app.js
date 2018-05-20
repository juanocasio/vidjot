const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
require("./models/Idea");

const app = express();
const Idea = mongoose.model("ideas");
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

app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

//Form routes
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

app.put("/ideas/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
    .then(idea => {
      res.redirect("/ideas");
    });
  });
});

app.delete('/ideas/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
  .then(() =>{
    res.redirect('/ideas')
  });
});

//Form routes
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

app.post("/ideas", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Title is required" });
  }

  if (!req.body.details) {
    errors.push({ text: "Details are required" });
  }

  if (errors.length > 0) {
    console.log("Err");
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };

    new Idea(newUser).save().then(idea => {
      res.redirect("/ideas");
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

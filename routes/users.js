const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");


//User Login Routes
router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.send('Register');
});

module.exports = router;
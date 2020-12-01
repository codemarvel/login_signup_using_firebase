const express = require('express');
const app = express();
const port = 3000;
var firebase = require("firebase/app");
const route=require('./routes/auth');
const admin = require('firebase-admin');
let ejs=require('ejs');
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/signup', (req, res) => {
  res.render('signup.ejs');
})
app.get('/login', (req, res) => {
  res.render('login.ejs');
})

app.use('/',route);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
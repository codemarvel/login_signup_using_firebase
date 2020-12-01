var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");

var bodyParser=require('body-parser')
const serviceAccount=require('../task-b221e-firebase-adminsdk-xlt0g-a35b743177.json');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

 


var firebaseConfig = {
    apiKey: "AIzaSyCo6DLYD6Z-buq0Ng7xKLlj-Ae2x8N7LnA",
    authDomain: "task-b221e.firebaseapp.com",
    databaseURL: "https://task-b221e.firebaseio.com",
    projectId: "task-b221e",
    storageBucket: "task-b221e.appspot.com",
    messagingSenderId: "662478730354",
    appId: "1:662478730354:web:18a52ee8673d8d642c3eeb"
  };
  
 // app.engine("html",require('ejs').renderFile);
  
firebase.initializeApp(firebaseConfig);

var auth=require('firebase/auth');
const e = require('express');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Home page route.
router.post('/signup', function (req, res) {
    
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((cred)=>{
      console.log("sucessfully signed up ");
      res.render("post_first_login.ejs",{user:cred.user});   
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + errorMessage);
      res.send(errorCode + errorMessage);
    });

    
    
});

router.post('/enter_details',function(req,res){

  firebase.auth().onAuthStateChanged(function(cred) {
    if (cred) {
      console.log(cred.uid);
      
       db.collection('users').doc(cred.uid).set({
        name:req.body.name,
        dob:req.body.dob,
        city:req.body.place_of_birth
       });
       res.redirect('/profile');
    } else {
      
      console.log("some error happened in enter details ");
      res.send("Please signup First");
    }
  });

})

router.get('/',function(req,res){
  res.render("home.ejs");
})
//
router.get('/profile',function(req,res){
  firebase.auth().onAuthStateChanged(function(cred) {
    if (cred) {
      console.log(cred.uid);
     const link = db.collection('users').doc(cred.uid);
        link.get().then((data)=>{
        if (!data) 
        {
          console.log('No such document!');
          res.send("No such document exist")
          } 
        else {
          items =data.data();
          console.log('Document data:', items);
          res.render('profile.ejs',{user:items});
        }  
      });
      
        
    } else {
      res.send("Please Login First");
    }
  });
})
// About page route.
router.post('/login', function (req, res) {
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((cred) => {
      console.log(firebase.auth().currentUser.uid+" sucessfully signed in");
      //console.log(cred.user);
      res.redirect('/profile');
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + errorMessage);
      res.send( errorMessage);
    });
  
});
router.get('/signout',function(req,res){

    firebase.auth().signOut().then(function() {
        console.log("Signed out sucessfully");
        res.redirect('/');
      }).catch((error)=> {
        console.log("no one is signed in lmao!!!!");
      });
     

})

module.exports = router;
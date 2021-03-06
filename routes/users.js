const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const passport = require('passport');

//User model
const User =  require('../models/User');


//Login Page
router.get('/login',(req,res) => res.render('login'));


//Logout
router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg', 'Logged out');
    res.redirect('/users/login');
});

//Register Page
router.get('/register',(req,res) => res.render('register'));


//Register handle
router.post('/register',(req,res)=>{
    const { name, email, password , password2} = req.body;
    let errors = [];

    //Checkr required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }

    //Check password match
    if(password != password2){
        errors.push({msg: 'Password do not match'});
    }

    //Check pass length
    if(password.length<6){
        errors.push({msg: "Password should be at least 6 characters"});
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //Validation Passed
        User.findOne({email: email})
        .then(user => {
            if(user){
                //User Exist
                errors.push({msg: 'Email already exist'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                //Password enryption using bcrypt
                bcrypt.genSalt(10, (err , salt) => bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err) throw err;
                    // update password
                    newUser.password = hash;
                    //Save user to mondo db using mongoose
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg','Registered Successfully!');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }));
            }
        });
    }

});


//Login Post Request
router.post('/login',(req,res,next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});



//testing api's
router.get('/getAllusers',(req,res)=>{
    User.find()
      .then((result)=>{
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
  
router.get('/single-userid/:id',(req,res)=>{
    //'611d24211afcd32220d05087'
    User.findById(req.params.id)
      .then((result)=>{
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      });
});


module.exports = router;
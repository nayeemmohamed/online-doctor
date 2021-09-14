const express = require('express');
const router  = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const doctorController = require('../controllers/doctorController');
const passport = require('passport');




router.get('/login',(req,res) => res.render('doctor/login'));
router.get('/register',(req,res) => res.render('doctor/register'));
router.post('/register',doctorController.register);

//Doctor Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('doctor/dashboard', {
    user: req.user
  })
);


router.get('/add',ensureAuthenticated,doctorController.add);
router.get('/getAll',doctorController.getAll);
router.get('/getByTime/:startTime/:endTime/:speciality',doctorController.getByTime);
router.get('/getSpecilities',doctorController.getSpecilities);
router.post('/bookAppointment',doctorController.bookAppointment);


//Login Post Request
router.post('/login',(req,res,next) =>{
    passport.authenticate('local-2', {
        successRedirect: '/doctor/dashboard',
        failureRedirect: '/doctor/login',
        failureFlash: true
    })(req,res,next);
});

//Logout
router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg', 'Logged out');
    res.redirect('/doctor/login');
}); 


module.exports = router;
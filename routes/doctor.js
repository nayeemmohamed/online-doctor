const express = require('express');
const router  = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const doctorController = require('../controllers/doctorController');




router.get('/login',(req,res) => res.render('doctor/login'));
router.get('/register',(req,res) => res.render('doctor/register'));
router.post('/register',doctorController.register);


router.get('/add',ensureAuthenticated,doctorController.add);
router.get('/getAll',doctorController.getAll);
router.get('/getByTime/:startTime/:endTime',doctorController.getByTime);
router.post('/bookAppointment',doctorController.bookAppointment);


module.exports = router;
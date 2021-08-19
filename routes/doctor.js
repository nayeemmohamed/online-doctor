const express = require('express');
const router  = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const doctorController = require('../controllers/doctorController');




router.get('/add',ensureAuthenticated,doctorController.add);
router.get('/getAll',doctorController.getAll);
router.post('/getByTime/:startTime/:endTime',doctorController.getByTime);
router.post('/bookAppointment',doctorController.bookAppointment);


module.exports = router;
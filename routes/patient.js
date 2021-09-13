/**
 * author qiaoli wang
 * wangqiao@deakin.edu.au
 */
const express = require('express');
const router  = express.Router();
const patientController = require('../controllers/patientController');




router.post('/updateProfile',patientController.updateProfile);
router.post('/bookAppointment',patientController.bookAppointment);
router.get('/patientAppointments',patientController.getPatientAppointment);
router.post('/cancelPatientAppointment',patientController.cancelPatientAppointment);


module.exports = router;
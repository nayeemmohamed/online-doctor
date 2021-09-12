/**
 * author qiaoli wang
 * wangqiao@deakin.edu.au
 */
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    doctor_id:{
        type: String,
        required: true 
    },
    patient_id:{
        type: String,
    },
    startTime:{
        type: String,
        required: true 
    },
    endTime:{
        type: String,
        required: true 
    },
    date:{
        type: Date,
        default: Date.now 
    }
});

const Appointment = mongoose.model('Appointment',AppointmentSchema);
module.exports = Appointment;
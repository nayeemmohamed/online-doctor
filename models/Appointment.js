/**
 * author qiaoli wang
 * wangqiao@deakin.edu.au
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const AppointmentSchema = new mongoose.Schema({
    doctor_id:{
        type: String,
        required: true 
    },
    patient_id:{
        type: String,
    },
    doctor: [{ type: Schema.Types.ObjectId, ref:'Doctor' }],
    patient: [{ type: Schema.Types.ObjectId, ref:'Patient' }],

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
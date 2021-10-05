/**
 * author qiaoli wang
 * wangqiao@deakin.edu.au
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const AppointmentSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true 
    },
    doctor: {type:Object},
    patient: { type:Object},
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
    },
    state:{
        type:String,
        required: true,
        default:"request" //1:request,2:confirmed,3:done,4:feedback
    }
});

const Appointment = mongoose.model('Appointment',AppointmentSchema);
module.exports = Appointment;